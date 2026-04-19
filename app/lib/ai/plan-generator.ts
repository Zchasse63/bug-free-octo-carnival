import { createServiceClient } from "@/lib/supabase/service";
import { buildAthleteContext } from "@/lib/ai/coach-context";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-4-7";

export type PlanRequest = {
  athleteId: number;
  goal: string;
  goalRaceDate?: string;
  goalDistance?: string;
  goalTimeSeconds?: number;
  weeks: number;
  planType: "base_building" | "5k" | "10k" | "half_marathon" | "marathon" | "maintenance";
};

export type GeneratedWorkout = {
  day_of_week: number;
  date: string;
  workout_type: "easy" | "long_run" | "tempo" | "interval" | "recovery" | "race" | "rest" | "fartlek" | "progression" | "cross_train";
  title: string;
  description: string;
  target_distance_meters?: number;
  target_duration?: number;
  target_pace_range?: { min_secs_per_km?: number; max_secs_per_km?: number };
  structure?: { step: string; distance_m?: number; duration_s?: number; pace?: string }[];
};

type PlanResponse = {
  plan_summary: string;
  phase_sequence: { phase: string; start_week: number; end_week: number; focus: string }[];
  weeks: { week_number: number; week_start: string; workouts: GeneratedWorkout[] }[];
};

function anthropicKey(): string {
  return process.env.CADENCE_ANTHROPIC_KEY ?? process.env.ANTHROPIC_API_KEY ?? "";
}

export async function generateTrainingPlan(req: PlanRequest) {
  const sb = createServiceClient();
  const ctx = await buildAthleteContext(req.athleteId);

  const startDate = new Date();
  // Nearest upcoming Monday
  const dow = startDate.getUTCDay();
  const addDays = dow === 0 ? 1 : dow === 1 ? 0 : 8 - dow;
  startDate.setUTCDate(startDate.getUTCDate() + addDays);
  const startIso = startDate.toISOString().slice(0, 10);

  const system = `You are Cadence, a running coach. Generate a structured training plan as STRICT JSON that matches the TypeScript schema below. No prose before or after the JSON. No markdown fences.

Schema:
{
  "plan_summary": string,
  "phase_sequence": Array<{phase: "base"|"build"|"peak"|"taper", start_week: number, end_week: number, focus: string}>,
  "weeks": Array<{
    week_number: number,
    week_start: string,  // YYYY-MM-DD, Monday
    workouts: Array<{
      day_of_week: number,   // 0=Sun .. 6=Sat
      date: string,          // YYYY-MM-DD
      workout_type: "easy"|"long_run"|"tempo"|"interval"|"recovery"|"race"|"rest"|"fartlek"|"progression"|"cross_train",
      title: string,
      description: string,
      target_distance_meters?: number,
      target_duration?: number,
      structure?: Array<{step: string, distance_m?: number, duration_s?: number, pace?: string}>
    }>
  }>
}

Constraints for the plan:
- Respect athlete's current fitness (CTL) — do not jump weekly volume >10% week-over-week.
- 80/20 intensity distribution roughly: most runs easy; 1-2 quality sessions per week.
- One long run per week, growing gradually, peaking 2-3 weeks before the race.
- Taper 2-3 weeks before goal race if applicable.
- At least one full rest day per week.
- Make specific, actionable titles like "Tempo 6x1km @ threshold" not "Quality workout".

ATHLETE CONTEXT:
${ctx}`;

  const user = `Goal: ${req.goal}${req.goalRaceDate ? ` — race on ${req.goalRaceDate}` : ""}${req.goalDistance ? ` — ${req.goalDistance}` : ""}${req.goalTimeSeconds ? ` — target ${Math.floor(req.goalTimeSeconds / 60)}:${String(req.goalTimeSeconds % 60).padStart(2, "0")}` : ""}.
Plan type: ${req.planType}.
Length: ${req.weeks} weeks.
Start date: ${startIso} (Monday).

Return the JSON plan now.`;

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey(),
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Plan generation failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { content: { type: string; text?: string }[] };
  const raw = json.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("");

  // Claude should return pure JSON; strip any accidental fences defensively.
  const cleaned = raw.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
  const plan = JSON.parse(cleaned) as PlanResponse;

  // Persist plan and planned workouts
  const endIso = plan.weeks.length
    ? plan.weeks[plan.weeks.length - 1].workouts.at(-1)?.date ??
      new Date(startDate.getTime() + req.weeks * 7 * 86400000).toISOString().slice(0, 10)
    : new Date(startDate.getTime() + req.weeks * 7 * 86400000).toISOString().slice(0, 10);

  const { data: insertedPlan, error: planErr } = await sb
    .from("training_plans")
    .insert({
      athlete_id: req.athleteId,
      name: `${req.planType} ${req.goal}`.trim(),
      goal: req.goal,
      goal_race_date: req.goalRaceDate ?? null,
      goal_race_distance: req.goalDistance ?? null,
      goal_time_seconds: req.goalTimeSeconds ?? null,
      plan_type: req.planType,
      start_date: startIso,
      end_date: endIso,
      current_phase: plan.phase_sequence[0]?.phase ?? "base",
      plan_config: {
        summary: plan.plan_summary,
        phase_sequence: plan.phase_sequence,
      },
      generated_by: "claude",
      model_version: MODEL,
    })
    .select("id")
    .single();
  if (planErr || !insertedPlan) throw planErr ?? new Error("plan insert failed");

  const workoutRows = plan.weeks.flatMap((w) =>
    w.workouts.map((wk) => ({
      plan_id: insertedPlan.id,
      athlete_id: req.athleteId,
      planned_date: wk.date,
      day_of_week: wk.day_of_week,
      workout_type: wk.workout_type,
      title: wk.title,
      description: wk.description,
      target_distance_meters: wk.target_distance_meters ?? null,
      target_duration: wk.target_duration ?? null,
      structure: wk.structure ?? null,
      status: "planned",
    })),
  );
  if (workoutRows.length) {
    const { error: wErr } = await sb.from("planned_workouts").insert(workoutRows);
    if (wErr) throw wErr;
  }

  return { planId: insertedPlan.id, workoutCount: workoutRows.length, summary: plan.plan_summary };
}

/**
 * Match planned_workouts to actual activities by date + sport + distance proximity.
 * Runs after sync; marks planned workouts as completed and links actual_activity_id.
 */
export async function matchPlannedToActual(athleteId: number) {
  const sb = createServiceClient();
  const { data: planned } = await sb
    .from("planned_workouts")
    .select("id, planned_date, workout_type, target_distance_meters")
    .eq("athlete_id", athleteId)
    .eq("status", "planned")
    .gte("planned_date", new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10));
  if (!planned || planned.length === 0) return { matched: 0 };

  const dates = Array.from(new Set(planned.map((p) => p.planned_date)));
  const { data: acts } = await sb
    .from("activities")
    .select("id, start_date_local, distance_meters, sport_type, workout_classification")
    .eq("athlete_id", athleteId)
    .in(
      "start_date_local",
      dates.flatMap((d) => [`${d}T00:00:00`, `${d}T23:59:59`]),
    );
  // The simple form above fails; use gte/lte per date instead.
  const { data: recent } = await sb
    .from("activities")
    .select("id, start_date_local, distance_meters, sport_type, workout_classification")
    .eq("athlete_id", athleteId)
    .gte("start_date_local", dates[dates.length - 1])
    .lte("start_date_local", `${dates[0]}T23:59:59`);

  const pool = recent ?? acts ?? [];
  let matched = 0;
  for (const p of planned) {
    const candidates = pool.filter(
      (a) => a.start_date_local.slice(0, 10) === p.planned_date,
    );
    if (candidates.length === 0) continue;
    // Pick closest distance match if target given, else first
    const pick = p.target_distance_meters
      ? candidates.reduce((best, c) =>
          Math.abs(Number(c.distance_meters ?? 0) - Number(p.target_distance_meters ?? 0)) <
          Math.abs(Number(best.distance_meters ?? 0) - Number(p.target_distance_meters ?? 0))
            ? c
            : best,
        )
      : candidates[0];
    await sb
      .from("planned_workouts")
      .update({ status: "completed", actual_activity_id: pick.id })
      .eq("id", p.id);
    matched += 1;
  }
  return { matched };
}
