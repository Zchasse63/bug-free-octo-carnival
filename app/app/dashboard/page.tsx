import { AppShell } from "@/components/app-shell";
import { BigNumber, GlowTile, TileLabel } from "@/components/glow-tile";
import {
  getActiveGear,
  getAthlete,
  getCurrentWeekSummary,
  getLast12Weeks,
  getRecentActivities,
  getTrainingLoadSeries,
} from "@/lib/data/queries";
import {
  metersToKm,
  metersToMiles,
  paceFromSecondsPerKm,
  relativeDate,
  secondsToDuration,
} from "@/lib/format";
import { TrainingLoadChart } from "@/components/charts/training-load-chart";
import { WeeklyVolumeChart } from "@/components/charts/weekly-volume-chart";

// Phase 1: single user. Phase 2+: read athlete_id from session.
const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [athlete, weekSummary, recent, trainingLoad, gear, last12] =
    await Promise.all([
      getAthlete(ATHLETE_ID),
      getCurrentWeekSummary(ATHLETE_ID),
      getRecentActivities(ATHLETE_ID, 6),
      getTrainingLoadSeries(ATHLETE_ID, 90),
      getActiveGear(ATHLETE_ID),
      getLast12Weeks(ATHLETE_ID),
    ]);

  const todayPoint = trainingLoad[trainingLoad.length - 1];
  const ctl = todayPoint?.ctl ?? 0;
  const atl = todayPoint?.atl ?? 0;
  const tsb = todayPoint?.tsb ?? 0;
  const useMetric = athlete.measurement_preference !== "standard";
  const distanceFn = useMetric ? metersToKm : metersToMiles;
  const unit = useMetric ? "km" : "mi";

  const tsbState =
    tsb <= -30
      ? { label: "Very fatigued", tone: "rose" as const }
      : tsb <= -10
        ? { label: "Productively tired", tone: "emerald" as const }
        : tsb <= 10
          ? { label: "Neutral", tone: "cyan" as const }
          : tsb <= 25
            ? { label: "Fresh — race ready", tone: "saffron" as const }
            : { label: "Very fresh", tone: "purple" as const };

  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Your training</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            {weekSummary?.week_number &&
              ` · Week ${weekSummary.week_number} of ${weekSummary.year}`}
          </p>
        </div>
      </div>

      {/* Hero row */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            This week
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-5xl font-bold tabular-nums leading-none tracking-tight text-foreground">
              {distanceFn(weekSummary?.run_distance_meters, 1)}
            </span>
            <span className="text-lg text-muted-foreground">{unit}</span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            {weekSummary?.run_count ?? 0} runs ·{" "}
            {secondsToDuration(weekSummary?.run_moving_time ?? null)} moving
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Fitness (CTL)
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-5xl font-bold tabular-nums leading-none tracking-tight text-foreground">
              {ctl.toFixed(1)}
            </span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            42-day rolling training load
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Form (TSB)
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-5xl font-bold tabular-nums leading-none tracking-tight text-foreground">
              {tsb.toFixed(1)}
            </span>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            {tsbState.label} · ATL {atl.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Glow tile row */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <GlowTile tone={tsbState.tone}>
          <TileLabel>Training stress balance</TileLabel>
          <BigNumber value={tsb.toFixed(0)} unit="TSB" />
          <div className="mt-4 text-sm text-ink-900/75 dark:text-ink-50/80">
            {tsbState.label}
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
          <div className="mt-4 text-sm text-ink-900/75 dark:text-ink-50/80">
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
          <div className="mt-4 text-sm text-ink-900/75 dark:text-ink-50/80">
            {weekSummary?.long_run_date
              ? new Date(weekSummary.long_run_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </div>
        </GlowTile>
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Training load</h2>
              <p className="text-xs text-muted-foreground">
                CTL · ATL · TSB (last 90 days)
              </p>
            </div>
          </div>
          <TrainingLoadChart data={trainingLoad} />
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Weekly volume</h2>
              <p className="text-xs text-muted-foreground">Last 12 weeks</p>
            </div>
          </div>
          <WeeklyVolumeChart
            data={last12.map((w) => ({
              week: w.week_start,
              km: (Number(w.run_distance_meters) || 0) / 1000,
              load: Number(w.total_training_load) || 0,
            }))}
          />
        </div>
      </div>

      {/* Recent activities + gear */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold">Recent activities</h2>
          <div className="space-y-1">
            {recent.map((a) => (
              <a
                key={a.id}
                href={`/activities/${a.id}`}
                className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-black/[.03] dark:hover:bg-white/[.03]"
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
              </a>
            ))}
            {recent.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No activities yet — sync Strava to load your history.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold">Shoes</h2>
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
            {gear.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No shoes synced yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
