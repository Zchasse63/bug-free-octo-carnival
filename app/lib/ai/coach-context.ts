import { createServiceClient } from "@/lib/supabase/service";
import { computeDailySeries } from "@/lib/analytics/training-load";

/**
 * Build the athlete-specific context block injected into the coach system prompt.
 * Includes profile, recent fitness, last 7 activities, current week summary.
 */
export async function buildAthleteContext(athleteId: number): Promise<string> {
  const sb = createServiceClient();
  const [{ data: athlete }, { data: recent }, { data: weeks }, loadRows] =
    await Promise.all([
      sb
        .from("athletes")
        .select("firstname, lastname, city, state, weight_kg, measurement_preference")
        .eq("id", athleteId)
        .maybeSingle(),
      sb
        .from("activities")
        .select(
          "name, sport_type, start_date_local, distance_meters, moving_time, average_heartrate, training_load, workout_classification",
        )
        .eq("athlete_id", athleteId)
        .order("start_date_local", { ascending: false })
        .limit(7),
      sb
        .from("weekly_summaries")
        .select(
          "week_start, run_count, run_distance_meters, run_moving_time, avg_run_heartrate, total_training_load",
        )
        .eq("athlete_id", athleteId)
        .order("week_start", { ascending: false })
        .limit(6),
      sb
        .from("activities")
        .select("start_date_local, training_load")
        .eq("athlete_id", athleteId)
        .gte(
          "start_date_local",
          new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10),
        )
        .order("start_date_local", { ascending: true }),
    ]);

  const today =
    loadRows.data && loadRows.data.length
      ? computeDailySeries(
          loadRows.data.map((r) => ({
            date: r.start_date_local.slice(0, 10),
            load: r.training_load ?? 0,
          })),
        ).at(-1)
      : null;

  const lines: string[] = [];
  if (athlete) {
    lines.push(
      `ATHLETE: ${athlete.firstname ?? ""} ${athlete.lastname ?? ""} — ${[athlete.city, athlete.state].filter(Boolean).join(", ")}`,
    );
    if (athlete.weight_kg) lines.push(`Weight: ${athlete.weight_kg} kg`);
    lines.push(`Preferred units: ${athlete.measurement_preference ?? "metric"}`);
  }
  if (today) {
    lines.push(
      `CURRENT FITNESS: CTL ${today.ctl} (fitness) · ATL ${today.atl} (fatigue) · TSB ${today.tsb} (form).`,
    );
  }
  if (weeks && weeks.length) {
    lines.push("");
    lines.push("RECENT WEEKS (most recent first):");
    for (const w of weeks) {
      const km = (Number(w.run_distance_meters) || 0) / 1000;
      lines.push(
        `- Week of ${w.week_start}: ${w.run_count} runs, ${km.toFixed(1)} km, avg HR ${w.avg_run_heartrate ? Math.round(w.avg_run_heartrate) : "—"}, total load ${w.total_training_load ?? 0}`,
      );
    }
  }
  if (recent && recent.length) {
    lines.push("");
    lines.push("LAST 7 ACTIVITIES:");
    for (const a of recent) {
      const km = (Number(a.distance_meters) || 0) / 1000;
      const mins = Math.round((a.moving_time ?? 0) / 60);
      lines.push(
        `- ${a.start_date_local.slice(0, 10)} · ${a.sport_type}${a.workout_classification ? ` (${a.workout_classification})` : ""} · ${km.toFixed(1)}km in ${mins} min · HR ${a.average_heartrate ? Math.round(a.average_heartrate) : "—"} · load ${a.training_load ?? "—"} · "${a.name}"`,
      );
    }
  }
  return lines.join("\n");
}
