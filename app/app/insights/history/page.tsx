import Link from "next/link";
import { getAthlete } from "@/lib/data/queries";
import { prefersMetric } from "@/lib/units";
import {
  getCareerOverview,
  getMonthlyVolume,
  getFitnessCurve,
  getAllTimeBestEfforts,
  getPaceProgression,
  getHrEfficiency,
  getTimeOfDayStats,
  getMilestones,
  getTopRoutes,
} from "@/lib/analytics/history";
import {
  metersToKm,
  metersToMiles,
  paceFromSecondsPerKm,
} from "@/lib/format";
import {
  FitnessCurveChart,
  MonthlyVolumeChart,
  PaceProgressionChart,
  HrEfficiencyChart,
} from "@/components/charts/history-charts";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

function formatRaceTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function displayDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function yearsBetween(a: string, b: string | null): number {
  if (!b) return 0;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round((ms / (365.25 * 86400000)) * 10) / 10;
}

function formatHours(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  if (h === 0) return `${Math.round(seconds / 60)}m`;
  if (h < 100) return `${h}h`;
  return `${h.toLocaleString()}h`;
}

export default async function HistoryPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  const [
    overview,
    monthly,
    fitnessCurve,
    bestEfforts,
    paceProgression,
    hrEfficiency,
    timeOfDay,
    milestones,
    topRoutes,
  ] = await Promise.all([
    getCareerOverview(ATHLETE_ID),
    getMonthlyVolume(ATHLETE_ID, 36),
    getFitnessCurve(ATHLETE_ID),
    getAllTimeBestEfforts(ATHLETE_ID),
    getPaceProgression(ATHLETE_ID),
    getHrEfficiency(ATHLETE_ID, 18),
    getTimeOfDayStats(ATHLETE_ID),
    getMilestones(ATHLETE_ID),
    getTopRoutes(ATHLETE_ID, 5),
  ]);

  const useMetric = prefersMetric(athlete.measurement_preference);
  const unit = useMetric ? "km" : "mi";
  const distanceFn = useMetric ? metersToKm : metersToMiles;
  const elevationFn = (m: number) =>
    useMetric ? Math.round(m).toLocaleString() : Math.round(m * 3.281).toLocaleString();
  const elevationUnit = useMetric ? "m" : "ft";

  const yearsActive = overview.first_activity_date
    ? yearsBetween(overview.first_activity_date, new Date().toISOString())
    : 0;

  const bestTod = [...timeOfDay]
    .filter((t) => t.avg_pace_sec_per_km)
    .sort(
      (a, b) =>
        (a.avg_pace_sec_per_km ?? 99999) - (b.avg_pace_sec_per_km ?? 99999),
    )[0];

  return (
    <div className="reveal space-y-6">
      <div>
        <h1 className="serif text-3xl md:text-4xl">Your running story</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every mile, PR, and training block since you started tracking.
        </p>
      </div>

      {/* Career overview */}
      <section className="card-hover rounded-xl border bg-card p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="serif text-xl">Career overview</h2>
          {overview.first_activity_date && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Since {displayDate(overview.first_activity_date)} · {yearsActive}{" "}
              yrs
            </span>
          )}
        </div>
        {overview.total_runs === 0 ? (
          <div className="mt-6 text-sm text-muted-foreground">
            No runs synced yet.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-6 md:grid-cols-5">
            <CareerStat
              label="Runs"
              value={overview.total_runs.toLocaleString()}
            />
            <CareerStat
              label={`Distance (${unit})`}
              value={distanceFn(overview.total_distance_meters, 0)}
            />
            <CareerStat
              label="Moving time"
              value={formatHours(overview.total_moving_seconds)}
            />
            <CareerStat
              label={`Elevation (${elevationUnit})`}
              value={elevationFn(overview.total_elevation_meters)}
            />
            <CareerStat
              label="Ultra-length"
              value={overview.total_runs_longer_than_marathon.toLocaleString()}
              hint="runs longer than a marathon"
            />
          </div>
        )}
      </section>

      {/* Fitness curve */}
      <section className="card-hover rounded-xl border bg-card p-6">
        <div className="mb-3">
          <h2 className="serif text-xl">Fitness over time</h2>
          <p className="text-xs text-muted-foreground">
            Weekly Fitness estimate, all time. Higher = more training
            consistently banked.
          </p>
        </div>
        <FitnessCurveChart data={fitnessCurve} />
      </section>

      {/* Monthly volume */}
      <section className="card-hover rounded-xl border bg-card p-6">
        <div className="mb-3">
          <h2 className="serif text-xl">Monthly running distance</h2>
          <p className="text-xs text-muted-foreground">Last 3 years</p>
        </div>
        <MonthlyVolumeChart data={monthly} useMetric={useMetric} />
      </section>

      {/* Pace progression */}
      <section className="card-hover rounded-xl border bg-card p-6">
        <div className="mb-3">
          <h2 className="serif text-xl">Pace progression</h2>
          <p className="text-xs text-muted-foreground">
            Your fastest pace per quarter at the classic race distances — lower
            line = faster.
          </p>
        </div>
        <PaceProgressionChart data={paceProgression} useMetric={useMetric} />
      </section>

      {/* HR efficiency */}
      <section className="card-hover rounded-xl border bg-card p-6">
        <div className="mb-3">
          <h2 className="serif text-xl">Aerobic efficiency</h2>
          <p className="text-xs text-muted-foreground">
            Avg heart rate on easy runs vs avg easy pace, by month. As you
            get fitter, HR drops at the same pace.
          </p>
        </div>
        <HrEfficiencyChart data={hrEfficiency} useMetric={useMetric} />
      </section>

      {/* Best efforts hall of fame */}
      <section className="card-hover rounded-xl border bg-card p-6">
        <h2 className="serif mb-3 text-xl">Personal records</h2>
        {bestEfforts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No PRs detected yet. Strava reports best efforts once you&apos;ve
            raced or done effort-based sessions.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {bestEfforts.map((pr) => (
              <Link
                key={pr.name}
                href={pr.activity_id ? `/activities/${pr.activity_id}` : "#"}
                className="rounded-lg border p-3 transition-colors hover:bg-muted/30"
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {pr.name}
                </div>
                <div className="mt-1 font-mono text-2xl font-bold tabular-nums">
                  {formatRaceTime(pr.best_time_seconds)}
                </div>
                <div className="mt-1 font-mono text-[10px] tabular-nums text-muted-foreground">
                  {paceFromSecondsPerKm(
                    pr.best_time_seconds / (pr.distance_meters / 1000),
                    useMetric ? "metric" : "imperial",
                  )}
                </div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">
                  {displayDate(pr.best_date)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Time-of-day splits + Top routes (two-up on desktop) */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card-hover rounded-xl border bg-card p-6">
          <h2 className="serif text-xl">When you run best</h2>
          <p className="text-xs text-muted-foreground">
            Paces grouped by start time of day.
          </p>
          {timeOfDay.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Not enough data yet.
            </p>
          ) : (
            <>
              {bestTod && (
                <p className="mt-3 text-sm">
                  You run fastest in the{" "}
                  <span className="font-semibold text-foreground">
                    {bestTod.bucket.toLowerCase()}
                  </span>
                  : avg{" "}
                  <span className="font-mono tabular-nums">
                    {paceFromSecondsPerKm(
                      bestTod.avg_pace_sec_per_km!,
                      useMetric ? "metric" : "imperial",
                    )}
                  </span>{" "}
                  across{" "}
                  <span className="font-mono tabular-nums">
                    {bestTod.run_count}
                  </span>{" "}
                  runs.
                </p>
              )}
              <table className="mt-4 w-full text-sm">
                <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-2 text-left font-semibold">Time</th>
                    <th className="py-2 text-right font-semibold">Runs</th>
                    <th className="py-2 text-right font-semibold">Avg pace</th>
                    <th className="py-2 text-right font-semibold">Avg HR</th>
                  </tr>
                </thead>
                <tbody>
                  {timeOfDay.map((r) => (
                    <tr key={r.bucket} className="border-t">
                      <td className="py-2">{r.bucket}</td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {r.run_count}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {r.avg_pace_sec_per_km
                          ? paceFromSecondsPerKm(
                              r.avg_pace_sec_per_km,
                              useMetric ? "metric" : "imperial",
                            )
                          : "—"}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {r.avg_heartrate ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <div className="card-hover rounded-xl border bg-card p-6">
          <h2 className="serif text-xl">Favorite routes</h2>
          <p className="text-xs text-muted-foreground">
            The starts you&apos;ve come back to the most.
          </p>
          {topRoutes.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Routes show up once you&apos;ve repeated starting points.
            </p>
          ) : (
            <ol className="mt-3 space-y-2">
              {topRoutes.map((r, i) => (
                <li
                  key={`${r.lat_rounded},${r.lng_rounded}`}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-semibold">
                      #{i + 1} &middot; {r.run_count} runs
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground tabular-nums">
                      {r.lat_rounded.toFixed(2)}, {r.lng_rounded.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm tabular-nums">
                      {distanceFn(r.avg_distance_meters, 1)} {unit}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground tabular-nums">
                      {r.avg_pace_sec_per_km
                        ? paceFromSecondsPerKm(
                            r.avg_pace_sec_per_km,
                            useMetric ? "metric" : "imperial",
                          )
                        : "—"}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Milestones strip */}
      <section className="card-hover rounded-xl border bg-card p-6">
        <h2 className="serif mb-3 text-xl">Milestones</h2>
        {milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Milestones will appear as you hit them.
          </p>
        ) : (
          <ol className="relative space-y-3 border-l pl-5">
            {milestones.map((m, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[22px] top-1 inline-flex h-2.5 w-2.5 rounded-full bg-saffron-500 ring-2 ring-background dark:bg-saffron-400" />
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs text-muted-foreground">
                  {displayDate(m.date)} &middot;{" "}
                  {distanceFn(m.distance_meters, 1)} {unit}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function CareerStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-2xl font-bold tabular-nums">
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[10px] text-muted-foreground">{hint}</div>}
    </div>
  );
}
