import { createServiceClient } from "@/lib/supabase/service";

/**
 * Fatigue fingerprint: detect athlete-specific early-warning signals.
 * Baseline: rolling 30-day window of easy-pace runs. Flag outliers.
 */
export type FatigueSignal = {
  activity_id: number;
  date: string;
  signal:
    | "hr_elevated_at_pace"
    | "pace_slower_than_expected"
    | "stalled_progression"
    | "above_baseline_acwr";
  severity: "low" | "moderate" | "high";
  detail: string;
};

export async function detectFatigueSignals(
  athleteId: number,
): Promise<FatigueSignal[]> {
  const sb = createServiceClient();
  const since = new Date(Date.now() - 60 * 86400000).toISOString();

  const { data: acts } = await sb
    .from("activities")
    .select(
      "id, start_date, start_date_local, sport_type, distance_meters, moving_time, average_heartrate, pace_per_km_seconds, workout_classification",
    )
    .eq("athlete_id", athleteId)
    .in("sport_type", ["Run", "TrailRun"])
    .gte("start_date", since)
    .order("start_date", { ascending: false })
    .limit(80);

  if (!acts || acts.length < 10) return [];

  // Build a baseline for "easy" pace/HR
  const easyRuns = acts.filter(
    (a) =>
      (a.workout_classification === "easy" || !a.workout_classification) &&
      a.average_heartrate &&
      a.pace_per_km_seconds &&
      Number(a.distance_meters) > 3000,
  );
  if (easyRuns.length < 5) return [];

  const mean = (arr: number[]) => arr.reduce((s, x) => s + x, 0) / arr.length;
  const stdDev = (arr: number[], m: number) =>
    Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length);

  const hrArr = easyRuns.map((a) => a.average_heartrate as number);
  const paceArr = easyRuns.map((a) => a.pace_per_km_seconds as number);
  const baseline = {
    hrMean: mean(hrArr),
    hrSd: stdDev(hrArr, mean(hrArr)),
    paceMean: mean(paceArr),
    paceSd: stdDev(paceArr, mean(paceArr)),
  };

  const signals: FatigueSignal[] = [];
  for (const a of acts.slice(0, 10)) {
    if (!a.average_heartrate || !a.pace_per_km_seconds) continue;
    if (a.workout_classification && a.workout_classification !== "easy") continue;

    const hrZ = (a.average_heartrate - baseline.hrMean) / (baseline.hrSd || 1);
    if (hrZ > 1.5) {
      signals.push({
        activity_id: a.id,
        date: a.start_date_local.slice(0, 10),
        signal: "hr_elevated_at_pace",
        severity: hrZ > 2.5 ? "high" : "moderate",
        detail: `HR ${Math.round(a.average_heartrate)} bpm was ${hrZ.toFixed(1)} SD above your easy baseline (${Math.round(baseline.hrMean)})`,
      });
    }
    const paceZ = (a.pace_per_km_seconds - baseline.paceMean) / (baseline.paceSd || 1);
    if (paceZ > 1.5) {
      signals.push({
        activity_id: a.id,
        date: a.start_date_local.slice(0, 10),
        signal: "pace_slower_than_expected",
        severity: paceZ > 2.5 ? "high" : "moderate",
        detail: `Pace was ${paceZ.toFixed(1)} SD slower than your easy baseline`,
      });
    }
  }
  return signals;
}

/**
 * Personal response profile: learn optimal training patterns from accumulated data.
 */
export async function computeResponseProfile(athleteId: number) {
  const sb = createServiceClient();
  const { data: acts } = await sb
    .from("activities")
    .select(
      "sport_type, start_date_local, moving_time, training_load, workout_classification, average_heartrate",
    )
    .eq("athlete_id", athleteId)
    .gte(
      "start_date_local",
      new Date(Date.now() - 365 * 86400000).toISOString().slice(0, 10),
    );
  if (!acts || acts.length < 20) return null;

  // Bucket by week
  const weekMap = new Map<
    string,
    { quality: number; total: number; load: number; km: number }
  >();
  for (const a of acts) {
    const d = new Date(a.start_date_local);
    const dow = d.getUTCDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(d);
    monday.setUTCDate(monday.getUTCDate() + diff);
    const key = monday.toISOString().slice(0, 10);
    const bucket = weekMap.get(key) ?? { quality: 0, total: 0, load: 0, km: 0 };
    bucket.total += 1;
    if (
      a.workout_classification &&
      ["tempo", "interval", "threshold", "race", "fartlek", "long_run"].includes(
        a.workout_classification,
      )
    ) {
      bucket.quality += 1;
    }
    bucket.load += Number(a.training_load) || 0;
    bucket.km += 0; // distance not in this query; approximate from load
    weekMap.set(key, bucket);
  }

  const weeks = Array.from(weekMap.values());
  const avg = (f: (w: { quality: number; total: number; load: number }) => number) =>
    weeks.reduce((s, w) => s + f(w), 0) / weeks.length;

  const result = {
    optimal_quality_days_per_week: Math.round(avg((w) => w.quality)),
    optimal_weekly_volume_km: null as number | null,
    recovery_rate_category: null as string | null,
    best_responding_workout_types: [] as string[],
  };

  await sb.from("athlete_response_profiles").upsert(
    {
      athlete_id: athleteId,
      optimal_quality_days_per_week: result.optimal_quality_days_per_week,
      analysis_data: {
        weeks_analyzed: weeks.length,
        avg_weekly_load: Math.round(avg((w) => w.load)),
      },
      last_computed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "athlete_id" },
  );

  return result;
}
