import { createServiceClient } from "@/lib/supabase/service";

/**
 * "Time machine" — given a current situation (week of year / fitness level),
 * surface how the athlete was training at the same point in past years
 * and how their fitness compared.
 */
export async function timeMachine(athleteId: number) {
  const sb = createServiceClient();
  const today = new Date();
  const nowWeek = isoWeek(today);
  const thisYear = today.getUTCFullYear();

  const { data } = await sb
    .from("weekly_summaries")
    .select("year, week_number, week_start, run_distance_meters, total_training_load, avg_run_heartrate, run_count, avg_run_pace_seconds_per_km")
    .eq("athlete_id", athleteId)
    .eq("week_number", nowWeek)
    .order("year", { ascending: false });

  const rows = (data ?? []).map((r) => ({
    year: r.year,
    week_start: r.week_start,
    distance_km: (Number(r.run_distance_meters) || 0) / 1000,
    training_load: r.total_training_load,
    avg_hr: r.avg_run_heartrate,
    runs: r.run_count,
    pace_sec_per_km: r.avg_run_pace_seconds_per_km,
    is_current_year: r.year === thisYear,
  }));

  // Compare volume trend year over year at this week
  return {
    week_number: nowWeek,
    years: rows,
  };
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
