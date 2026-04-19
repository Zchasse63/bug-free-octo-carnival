import { createServiceClient } from "@/lib/supabase/service";
import { embedMany } from "@/lib/ai/openai";

type ActivityForEmbed = {
  id: number;
  athlete_id: number;
  name: string;
  sport_type: string;
  workout_classification: string | null;
  start_date_local: string;
  moving_time: number;
  distance_meters: number | null;
  total_elevation_gain: number | null;
  average_heartrate: number | null;
  max_heartrate: number | null;
  average_cadence: number | null;
  average_watts: number | null;
  pace_per_km_seconds: number | null;
  training_load: number | null;
  city: string | null;
  description: string | null;
};

type WeatherRow = {
  activity_id: number;
  temperature_c: number | null;
  feels_like_c: number | null;
  humidity_pct: number | null;
  wind_speed_kmh: number | null;
  conditions: string | null;
};

type NoteRow = {
  activity_id: number;
  raw_text: string;
};

function dayLabel(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeOfDay(hour: number): string {
  if (hour < 5) return "pre-dawn";
  if (hour < 11) return "morning";
  if (hour < 14) return "midday";
  if (hour < 18) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

function formatPace(secsPerKm: number | null): string {
  if (!secsPerKm) return "—";
  const m = Math.floor(secsPerKm / 60);
  const s = Math.round(secsPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}/km`;
}

export function buildSummaryText(
  a: ActivityForEmbed,
  w?: WeatherRow,
  n?: NoteRow,
): string {
  const d = new Date(a.start_date_local);
  const km = a.distance_meters ? (Number(a.distance_meters) / 1000).toFixed(1) : "?";
  const mins = Math.round(a.moving_time / 60);
  const pace = formatPace(a.pace_per_km_seconds);
  const parts: string[] = [];
  parts.push(
    `${dayLabel(d)} ${timeOfDay(d.getHours())} ${a.sport_type}${a.city ? `, ${a.city}` : ""}.`,
  );
  parts.push(`${km}km in ${mins} min at ${pace}.`);
  if (a.average_heartrate) {
    parts.push(
      `Avg HR ${Math.round(a.average_heartrate)} bpm${a.max_heartrate ? ` (max ${Math.round(a.max_heartrate)})` : ""}.`,
    );
  }
  if (a.average_cadence) {
    parts.push(`Cadence ${Math.round(a.average_cadence * 2)} spm.`);
  }
  if (a.average_watts) {
    parts.push(`Avg power ${Math.round(a.average_watts)}W.`);
  }
  if (a.total_elevation_gain && Number(a.total_elevation_gain) > 20) {
    parts.push(`${Math.round(Number(a.total_elevation_gain))}m elevation gain.`);
  }
  if (a.workout_classification) {
    parts.push(`Type: ${a.workout_classification}.`);
  }
  if (w && (w.temperature_c != null || w.conditions)) {
    const temp =
      w.temperature_c != null ? `${Math.round(w.temperature_c)}°C` : "";
    const feels =
      w.feels_like_c != null && w.feels_like_c !== w.temperature_c
        ? ` (felt like ${Math.round(w.feels_like_c)}°C)`
        : "";
    const humidity = w.humidity_pct != null ? `, ${w.humidity_pct}% humidity` : "";
    const wind =
      w.wind_speed_kmh != null && w.wind_speed_kmh >= 10
        ? `, wind ${Math.round(w.wind_speed_kmh)} km/h`
        : "";
    parts.push(`Weather: ${temp}${feels}${humidity}${wind}, ${w.conditions ?? ""}.`);
  }
  if (n?.raw_text) {
    parts.push(`Athlete note: "${n.raw_text.replace(/\s+/g, " ").slice(0, 500)}".`);
  } else if (a.description) {
    parts.push(`Description: "${a.description.replace(/\s+/g, " ").slice(0, 300)}".`);
  }
  if (a.training_load != null) {
    parts.push(`Training load: ${a.training_load}.`);
  }
  return parts.join(" ");
}

export async function embedActivitiesBatch(
  athleteId: number,
  maxToProcess = 500,
): Promise<{ processed: number; failed: number }> {
  const sb = createServiceClient();

  const { data: athlete } = await sb
    .from("athletes")
    .select("city")
    .eq("id", athleteId)
    .maybeSingle();
  const city = athlete?.city ?? null;

  const { data: pending, error } = await sb
    .from("activities")
    .select(
      "id, athlete_id, name, sport_type, workout_classification, start_date_local, moving_time, distance_meters, total_elevation_gain, average_heartrate, max_heartrate, average_cadence, average_watts, pace_per_km_seconds, training_load, description",
    )
    .eq("athlete_id", athleteId)
    .eq("embedding_needs_update", true)
    .order("start_date_local", { ascending: false })
    .limit(maxToProcess);
  if (error) throw error;
  if (!pending || pending.length === 0) return { processed: 0, failed: 0 };

  const ids = pending.map((p) => p.id);
  const [{ data: weatherRows }, { data: noteRows }] = await Promise.all([
    sb
      .from("activity_weather")
      .select("activity_id, temperature_c, feels_like_c, humidity_pct, wind_speed_kmh, conditions")
      .in("activity_id", ids),
    sb
      .from("activity_notes")
      .select("activity_id, raw_text")
      .in("activity_id", ids),
  ]);
  const wByAct = new Map<number, WeatherRow>();
  for (const w of weatherRows ?? []) wByAct.set(w.activity_id, w as WeatherRow);
  const nByAct = new Map<number, NoteRow>();
  for (const n of noteRows ?? []) nByAct.set(n.activity_id, n as NoteRow);

  const summaries = pending.map((a) =>
    buildSummaryText({ ...a, city } as ActivityForEmbed, wByAct.get(a.id), nByAct.get(a.id)),
  );

  let processed = 0;
  let failed = 0;
  const BATCH = 100;
  for (let i = 0; i < summaries.length; i += BATCH) {
    const chunk = summaries.slice(i, i + BATCH);
    const chunkIds = ids.slice(i, i + BATCH);
    try {
      const vectors = await embedMany(chunk);
      const rows = chunkIds.map((id, j) => ({
        activity_id: id,
        athlete_id: athleteId,
        summary_text: chunk[j],
        embedding: `[${vectors[j].join(",")}]` as unknown as string,
        embedding_model: "text-embedding-3-small",
      }));
      const { error: upErr } = await sb
        .from("activity_embeddings")
        .upsert(rows, { onConflict: "activity_id" });
      if (upErr) throw upErr;
      await sb
        .from("activities")
        .update({ embedding_needs_update: false })
        .in("id", chunkIds);
      processed += chunk.length;
    } catch (e) {
      failed += chunk.length;
      console.error(`Embed batch failed at offset ${i}`, e);
    }
  }
  return { processed, failed };
}
