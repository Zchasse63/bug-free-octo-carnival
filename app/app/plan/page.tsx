import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { createServiceClient } from "@/lib/supabase/service";
import { PlanGeneratorForm } from "@/components/plan-generator-form";
import { PlannedWorkoutActions } from "@/components/planned-workout-actions";
import { metersToKm } from "@/lib/format";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function PlanPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  const sb = createServiceClient();

  const { data: activePlan } = await sb
    .from("training_plans")
    .select("*")
    .eq("athlete_id", ATHLETE_ID)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let workouts: Array<{
    id: string;
    planned_date: string;
    day_of_week: number;
    workout_type: string;
    title: string;
    description: string | null;
    target_distance_meters: number | null;
    status: string;
  }> = [];
  if (activePlan) {
    const { data } = await sb
      .from("planned_workouts")
      .select(
        "id, planned_date, day_of_week, workout_type, title, description, target_distance_meters, status",
      )
      .eq("plan_id", activePlan.id)
      .gte("planned_date", new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10))
      .order("planned_date", { ascending: true })
      .limit(42);
    workouts = (data ?? []) as typeof workouts;
  }

  // Group workouts by Monday-starting week
  const weeks = new Map<string, typeof workouts>();
  for (const w of workouts) {
    const d = new Date(w.planned_date);
    const dow = d.getUTCDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(d);
    monday.setUTCDate(monday.getUTCDate() + diff);
    const key = monday.toISOString().slice(0, 10);
    if (!weeks.has(key)) weeks.set(key, []);
    weeks.get(key)!.push(w);
  }
  const weekArr = Array.from(weeks.entries()).sort(([a], [b]) => a.localeCompare(b));

  const typeColor: Record<string, string> = {
    easy: "bg-zone-aerobic/20 text-zone-aerobic",
    long_run: "bg-workout-long/20 text-blue-600 dark:text-blue-300",
    tempo: "bg-workout-tempo/20 text-emerald-600 dark:text-emerald-300",
    interval: "bg-workout-interval/20 text-amber-600 dark:text-amber-300",
    recovery: "bg-zone-recovery/20 text-slate-500",
    fartlek: "bg-workout-fartlek/20 text-purple-600 dark:text-purple-300",
    progression: "bg-zone-threshold/20 text-amber-700 dark:text-amber-300",
    race: "bg-saffron-500/20 text-saffron-700 dark:text-saffron-300",
    rest: "bg-workout-rest/30 text-ink-500",
    cross_train: "bg-workout-crosstrain/20 text-cyan-600 dark:text-cyan-300",
  };

  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Training plan</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activePlan
              ? `${activePlan.name} · ${activePlan.current_phase ?? "base"} phase`
              : "No active plan. Generate one below."}
          </p>
        </div>
      </div>

      {!activePlan && <PlanGeneratorForm />}

      {activePlan && (
        <div className="space-y-6">
          {activePlan.plan_config &&
            typeof activePlan.plan_config === "object" &&
            "summary" in activePlan.plan_config && (
              <div className="rounded-xl border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
                {String((activePlan.plan_config as Record<string, unknown>).summary)}
              </div>
            )}

          {weekArr.map(([weekStart, days]) => {
            const completed = days.filter((d) => d.status === "completed").length;
            return (
              <div key={weekStart} className="rounded-xl border bg-card p-5">
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold">
                    Week of{" "}
                    {new Date(weekStart).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {completed}/{days.length} completed
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-7">
                  {days.map((w) => (
                    <div
                      key={w.id}
                      className={`rounded-lg border p-3 text-sm ${
                        w.status === "completed"
                          ? "bg-emerald-500/5"
                          : w.status === "skipped"
                            ? "bg-muted/40 opacity-60"
                            : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {new Date(w.planned_date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${typeColor[w.workout_type] ?? "bg-muted"}`}
                        >
                          {w.workout_type.replace("_", " ")}
                        </span>
                      </div>
                      <div className="mt-1 font-medium leading-tight">{w.title}</div>
                      {w.target_distance_meters && (
                        <div className="mt-1 font-mono text-xs text-muted-foreground">
                          {metersToKm(w.target_distance_meters, 1)} km
                        </div>
                      )}
                      {w.description && (
                        <div className="mt-1 text-xs text-muted-foreground line-clamp-3">
                          {w.description}
                        </div>
                      )}
                      <div className="mt-2">
                        <PlannedWorkoutActions id={w.id} status={w.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
