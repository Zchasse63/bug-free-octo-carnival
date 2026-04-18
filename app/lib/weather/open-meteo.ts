import { createServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/lib/supabase/types";

const ARCHIVE = "https://archive-api.open-meteo.com/v1/archive";
const FORECAST = "https://api.open-meteo.com/v1/forecast";

type WeatherRow = Database["public"]["Tables"]["activity_weather"]["Insert"];

type HourlyResponse = {
  hourly?: {
    time: string[];
    temperature_2m?: number[];
    apparent_temperature?: number[];
    relative_humidity_2m?: number[];
    dew_point_2m?: number[];
    wind_speed_10m?: number[];
    wind_direction_10m?: number[];
    precipitation?: number[];
    weathercode?: number[];
    uv_index?: number[];
  };
};

function nearestHourIndex(times: string[], target: Date): number {
  const targetMs = target.getTime();
  let bestIdx = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - targetMs);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function precipitationBucket(mm: number | undefined): string {
  if (mm === undefined || mm === null) return "none";
  if (mm < 0.1) return "none";
  if (mm < 2.5) return "light_rain";
  if (mm < 10) return "moderate_rain";
  return "heavy_rain";
}

function conditionsFromCode(code: number | undefined): string {
  if (code === undefined) return "unknown";
  if (code === 0) return "clear";
  if ([1, 2, 3].includes(code)) return "partly_cloudy";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "thunderstorm";
  return "cloudy";
}

function windDirText(deg: number | undefined): string {
  if (deg === undefined) return "unknown";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export async function fetchActivityWeather(
  activityId: number,
  athleteId: number,
  startIso: string,
  lat: number,
  lng: number,
): Promise<WeatherRow | null> {
  const date = startIso.slice(0, 10);
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lng.toFixed(4),
    start_date: date,
    end_date: date,
    hourly:
      "temperature_2m,apparent_temperature,relative_humidity_2m,dew_point_2m,wind_speed_10m,wind_direction_10m,precipitation,weathercode,uv_index",
    timezone: "UTC",
  });

  const start = new Date(startIso);
  const useArchive = Date.now() - start.getTime() > 5 * 24 * 60 * 60 * 1000;
  const url = `${useArchive ? ARCHIVE : FORECAST}?${params}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as HourlyResponse;
  if (!json.hourly?.time?.length) return null;

  const idx = nearestHourIndex(json.hourly.time, start);
  const temp = json.hourly.temperature_2m?.[idx];
  const feels = json.hourly.apparent_temperature?.[idx];
  const humidity = json.hourly.relative_humidity_2m?.[idx];
  const dew = json.hourly.dew_point_2m?.[idx];
  const windKmh = json.hourly.wind_speed_10m?.[idx];
  const windDir = json.hourly.wind_direction_10m?.[idx];
  const precip = json.hourly.precipitation?.[idx];
  const code = json.hourly.weathercode?.[idx];
  const uv = json.hourly.uv_index?.[idx];

  return {
    activity_id: activityId,
    athlete_id: athleteId,
    temperature_c: temp ?? null,
    feels_like_c: feels ?? null,
    humidity_pct: humidity !== undefined ? Math.round(humidity) : null,
    dew_point_c: dew ?? null,
    wind_speed_kmh: windKmh ?? null,
    wind_direction: windDirText(windDir),
    precipitation: precipitationBucket(precip),
    conditions: conditionsFromCode(code),
    uv_index: uv !== undefined ? Math.round(uv) : null,
    weather_source: "open-meteo",
  };
}

export async function backfillWeather(
  athleteId: number,
  maxToProcess = 3000,
): Promise<{ processed: number; failed: number; skipped: number }> {
  const sb = createServiceClient();
  const { data: activities, error } = await sb
    .from("activities")
    .select("id, start_date, start_lat, start_lng")
    .eq("athlete_id", athleteId)
    .not("start_lat", "is", null)
    .not("start_lng", "is", null)
    .order("start_date", { ascending: false })
    .limit(maxToProcess);
  if (error) throw error;
  if (!activities) return { processed: 0, failed: 0, skipped: 0 };

  // Skip activities that already have weather
  const { data: existing } = await sb
    .from("activity_weather")
    .select("activity_id")
    .eq("athlete_id", athleteId);
  const have = new Set((existing ?? []).map((r) => r.activity_id));

  let processed = 0;
  let failed = 0;
  let skipped = 0;

  for (const a of activities) {
    if (have.has(a.id)) {
      skipped += 1;
      continue;
    }
    if (a.start_lat === null || a.start_lng === null) {
      skipped += 1;
      continue;
    }
    try {
      const row = await fetchActivityWeather(
        a.id,
        athleteId,
        a.start_date,
        a.start_lat,
        a.start_lng,
      );
      if (!row) {
        failed += 1;
        continue;
      }
      const { error: insertErr } = await sb.from("activity_weather").upsert(row, {
        onConflict: "activity_id",
      });
      if (insertErr) throw insertErr;
      processed += 1;
      // Open-Meteo fair use throttle — be polite
      if (processed % 30 === 0) await new Promise((r) => setTimeout(r, 1000));
    } catch (e) {
      failed += 1;
      console.error(`Weather fetch failed for activity ${a.id}`, e);
    }
  }

  return { processed, failed, skipped };
}
