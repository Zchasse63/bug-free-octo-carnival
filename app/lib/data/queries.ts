import { createServiceClient } from "@/lib/supabase/service";
import { computeDailySeries } from "@/lib/analytics/training-load";
import { pacesFromVdot, computeACWR } from "@/lib/analytics/vdot";

export async function getAthlete(athleteId: number) {
  const sb = createServiceClient();
  const { data, error } = await sb
    .from("athletes")
    .select("id, firstname, lastname, city, state, country, measurement_preference, weight_kg")
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

export async function getCurrentVdot(athleteId: number) {
  const sb = createServiceClient();
  const { data } = await sb
    .from("athlete_zones")
    .select("estimated_vdot, effective_date")
    .eq("athlete_id", athleteId)
    .order("effective_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  const vdot = data?.estimated_vdot ? Number(data.estimated_vdot) : null;
  return {
    vdot,
    date: data?.effective_date ?? null,
    paces: vdot ? pacesFromVdot(vdot) : null,
  };
}

export async function getInjuryRisk(athleteId: number) {
  return computeACWR(athleteId);
}

export async function getUpcomingPlannedWorkouts(athleteId: number, days = 7) {
  const sb = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);
  const until = new Date(Date.now() + days * 86400000)
    .toISOString()
    .slice(0, 10);
  const { data } = await sb
    .from("planned_workouts")
    .select(
      "id, planned_date, workout_type, title, target_distance_meters, status",
    )
    .eq("athlete_id", athleteId)
    .gte("planned_date", today)
    .lte("planned_date", until)
    .order("planned_date", { ascending: true })
    .limit(7);
  return data ?? [];
}

export async function getSyncStatus(athleteId: number) {
  const sb = createServiceClient();
  const [totalRes, detailedRes, weatheredRes, embeddedRes, lastSyncRes] = await Promise.all([
    sb.from("activities").select("id", { count: "exact", head: true }).eq("athlete_id", athleteId),
    sb
      .from("activities")
      .select("id", { count: "exact", head: true })
      .eq("athlete_id", athleteId)
      .eq("detail_fetched", true),
    sb
      .from("activity_weather")
      .select("activity_id", { count: "exact", head: true })
      .eq("athlete_id", athleteId),
    sb
      .from("activity_embeddings")
      .select("activity_id", { count: "exact", head: true })
      .eq("athlete_id", athleteId),
    sb
      .from("sync_log")
      .select("sync_type, status, activities_synced, started_at")
      .eq("athlete_id", athleteId)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    total: totalRes.count ?? 0,
    detailed: detailedRes.count ?? 0,
    weathered: weatheredRes.count ?? 0,
    embedded: embeddedRes.count ?? 0,
    last_sync: lastSyncRes.data,
  };
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
