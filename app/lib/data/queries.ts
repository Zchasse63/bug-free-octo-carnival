import { createServiceClient } from "@/lib/supabase/service";
import { computeDailySeries } from "@/lib/analytics/training-load";

export async function getAthlete(athleteId: number) {
  const sb = createServiceClient();
  const { data, error } = await sb
    .from("athletes")
    .select("id, firstname, lastname, city, state, country, measurement_preference")
    .eq("id", athleteId)
    .single();
  if (error) throw error;
  return data;
}

export async function getCurrentWeekSummary(athleteId: number) {
  const sb = createServiceClient();
  const now = new Date();
  const monday = new Date(now);
  const dow = monday.getUTCDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  monday.setUTCDate(monday.getUTCDate() + diff);
  const weekStart = monday.toISOString().slice(0, 10);

  const { data, error } = await sb
    .from("weekly_summaries")
    .select("*")
    .eq("athlete_id", athleteId)
    .eq("week_start", weekStart)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getRecentActivities(athleteId: number, limit = 10) {
  const sb = createServiceClient();
  const { data, error } = await sb
    .from("activities")
    .select(
      "id, name, sport_type, start_date_local, distance_meters, moving_time, average_heartrate, average_speed, training_load, workout_classification, gear_id",
    )
    .eq("athlete_id", athleteId)
    .order("start_date_local", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getTrainingLoadSeries(athleteId: number, days = 90) {
  const sb = createServiceClient();
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const { data, error } = await sb
    .from("activities")
    .select("start_date_local, training_load")
    .eq("athlete_id", athleteId)
    .gte("start_date_local", since)
    .order("start_date_local", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []).map((r) => ({
    date: r.start_date_local.slice(0, 10),
    load: r.training_load ?? 0,
  }));
  return computeDailySeries(rows);
}

export async function getActiveGear(athleteId: number) {
  const sb = createServiceClient();
  const { data } = await sb
    .from("gear")
    .select("id, name, gear_type, distance_meters, retired, is_primary")
    .eq("athlete_id", athleteId)
    .eq("retired", false)
    .eq("gear_type", "shoe")
    .order("distance_meters", { ascending: false })
    .limit(4);
  return data ?? [];
}

export async function getLast12Weeks(athleteId: number) {
  const sb = createServiceClient();
  const { data } = await sb
    .from("weekly_summaries")
    .select("week_start, run_distance_meters, total_training_load, run_count")
    .eq("athlete_id", athleteId)
    .order("week_start", { ascending: false })
    .limit(12);
  return (data ?? []).reverse();
}
