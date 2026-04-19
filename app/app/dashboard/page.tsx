import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { GlowTile, TileLabel, BigNumber } from "@/components/glow-tile";
import {
  getActiveGear,
  getAthlete,
  getCurrentVdot,
  getCurrentWeekSummary,
  getInjuryRisk,
  getLast12Weeks,
  getRecentActivities,
  getSyncStatus,
  getTrainingLoadSeries,
  getUpcomingPlannedWorkouts,
} from "@/lib/data/queries";
import {
  metersToKm,
  metersToMiles,
  paceFromSecondsPerKm,
  relativeDate,
  secondsToDuration,
} from "@/lib/format";
import { prefersMetric } from "@/lib/units";
import { TrainingLoadChart } from "@/components/charts/training-load-chart";
import { WeeklyVolumeChart } from "@/components/charts/weekly-volume-chart";
import { createServiceClient } from "@/lib/supabase/service";
import { Activity, Footprints } from "lucide-react";
import Link from "next/link";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

function tsbVerdict(tsb: number) {
  if (tsb <= -30) return { verdict: "Overreaching.", adjective: "back off", tone: "rose" as const };
  if (tsb <= -10) return { verdict: "Productively", adjective: "tired", tone: "emerald" as const };
  if (tsb <= 10) return { verdict: "Holding", adjective: "steady", tone: "cyan" as const };
  if (tsb <= 25) return { verdict: "Fresh and", adjective: "race-ready", tone: "saffron" as const };
  return { verdict: "Very", adjective: "fresh", tone: "purple" as const };
}

export default async function DashboardPage() {
  const [
    athlete,
    weekSummary,
    recent,
    trainingLoad,
    gear,
    last12,
    vdotInfo,
    injuryRisk,
    upcoming,
    syncStatus,
  ] = await Promise.all([
    getAthlete(ATHLETE_ID),
    getCurrentWeekSummary(ATHLETE_ID),
    getRecentActivities(ATHLETE_ID, 6),
    getTrainingLoadSeries(ATHLETE_ID, 90),
    getActiveGear(ATHLETE_ID),
    getLast12Weeks(ATHLETE_ID),
    getCurrentVdot(ATHLETE_ID),
    getInjuryRisk(ATHLETE_ID),
    getUpcomingPlannedWorkouts(ATHLETE_ID, 7),
    getSyncStatus(ATHLETE_ID),
  ]);

  const sb = createServiceClient();
  const { data: activePlan } = await sb
    .from("training_plans")
    .select("name, current_phase, goal_race_date")
    .eq("athlete_id", ATHLETE_ID)
    .eq("status", "active")
    .maybeSingle();

  const todayPoint = trainingLoad[trainingLoad.length - 1];
  const ctl = todayPoint?.ctl ?? 0;
  const atl = todayPoint?.atl ?? 0;
  const tsb = todayPoint?.tsb ?? 0;
  const useMetric = prefersMetric(athlete.measurement_preference);
  const distanceFn = useMetric ? metersToKm : metersToMiles;
  const unit = useMetric ? "km" : "mi";
  const verdict = tsbVerdict(tsb);

  const syncPct = syncStatus.total
    ? Math.round((syncStatus.detailed / syncStatus.total) * 100)
    : 0;

  const daysToRace =
    activePlan?.goal_race_date
      ? Math.max(
          0,
          Math.ceil(
            (new Date(activePlan.goal_race_date).getTime() - Date.now()) / 86400000,
          ),
        )
      : null;

  const athleteName =
    `${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete";
  const athleteLocation =
    [athlete.city, athlete.state].filter(Boolean).join(", ") || undefined;

  return (
    <AppShell athleteName={athleteName} athleteLocation={athleteLocation}>
      <div className="reveal space-y-6">
        {/* HERO — Today's read */}
        <section className="card-hover rounded-3xl border bg-[radial-gradient(1000px_500px_at_100%_-10%,hsl(36_50%_90%/0.7),transparent),linear-gradient(to_bottom_right,hsl(var(--card)),hsl(36_50%_96%))] p-6 dark:bg-[radial-gradient(900px_500px_at_100%_-10%,hsl(36_40%_12%/0.7),transparent),linear-gradient(to_bottom_right,hsl(var(--card)),hsl(30_20%_7%))] md:p-8">
          <div className="flex items-baseline justify-between">
            <span className="eyebrow text-saffron-600 dark:text-saffron-400">
              Today&apos;s read
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
              {weekSummary?.week_number && ` · Week ${weekSummary.week_number}`}
              {activePlan?.current_phase && ` · ${activePlan.current_phase} phase`}
              {daysToRace !== null && ` · ${daysToRace}d to race`}
            </span>
          </div>

          <h1 className="serif mt-4 max-w-3xl text-5xl md:text-6xl">
            {verdict.verdict}{" "}
            <span className="italic text-saffron-600 dark:text-saffron-400">
              {verdict.adjective}
            </span>
            .
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            TSB{" "}
            <span className="font-mono tabular-nums text-foreground">
              {tsb.toFixed(0)}
            </span>{" "}
            · CTL{" "}
            <span className="font-mono tabular-nums text-foreground">
              {ctl.toFixed(1)}
            </span>{" "}
            · ACWR{" "}
            <span className="font-mono tabular-nums text-foreground">
              {injuryRisk.acwr?.toFixed(2) ?? "—"}
            </span>{" "}
            ({injuryRisk.level}). This week:{" "}
            <span className="font-mono tabular-nums text-foreground">
              {distanceFn(weekSummary?.run_distance_meters, 1)} {unit}
            </span>{" "}
            across{" "}
            <span className="font-mono tabular-nums text-foreground">
              {weekSummary?.run_count ?? 0}
            </span>{" "}
            runs.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 md:flex md:flex-wrap md:items-end md:gap-10">
            <Metric
              label="This week"
              value={distanceFn(weekSummary?.run_distance_meters, 1)}
              unit={unit}
              large
            />
            <Metric label="CTL" value={ctl.toFixed(1)} />
            <Metric
              label="TSB"
              value={tsb > 0 ? `+${tsb.toFixed(0)}` : tsb.toFixed(0)}
            />
            <Metric
              label="VDOT"
              value={vdotInfo.vdot?.toFixed(1) ?? "—"}
            />
            <Metric
              label="Injury risk"
              value={injuryRisk.acwr?.toFixed(2) ?? "—"}
              tone={injuryRisk.level}
            />
          </div>
        </section>

        {/* Glow tiles — secondary accents */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <GlowTile tone={verdict.tone}>
            <TileLabel>Training stress balance</TileLabel>
            <BigNumber value={tsb.toFixed(0)} unit="TSB" />
            <div className="mt-4 text-sm text-ink-900/80 dark:text-ink-50/80">
              ATL {atl.toFixed(1)} · {verdict.verdict} {verdict.adjective}
            </div>
          </GlowTile>

          <GlowTile tone="saffron">
            <TileLabel>Avg HR this week</TileLabel>
            <BigNumber
              value={
                weekSummary?.avg_run_heartrate
                  ? Math.round(weekSummary.avg_run_heartrate)
                  : "—"
              }
              unit="bpm"
            />
            <div className="mt-4 text-sm text-ink-900/80 dark:text-ink-50/80">
              Pace{" "}
              {paceFromSecondsPerKm(
                weekSummary?.avg_run_pace_seconds_per_km,
                useMetric ? "metric" : "imperial",
              )}
            </div>
          </GlowTile>

          <GlowTile tone="purple">
            <TileLabel>Long run</TileLabel>
            <BigNumber
              value={distanceFn(weekSummary?.long_run_distance_meters, 1)}
              unit={unit}
            />
            <div className="mt-4 text-sm text-ink-900/80 dark:text-ink-50/80">
              {weekSummary?.long_run_date
                ? new Date(weekSummary.long_run_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </div>
          </GlowTile>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="card-hover rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="serif text-xl">Training load</h2>
                <p className="text-xs text-muted-foreground">
                  CTL · ATL · TSB · last 90 days
                </p>
              </div>
            </div>
            <TrainingLoadChart data={trainingLoad} />
          </div>

          <div className="card-hover rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="serif text-xl">Weekly volume</h2>
                <p className="text-xs text-muted-foreground">Last 12 weeks</p>
              </div>
            </div>
            <WeeklyVolumeChart
              data={last12.map((w) => ({
                week: w.week_start,
                km: (Number(w.run_distance_meters) || 0) / 1000,
                load: Number(w.total_training_load) || 0,
              }))}
              useMetric={useMetric}
            />
          </div>
        </section>

        {/* Upcoming plan preview */}
        {upcoming.length > 0 && (
          <section className="rounded-xl border bg-card p-5">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="serif text-xl">Coming up</h2>
              <Link
                href="/plan"
                className="text-xs text-saffron-600 hover:underline dark:text-saffron-400"
              >
                View plan →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-7">
              {upcoming.slice(0, 7).map((p) => (
                <div
                  key={p.id}
                  className={`rounded-lg border p-3 text-sm transition-colors hover:bg-muted/40 ${p.status === "completed" ? "bg-emerald-500/5" : ""}`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {new Date(p.planned_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="mt-1 font-medium leading-tight">{p.title}</div>
                  {p.target_distance_meters && (
                    <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {distanceFn(p.target_distance_meters, 1)} {unit}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent + Shoes */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-hover rounded-xl border bg-card p-5 lg:col-span-2">
            <h2 className="serif mb-4 text-xl">Recent activities</h2>
            {recent.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No activities yet"
                description="Sync Strava to load your history. Cadence grounds every coach response in your real training data."
                action={{ label: "Check sync status", href: "/settings/data" }}
              />
            ) : (
              <div className="space-y-1">
                {recent.map((a) => (
                  <Link
                    key={a.id}
                    href={`/activities/${a.id}`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-black/[.03] dark:hover:bg-white/[.03]"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {relativeDate(a.start_date_local)} · {a.sport_type}
                        {a.workout_classification && ` · ${a.workout_classification}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div className="font-mono text-sm tabular-nums">
                        {distanceFn(a.distance_meters, 1)} {unit}
                      </div>
                      <div className="hidden font-mono text-xs text-muted-foreground tabular-nums sm:block">
                        {secondsToDuration(a.moving_time)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="card-hover rounded-xl border bg-card p-5">
            <h2 className="serif mb-4 text-xl">Shoes</h2>
            {gear.length === 0 ? (
              <EmptyState
                icon={Footprints}
                title="No shoes yet"
                description="Strava gear syncs automatically when the daily read budget resets."
                action={{ label: "Sync data", href: "/settings/data" }}
              />
            ) : (
              <div className="space-y-3">
                {gear.map((g) => {
                  const mi = Number(g.distance_meters ?? 0) / 1609.344;
                  const pct = Math.min(100, (mi / 500) * 100);
                  return (
                    <div key={g.id}>
                      <div className="flex items-baseline justify-between">
                        <span className="truncate text-sm font-medium">
                          {g.name} {g.is_primary && "★"}
                        </span>
                        <span className="font-mono text-xs tabular-nums text-muted-foreground">
                          {mi.toFixed(0)} mi
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-saffron-500 dark:bg-saffron-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Sync status strip */}
        <section className="rounded-xl border border-dashed bg-card/40 p-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span>
              <span className="font-semibold text-foreground">
                {syncStatus.total.toLocaleString()}
              </span>{" "}
              activities
            </span>
            <span>
              <span className="font-semibold text-foreground">
                {syncStatus.detailed.toLocaleString()}
              </span>{" "}
              detail-synced ({syncPct}%)
            </span>
            <span>
              <span className="font-semibold text-foreground">
                {syncStatus.weathered.toLocaleString()}
              </span>{" "}
              with weather
            </span>
            <span>
              <span className="font-semibold text-foreground">
                {syncStatus.embedded.toLocaleString()}
              </span>{" "}
              embedded
            </span>
            <Link
              href="/settings/data"
              className="ml-auto text-saffron-600 hover:underline dark:text-saffron-400"
            >
              Manage →
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Metric({
  label,
  value,
  unit,
  tone,
  large,
}: {
  label: string;
  value: string | number;
  unit?: string;
  tone?: "optimal" | "elevated" | "high" | "low";
  large?: boolean;
}) {
  const toneClass = {
    optimal: "text-emerald-500",
    elevated: "text-amber-500",
    high: "text-red-500",
    low: "text-muted-foreground",
  }[tone ?? "low"];
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className={large ? "mt-1" : "mt-0.5"}>
        <span
          className={`hero-number text-foreground ${large ? "text-5xl md:text-6xl" : "text-2xl"}`}
        >
          {value}
        </span>
        {unit && (
          <span className="ml-1.5 text-sm text-muted-foreground">{unit}</span>
        )}
      </div>
      {tone && (
        <div
          className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${toneClass}`}
        >
          {tone}
        </div>
      )}
    </div>
  );
}
