import { createServiceClient } from "@/lib/supabase/service";

const SPORT_FACTORS: Record<string, number> = {
  Run: 1.2,
  TrailRun: 1.2,
  VirtualRun: 1.0,
  Hike: 0.6,
  Walk: 0.4,
  Ride: 0.9,
  VirtualRide: 0.8,
  Swim: 1.0,
  WeightTraining: 0.8,
  Workout: 0.9,
  Yoga: 0.3,
  HIIT: 1.5,
};

/** Compute a training load score for one activity, prefer Strava suffer_score. */
export function computeActivityLoad(a: {
  sport_type: string;
  moving_time: number;
  average_heartrate: number | null;
  suffer_score: number | null;
  max_heartrate?: number | null;
}): number {
  if (a.suffer_score !== null && a.suffer_score !== undefined) return a.suffer_score;

  const durationMin = a.moving_time / 60;

  // Rough hrTSS approximation when HR is present.
  if (a.average_heartrate && a.max_heartrate) {
    const lthr = a.max_heartrate * 0.89;
    const intensityFactor = a.average_heartrate / lthr;
    return Math.round(
      ((a.moving_time * a.average_heartrate * intensityFactor) / (lthr * 3600)) * 100,
    );
  }

  const factor = SPORT_FACTORS[a.sport_type] ?? 0.8;
  return Math.round(durationMin * factor);
}

/**
 * Compute daily CTL (42-day EMA), ATL (7-day EMA), TSB (CTL-ATL),
 * and weekly ACWR for every athlete.
 */
export async function recomputeTrainingLoad(athleteId: number) {
  const sb = createServiceClient();
  const PAGE = 1000;
  type Row = {
    id: number;
    start_date: string;
    start_date_local: string;
    sport_type: string;
    moving_time: number;
    average_heartrate: number | null;
    max_heartrate: number | null;
    suffer_score: number | null;
    training_load: number | null;
  };
  const activities: Row[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await sb
      .from("activities")
      .select(
        "id, start_date, start_date_local, sport_type, moving_time, average_heartrate, max_heartrate, suffer_score, training_load",
      )
      .eq("athlete_id", athleteId)
      .order("start_date", { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    activities.push(...(data as Row[]));
    if (data.length < PAGE) break;
  }
  if (activities.length === 0) return { updated: 0 };

  let updated = 0;
  const loadUpdates: { id: number; training_load: number }[] = [];

  for (const a of activities) {
    if (a.moving_time <= 0) continue;
    const load = computeActivityLoad(a);
    if (a.training_load !== load) {
      loadUpdates.push({ id: a.id, training_load: load });
    }
  }

  // Batch update loads
  for (const batch of chunk(loadUpdates, 100)) {
    for (const { id, training_load } of batch) {
      await sb.from("activities").update({ training_load }).eq("id", id);
    }
    updated += batch.length;
  }
  return { updated };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export type DailySeriesPoint = {
  date: string; // YYYY-MM-DD
  load: number;
  ctl: number;
  atl: number;
  tsb: number;
};

/** Given chronological daily loads, compute CTL/ATL/TSB series. */
export function computeDailySeries(
  rows: { date: string; load: number }[],
): DailySeriesPoint[] {
  if (rows.length === 0) return [];
  const byDate = new Map<string, number>();
  for (const r of rows) byDate.set(r.date, (byDate.get(r.date) ?? 0) + r.load);
  const start = new Date(rows[0].date);
  const end = new Date(rows[rows.length - 1].date);
  const out: DailySeriesPoint[] = [];
  let ctl = 0;
  let atl = 0;
  const CTL_TC = 42;
  const ATL_TC = 7;

  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    const key = d.toISOString().slice(0, 10);
    const load = byDate.get(key) ?? 0;
    ctl = ctl + (1 / CTL_TC) * (load - ctl);
    atl = atl + (1 / ATL_TC) * (load - atl);
    out.push({
      date: key,
      load,
      ctl: Math.round(ctl * 10) / 10,
      atl: Math.round(atl * 10) / 10,
      tsb: Math.round((ctl - atl) * 10) / 10,
    });
  }
  return out;
}

function addDays(d: Date, n: number) {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + n);
  return out;
}

/** Weekly rollup: populates weekly_summaries table. */
export async function rollupWeeklySummaries(athleteId: number) {
  const sb = createServiceClient();
  // Page through all activities — Supabase caps responses at 1000 rows by default.
  const PAGE = 1000;
  type ActivityRow = {
    id: number;
    start_date_local: string;
    sport_type: string;
    moving_time: number;
    distance_meters: number | null;
    total_elevation_gain: number | null;
    average_heartrate: number | null;
    suffer_score: number | null;
    training_load: number | null;
    workout_classification: string | null;
  };
  const activities: ActivityRow[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await sb
      .from("activities")
      .select(
        "id, start_date_local, sport_type, moving_time, distance_meters, total_elevation_gain, average_heartrate, suffer_score, training_load, workout_classification",
      )
      .eq("athlete_id", athleteId)
      .order("start_date_local", { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    activities.push(...(data as ActivityRow[]));
    if (data.length < PAGE) break;
  }
  if (activities.length === 0) return { weeks: 0 };

  // Group by ISO week Monday
  const byWeek = new Map<string, typeof activities>();
  for (const a of activities) {
    const d = new Date(a.start_date_local);
    const monday = mondayOf(d).toISOString().slice(0, 10);
    if (!byWeek.has(monday)) byWeek.set(monday, []);
    byWeek.get(monday)!.push(a);
  }

  const rows = Array.from(byWeek.entries()).map(([weekStart, acts]) => {
    const runs = acts.filter(
      (a) => a.sport_type === "Run" || a.sport_type === "TrailRun",
    );
    const runDistance = runs.reduce((s, a) => s + (Number(a.distance_meters) || 0), 0);
    const runTime = runs.reduce((s, a) => s + (a.moving_time ?? 0), 0);
    const runElev = runs.reduce(
      (s, a) => s + (Number(a.total_elevation_gain) || 0),
      0,
    );
    const hrs = runs.map((a) => a.average_heartrate).filter((x): x is number => x !== null);
    const avgHr = hrs.length ? hrs.reduce((a, b) => a + b, 0) / hrs.length : null;
    const totalLoad = acts.reduce((s, a) => s + (a.training_load ?? 0), 0);
    const classDist: Record<string, number> = {};
    for (const a of acts) {
      const k = a.workout_classification ?? "uncategorized";
      classDist[k] = (classDist[k] ?? 0) + 1;
    }
    const longest = runs.reduce(
      (max, a) =>
        Number(a.distance_meters ?? 0) > Number(max?.distance_meters ?? 0) ? a : max,
      runs[0],
    );
    const weekDate = new Date(weekStart);
    return {
      athlete_id: athleteId,
      week_start: weekStart,
      week_number: isoWeek(weekDate),
      year: weekDate.getUTCFullYear(),
      total_activities: acts.length,
      run_count: runs.length,
      run_distance_meters: runDistance,
      run_moving_time: runTime,
      run_elevation_gain: runElev,
      avg_run_heartrate: avgHr,
      avg_run_pace_seconds_per_km:
        runTime > 0 && runDistance > 0
          ? Math.round(runTime / (runDistance / 1000))
          : null,
      total_training_load: totalLoad,
      workout_type_distribution: classDist,
      long_run_distance_meters: longest?.distance_meters ?? null,
      long_run_date: longest?.start_date_local?.slice(0, 10) ?? null,
    };
  });

  for (const batch of chunk(rows, 100)) {
    const { error: upErr } = await sb
      .from("weekly_summaries")
      .upsert(batch, { onConflict: "athlete_id,week_start" });
    if (upErr) throw upErr;
  }

  return { weeks: rows.length };
}

function mondayOf(d: Date): Date {
  const out = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = out.getUTCDay(); // 0=Sun..6=Sat
  const diff = dow === 0 ? -6 : 1 - dow;
  out.setUTCDate(out.getUTCDate() + diff);
  return out;
}

function isoWeek(d: Date): number {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}
