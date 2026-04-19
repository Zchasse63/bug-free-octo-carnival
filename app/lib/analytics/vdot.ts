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
 * Jack Daniels v4 VDOT training paces, seconds per kilometer.
 * Anchor rows are the published table values; we linearly interpolate
 * between them and clamp at the endpoints. VDOT 51.2 through this table:
 * E≈311s/km (8:21/mi), M≈270 (7:14/mi), T≈249 (6:41/mi), I≈230 (6:10/mi), R≈210 (5:38/mi).
 */
const VDOT_PACE_TABLE: ReadonlyArray<{
  vdot: number;
  easy: number;
  marathon: number;
  threshold: number;
  interval: number;
  repetition: number;
}> = [
  { vdot: 30, easy: 506, marathon: 425, threshold: 401, interval: 383, repetition: 355 },
  { vdot: 35, easy: 433, marathon: 379, threshold: 354, interval: 336, repetition: 311 },
  { vdot: 40, easy: 378, marathon: 341, threshold: 317, interval: 298, repetition: 275 },
  { vdot: 45, easy: 342, marathon: 308, threshold: 284, interval: 266, repetition: 246 },
  { vdot: 50, easy: 317, marathon: 275, threshold: 254, interval: 235, repetition: 215 },
  { vdot: 55, easy: 294, marathon: 253, threshold: 233, interval: 214, repetition: 194 },
  { vdot: 60, easy: 274, marathon: 236, threshold: 217, interval: 198, repetition: 181 },
  { vdot: 65, easy: 259, marathon: 221, threshold: 204, interval: 185, repetition: 168 },
  { vdot: 70, easy: 244, marathon: 209, threshold: 192, interval: 173, repetition: 157 },
  { vdot: 75, easy: 232, marathon: 199, threshold: 181, interval: 163, repetition: 148 },
  { vdot: 80, easy: 220, marathon: 189, threshold: 172, interval: 155, repetition: 140 },
  { vdot: 85, easy: 211, marathon: 181, threshold: 165, interval: 148, repetition: 134 },
];

export function pacesFromVdot(vdot: number) {
  if (vdot <= 0) return null;
  const table = VDOT_PACE_TABLE;
  if (vdot <= table[0].vdot) {
    const r = table[0];
    return {
      easy: r.easy,
      marathon: r.marathon,
      threshold: r.threshold,
      interval: r.interval,
      repetition: r.repetition,
    };
  }
  if (vdot >= table[table.length - 1].vdot) {
    const r = table[table.length - 1];
    return {
      easy: r.easy,
      marathon: r.marathon,
      threshold: r.threshold,
      interval: r.interval,
      repetition: r.repetition,
    };
  }
  for (let i = 0; i < table.length - 1; i++) {
    const lo = table[i];
    const hi = table[i + 1];
    if (vdot >= lo.vdot && vdot <= hi.vdot) {
      const frac = (vdot - lo.vdot) / (hi.vdot - lo.vdot);
      const interp = (a: number, b: number) => Math.round(a + (b - a) * frac);
      return {
        easy: interp(lo.easy, hi.easy),
        marathon: interp(lo.marathon, hi.marathon),
        threshold: interp(lo.threshold, hi.threshold),
        interval: interp(lo.interval, hi.interval),
        repetition: interp(lo.repetition, hi.repetition),
      };
    }
  }
  return null;
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
