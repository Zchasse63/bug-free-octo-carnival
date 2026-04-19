import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { timeMachine } from "@/lib/analytics/time-machine";
import { detectFatigueSignals } from "@/lib/analytics/fatigue-fingerprint";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const [athlete, tm, signals] = await Promise.all([
    getAthlete(ATHLETE_ID),
    timeMachine(ATHLETE_ID),
    detectFatigueSignals(ATHLETE_ID),
  ]);

  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Time machine, fatigue signals, and patterns the coach noticed.
        </p>
      </div>

      {/* Time machine */}
      <div className="mb-6 rounded-xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">
          Time machine — week {tm.week_number} through the years
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2 text-left font-semibold">Year</th>
                <th className="py-2 text-right font-semibold">Distance</th>
                <th className="py-2 text-right font-semibold">Load</th>
                <th className="py-2 text-right font-semibold">Avg HR</th>
                <th className="py-2 text-right font-semibold">Pace</th>
              </tr>
            </thead>
            <tbody>
              {tm.years.map((y) => (
                <tr
                  key={y.year}
                  className={`border-t ${y.is_current_year ? "bg-saffron-500/5 font-medium" : ""}`}
                >
                  <td className="py-2 font-mono tabular-nums">{y.year}</td>
                  <td className="py-2 text-right font-mono tabular-nums">
                    {y.distance_km.toFixed(1)} km
                  </td>
                  <td className="py-2 text-right font-mono tabular-nums">
                    {y.training_load ?? "—"}
                  </td>
                  <td className="py-2 text-right font-mono tabular-nums">
                    {y.avg_hr ? Math.round(Number(y.avg_hr)) : "—"}
                  </td>
                  <td className="py-2 text-right font-mono tabular-nums">
                    {y.pace_sec_per_km
                      ? `${Math.floor(Number(y.pace_sec_per_km) / 60)}:${String(Number(y.pace_sec_per_km) % 60).padStart(2, "0")}/km`
                      : "—"}
                  </td>
                </tr>
              ))}
              {tm.years.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-sm text-muted-foreground">
                    No historical weeks aligned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fatigue signals */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Fatigue fingerprint</h2>
        {signals.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No unusual fatigue signals in the last 10 easy runs.
          </div>
        ) : (
          <div className="space-y-2">
            {signals.map((s, i) => (
              <div key={i} className="rounded-md border px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {s.signal.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`text-xs font-semibold uppercase ${
                      s.severity === "high"
                        ? "text-red-500"
                        : s.severity === "moderate"
                          ? "text-amber-500"
                          : "text-muted-foreground"
                    }`}
                  >
                    {s.severity}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {s.date} · {s.detail}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
