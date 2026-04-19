import { createServiceClient } from "@/lib/supabase/service";

/**
 * Jack Daniels' VDOT formula — infer VO2max from a race-pace performance.
 * Input: distance in meters, time in seconds.
 */
export function vdotFromPerformance(distance_m: number, time_s: number): number {
  if (distance_m <= 0 || time_s <= 0) return 0;
  const velocity = (distance_m / time_s) * 60; // meters per minute
  const vo2 = -4.6 + 0.182258 * velocity + 0.000104 * velocity * velocity;
  const timeMin = time_s / 60;
  const percentMax =
    0.8 +
    0.1894393 * Math.exp(-0.012778 * timeMin) +
    0.2989558 * Math.exp(-0.1932605 * timeMin);
  return Math.round((vo2 / percentMax) * 10) / 10;
}

/**
 * Standard race distances Strava reports best_efforts for.
 * Ordered by typical VDOT-estimate reliability: prefer longer/sustained efforts.
 */
const EFFORT_PRIORITY: Array<{ name: string; distanceM: number }> = [
  { name: "Half Marathon", distanceM: 21097.5 },
  { name: "10k", distanceM: 10000 },
  { name: "5k", distanceM: 5000 },
  { name: "2 mile", distanceM: 3218.69 },
  { name: "1 mile", distanceM: 1609.34 },
];

export async function recomputeVdot(athleteId: number) {
  const sb = createServiceClient();
  const { data: efforts } = await sb
    .from("best_efforts")
    .select("name, distance_meters, elapsed_time, start_date_local, pr_rank")
    .eq("athlete_id", athleteId)
    .order("start_date_local", { ascending: false })
    .limit(500);

  if (!efforts || efforts.length === 0) return { vdot: null };

  // Use best (lowest time) effort within the last 180 days for each priority distance.
  const cutoff = new Date(Date.now() - 180 * 86400000);
  let bestVdot = 0;
  let bestSource: string | null = null;
  for (const e of EFFORT_PRIORITY) {
    const candidates = efforts.filter(
      (x) =>
        x.name === e.name &&
        x.start_date_local != null &&
        new Date(x.start_date_local) >= cutoff &&
        Number(x.distance_meters) > 0 &&
        x.elapsed_time > 0,
    );
    if (candidates.length === 0) continue;
    const fastest = candidates.reduce((a, b) =>
      a.elapsed_time < b.elapsed_time ? a : b,
    );
    const v = vdotFromPerformance(Number(fastest.distance_meters), fastest.elapsed_time);
    if (v > bestVdot) {
      bestVdot = v;
      bestSource = `${e.name} — ${fastest.elapsed_time}s on ${(fastest.start_date_local ?? "").slice(0, 10)}`;
    }
  }

  if (bestVdot > 0) {
    const today = new Date().toISOString().slice(0, 10);
    await sb.from("athlete_zones").upsert(
      {
        athlete_id: athleteId,
        effective_date: today,
        estimated_vdot: bestVdot,
      },
      { onConflict: "athlete_id,effective_date" },
    );
  }

  return { vdot: bestVdot || null, source: bestSource };
}

/**
 * Daniels-derived paces from VDOT (seconds per km).
 * Simplified polynomial fits that match the published tables reasonably well.
 */
export function pacesFromVdot(vdot: number) {
  if (vdot <= 0) return null;
  // Fit y = a/vdot + b for each pace tier, calibrated against Daniels' tables.
  const easy = Math.round(60 * (270 / vdot + 1.7));       // Easy pace sec/km
  const marathon = Math.round(60 * (234 / vdot + 1.4));   // Marathon pace
  const threshold = Math.round(60 * (210 / vdot + 1.3));  // Threshold (tempo)
  const interval = Math.round(60 * (188 / vdot + 1.2));   // VO2max intervals
  const repetition = Math.round(60 * (175 / vdot + 1.1)); // Rep pace
  return { easy, marathon, threshold, interval, repetition };
}

/**
 * ACWR from the weekly_summaries table.
 */
export async function computeACWR(athleteId: number): Promise<{
  acwr: number | null;
  acute: number;
  chronic: number;
  level: "low" | "optimal" | "elevated" | "high";
}> {
  const sb = createServiceClient();
  const { data } = await sb
    .from("weekly_summaries")
    .select("week_start, total_training_load")
    .eq("athlete_id", athleteId)
    .order("week_start", { ascending: false })
    .limit(4);
  if (!data || data.length === 0)
    return { acwr: null, acute: 0, chronic: 0, level: "low" };

  const acute = Number(data[0].total_training_load) || 0;
  const chronic =
    data.slice(0, 4).reduce((s, r) => s + (Number(r.total_training_load) || 0), 0) / 4;
  const acwr = chronic > 0 ? acute / chronic : null;
  const level =
    acwr === null || acwr < 0.8
      ? "low"
      : acwr < 1.3
        ? "optimal"
        : acwr < 1.5
          ? "elevated"
          : "high";
  return {
    acwr: acwr ? Math.round(acwr * 100) / 100 : null,
    acute: Math.round(acute * 10) / 10,
    chronic: Math.round(chronic * 10) / 10,
    level,
  };
}
