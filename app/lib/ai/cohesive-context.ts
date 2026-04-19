import { createServiceClient } from "@/lib/supabase/service";
import { computeDailySeries } from "@/lib/analytics/training-load";
import { computeACWR, pacesFromVdot } from "@/lib/analytics/vdot";

/**
 * Single source of truth for "what does this AI tool know about this athlete?"
 * Called by coach chat, plan generator, workout builder, goal analyzer, and
 * note parser. Every tool sees identical context → outputs are cohesive.
 */
export type AthleteSnapshot = {
  athleteId: number;
  profile: {
    firstname: string | null;
    lastname: string | null;
    city: string | null;
    state: string | null;
    weight_kg: number | null;
    measurement_preference: string | null;
  };
  fitness: {
    ctl: number;
    atl: number;
    tsb: number;
    vdot: number | null;
    paces: ReturnType<typeof pacesFromVdot> | null;
  };
  injuryRisk: Awaited<ReturnType<typeof computeACWR>>;
  onboarding: Record<string, string>;
  activePlan: {
    id: string;
    name: string;
    goal: string | null;
    goal_race_date: string | null;
    goal_race_distance: string | null;
    goal_time_seconds: number | null;
    plan_type: string | null;
    current_phase: string | null;
    start_date: string;
    end_date: string | null;
    summary: string | null;
    weeks_remaining: number | null;
  } | null;
  upcomingWorkouts: Array<{
    planned_date: string;
    workout_type: string;
    title: string;
    description: string | null;
    target_distance_meters: number | null;
    status: string | null;
  }>;
  recentActivities: Array<{
    id: number;
    name: string;
    sport_type: string;
    workout_classification: string | null;
    start_date_local: string;
    distance_meters: number | null;
    moving_time: number | null;
    average_heartrate: number | null;
    training_load: number | null;
  }>;
  recentWeeks: Array<{
    week_start: string;
    run_count: number;
    run_distance_meters: number | null;
    total_training_load: number | null;
    avg_run_heartrate: number | null;
  }>;
  gear: Array<{
    id: string;
    name: string;
    gear_type: string;
    is_primary: boolean | null;
    distance_meters: number | null;
    retired: boolean | null;
  }>;
  recentNotes: Array<{
    activity_id: number;
    raw_text: string;
    sentiment: string | null;
    perceived_effort: number | null;
    created_at: string | null;
  }>;
  contextFactors: Array<{
    factor_key: string;
    category: string;
    factor_value: string | null;
    count: number;
  }>;
  responseProfile: {
    optimal_quality_days_per_week: number | null;
    recovery_rate_category: string | null;
    best_responding_workout_types: string[] | null;
    heat_tolerance: string | null;
  } | null;
};

export async function buildAthleteSnapshot(
  athleteId: number,
): Promise<AthleteSnapshot> {
  const sb = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    athleteRes,
    onboardingRes,
    planRes,
    recentActsRes,
    weeksRes,
    gearRes,
    notesRes,
    factorsRes,
    zonesRes,
    profileRes,
    loadRowsRes,
  ] = await Promise.all([
    sb
      .from("athletes")
      .select("firstname, lastname, city, state, weight_kg, measurement_preference")
      .eq("id", athleteId)
      .maybeSingle(),
    sb
      .from("onboarding_responses")
      .select("question_key, response_value")
      .eq("athlete_id", athleteId),
    sb
      .from("training_plans")
      .select(
        "id, name, goal, goal_race_date, goal_race_distance, goal_time_seconds, plan_type, current_phase, start_date, end_date, plan_config",
      )
      .eq("athlete_id", athleteId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    sb
      .from("activities")
      .select(
        "id, name, sport_type, workout_classification, start_date_local, distance_meters, moving_time, average_heartrate, training_load",
      )
      .eq("athlete_id", athleteId)
      .order("start_date_local", { ascending: false })
      .limit(10),
    sb
      .from("weekly_summaries")
      .select(
        "week_start, run_count, run_distance_meters, total_training_load, avg_run_heartrate",
      )
      .eq("athlete_id", athleteId)
      .order("week_start", { ascending: false })
      .limit(6),
    sb
      .from("gear")
      .select("id, name, gear_type, is_primary, distance_meters, retired")
      .eq("athlete_id", athleteId)
      .order("distance_meters", { ascending: false }),
    sb
      .from("activity_notes")
      .select("activity_id, raw_text, sentiment, perceived_effort, created_at")
      .eq("athlete_id", athleteId)
      .order("created_at", { ascending: false })
      .limit(10),
    sb
      .from("activity_context_factors")
      .select("factor_key, category, factor_value")
      .eq("athlete_id", athleteId)
      .limit(200),
    sb
      .from("athlete_zones")
      .select("estimated_vdot")
      .eq("athlete_id", athleteId)
      .order("effective_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    sb
      .from("athlete_response_profiles")
      .select(
        "optimal_quality_days_per_week, recovery_rate_category, best_responding_workout_types, heat_tolerance",
      )
      .eq("athlete_id", athleteId)
      .maybeSingle(),
    sb
      .from("activities")
      .select("start_date_local, training_load")
      .eq("athlete_id", athleteId)
      .gte(
        "start_date_local",
        new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10),
      ),
  ]);

  const profile = athleteRes.data ?? {
    firstname: null,
    lastname: null,
    city: null,
    state: null,
    weight_kg: null,
    measurement_preference: null,
  };

  const onboarding: Record<string, string> = {};
  for (const r of onboardingRes.data ?? [])
    onboarding[r.question_key] = r.response_value;

  const today_series = loadRowsRes.data?.length
    ? computeDailySeries(
        loadRowsRes.data.map((r) => ({
          date: r.start_date_local.slice(0, 10),
          load: r.training_load ?? 0,
        })),
      ).at(-1)
    : null;

  const vdot = zonesRes.data?.estimated_vdot
    ? Number(zonesRes.data.estimated_vdot)
    : null;
  const injuryRisk = await computeACWR(athleteId);

  // Upcoming workouts (next 14 days)
  const upcomingWorkouts: AthleteSnapshot["upcomingWorkouts"] = [];
  if (planRes.data) {
    const { data: planned } = await sb
      .from("planned_workouts")
      .select(
        "planned_date, workout_type, title, description, target_distance_meters, status",
      )
      .eq("plan_id", planRes.data.id)
      .gte("planned_date", today)
      .lte(
        "planned_date",
        new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      )
      .order("planned_date", { ascending: true });
    upcomingWorkouts.push(...(planned ?? []));
  }

  // Collapse repeated context factors into a usage-count bag
  const factorCounts = new Map<string, { category: string; value: string | null; count: number }>();
  for (const f of factorsRes.data ?? []) {
    const current = factorCounts.get(f.factor_key);
    if (current) current.count += 1;
    else
      factorCounts.set(f.factor_key, {
        category: f.category,
        value: f.factor_value,
        count: 1,
      });
  }
  const contextFactors = Array.from(factorCounts.entries())
    .map(([factor_key, v]) => ({
      factor_key,
      category: v.category,
      factor_value: v.value,
      count: v.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);

  const activePlan = planRes.data
    ? {
        id: planRes.data.id,
        name: planRes.data.name,
        goal: planRes.data.goal,
        goal_race_date: planRes.data.goal_race_date,
        goal_race_distance: planRes.data.goal_race_distance,
        goal_time_seconds: planRes.data.goal_time_seconds,
        plan_type: planRes.data.plan_type,
        current_phase: planRes.data.current_phase,
        start_date: planRes.data.start_date,
        end_date: planRes.data.end_date,
        summary:
          planRes.data.plan_config &&
          typeof planRes.data.plan_config === "object" &&
          "summary" in planRes.data.plan_config
            ? String((planRes.data.plan_config as Record<string, unknown>).summary)
            : null,
        weeks_remaining: planRes.data.end_date
          ? Math.max(
              0,
              Math.ceil(
                (new Date(planRes.data.end_date).getTime() - Date.now()) /
                  (7 * 86400000),
              ),
            )
          : null,
      }
    : null;

  return {
    athleteId,
    profile,
    fitness: {
      ctl: today_series?.ctl ?? 0,
      atl: today_series?.atl ?? 0,
      tsb: today_series?.tsb ?? 0,
      vdot,
      paces: vdot ? pacesFromVdot(vdot) : null,
    },
    injuryRisk,
    onboarding,
    activePlan,
    upcomingWorkouts,
    recentActivities: (recentActsRes.data ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      sport_type: a.sport_type,
      workout_classification: a.workout_classification,
      start_date_local: a.start_date_local,
      distance_meters: a.distance_meters !== null ? Number(a.distance_meters) : null,
      moving_time: a.moving_time,
      average_heartrate: a.average_heartrate,
      training_load: a.training_load,
    })),
    recentWeeks: (weeksRes.data ?? []).map((w) => ({
      week_start: w.week_start,
      run_count: w.run_count ?? 0,
      run_distance_meters:
        w.run_distance_meters !== null ? Number(w.run_distance_meters) : null,
      total_training_load:
        w.total_training_load !== null ? Number(w.total_training_load) : null,
      avg_run_heartrate: w.avg_run_heartrate ? Number(w.avg_run_heartrate) : null,
    })),
    gear: gearRes.data ?? [],
    recentNotes: notesRes.data ?? [],
    contextFactors,
    responseProfile: profileRes.data ?? null,
  };
}

/**
 * Render the snapshot as a text block that fits inside an AI system prompt.
 * Used by every AI tool so they share a vocabulary and a current picture.
 */
export function renderSnapshotAsPrompt(s: AthleteSnapshot): string {
  const useMetric = s.profile.measurement_preference === "meters";
  const distUnit = useMetric ? "km" : "mi";
  const distScale = useMetric ? 1000 : 1609.344;
  const lines: string[] = [];

  const name =
    `${s.profile.firstname ?? ""} ${s.profile.lastname ?? ""}`.trim() || "Athlete";
  const loc = [s.profile.city, s.profile.state].filter(Boolean).join(", ");
  lines.push(`# ATHLETE`);
  lines.push(`Name: ${name}${loc ? ` — ${loc}` : ""}`);
  if (s.profile.weight_kg) lines.push(`Weight: ${s.profile.weight_kg} kg`);
  lines.push(`Units: ${useMetric ? "metric (km, °C)" : "imperial (mi, °F)"}`);

  lines.push(``);
  lines.push(`# CURRENT FITNESS`);
  lines.push(
    `CTL ${s.fitness.ctl.toFixed(1)} · ATL ${s.fitness.atl.toFixed(1)} · TSB ${s.fitness.tsb.toFixed(1)}`,
  );
  if (s.fitness.vdot)
    lines.push(
      `VDOT ${s.fitness.vdot.toFixed(1)} → easy ${pace(s.fitness.paces?.easy, useMetric)}, threshold ${pace(s.fitness.paces?.threshold, useMetric)}, interval ${pace(s.fitness.paces?.interval, useMetric)}`,
    );
  lines.push(
    `ACWR ${s.injuryRisk.acwr ?? "—"} (${s.injuryRisk.level}) · acute ${s.injuryRisk.acute} / chronic ${s.injuryRisk.chronic}`,
  );

  if (s.activePlan) {
    lines.push(``);
    lines.push(`# ACTIVE PLAN`);
    lines.push(
      `${s.activePlan.name}${s.activePlan.current_phase ? ` (${s.activePlan.current_phase} phase)` : ""}`,
    );
    if (s.activePlan.goal) lines.push(`Goal: ${s.activePlan.goal}`);
    if (s.activePlan.goal_race_date)
      lines.push(
        `Race date: ${s.activePlan.goal_race_date}${s.activePlan.weeks_remaining !== null ? ` (${s.activePlan.weeks_remaining} weeks out)` : ""}`,
      );
    if (s.activePlan.goal_time_seconds)
      lines.push(
        `Target time: ${Math.floor(s.activePlan.goal_time_seconds / 60)}:${String(s.activePlan.goal_time_seconds % 60).padStart(2, "0")}`,
      );
    if (s.activePlan.summary) lines.push(`Plan summary: ${s.activePlan.summary}`);
  } else {
    lines.push(``);
    lines.push(`# ACTIVE PLAN`);
    lines.push(`None — athlete is training without a structured plan.`);
  }

  if (s.upcomingWorkouts.length) {
    lines.push(``);
    lines.push(`# UPCOMING (next 14 days)`);
    for (const w of s.upcomingWorkouts) {
      const dist = w.target_distance_meters
        ? ` · ${(w.target_distance_meters / distScale).toFixed(1)}${distUnit}`
        : "";
      lines.push(`- ${w.planned_date} ${w.workout_type}: ${w.title}${dist} [${w.status}]`);
    }
  }

  if (s.recentWeeks.length) {
    lines.push(``);
    lines.push(`# RECENT WEEKS`);
    for (const w of s.recentWeeks) {
      const km = w.run_distance_meters ? w.run_distance_meters / distScale : 0;
      lines.push(
        `- ${w.week_start}: ${w.run_count} runs, ${km.toFixed(1)}${distUnit}, avg HR ${w.avg_run_heartrate ? Math.round(w.avg_run_heartrate) : "—"}, load ${w.total_training_load ?? 0}`,
      );
    }
  }

  if (s.recentActivities.length) {
    lines.push(``);
    lines.push(`# LAST 10 ACTIVITIES`);
    for (const a of s.recentActivities.slice(0, 10)) {
      const km = a.distance_meters ? a.distance_meters / distScale : 0;
      const mins = Math.round((a.moving_time ?? 0) / 60);
      lines.push(
        `- ${a.start_date_local.slice(0, 10)} · ${a.sport_type}${a.workout_classification ? ` (${a.workout_classification})` : ""} · ${km.toFixed(1)}${distUnit} in ${mins}min · HR ${a.average_heartrate ? Math.round(a.average_heartrate) : "—"} · load ${a.training_load ?? "—"} · "${a.name}"`,
      );
    }
  }

  if (s.gear.length) {
    lines.push(``);
    lines.push(`# GEAR`);
    for (const g of s.gear) {
      const mi = Number(g.distance_meters ?? 0) / distScale;
      lines.push(
        `- ${g.name} (${g.gear_type}${g.is_primary ? ", primary" : ""}${g.retired ? ", retired" : ""}) — ${mi.toFixed(0)}${distUnit}`,
      );
    }
  }

  if (Object.keys(s.onboarding).length) {
    lines.push(``);
    lines.push(`# ONBOARDING ANSWERS`);
    for (const [k, v] of Object.entries(s.onboarding)) lines.push(`${k}: ${v}`);
  }

  if (s.responseProfile) {
    lines.push(``);
    lines.push(`# LEARNED RESPONSE PROFILE`);
    if (s.responseProfile.optimal_quality_days_per_week)
      lines.push(
        `Optimal quality days/week: ${s.responseProfile.optimal_quality_days_per_week}`,
      );
    if (s.responseProfile.recovery_rate_category)
      lines.push(`Recovery: ${s.responseProfile.recovery_rate_category}`);
    if (s.responseProfile.heat_tolerance)
      lines.push(`Heat tolerance: ${s.responseProfile.heat_tolerance}`);
    if (s.responseProfile.best_responding_workout_types?.length)
      lines.push(
        `Responds best to: ${s.responseProfile.best_responding_workout_types.join(", ")}`,
      );
  }

  if (s.contextFactors.length) {
    lines.push(``);
    lines.push(`# FREQUENT CONTEXT FACTORS (from parsed notes)`);
    for (const f of s.contextFactors.slice(0, 15)) {
      lines.push(`- ${f.factor_key} (${f.category}, ${f.count}× mentions)`);
    }
  }

  if (s.recentNotes.length) {
    lines.push(``);
    lines.push(`# RECENT ATHLETE NOTES`);
    for (const n of s.recentNotes.slice(0, 5)) {
      lines.push(
        `- ${n.created_at?.slice(0, 10)} (sentiment: ${n.sentiment ?? "—"}, RPE ${n.perceived_effort ?? "—"}): "${n.raw_text.slice(0, 200)}"`,
      );
    }
  }

  return lines.join("\n");
}

function pace(sec: number | undefined, metric: boolean): string {
  if (!sec) return "—";
  const v = metric ? sec : sec * 1.609344;
  const m = Math.floor(v / 60);
  const s = Math.round(v % 60);
  return `${m}:${String(s).padStart(2, "0")}${metric ? "/km" : "/mi"}`;
}
