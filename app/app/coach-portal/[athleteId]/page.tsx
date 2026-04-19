import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { createServiceClient } from "@/lib/supabase/service";
import { computeACWR } from "@/lib/analytics/vdot";
import { notFound } from "next/navigation";

const COACH_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function CoachAthleteView({
  params,
}: {
  params: Promise<{ athleteId: string }>;
}) {
  const { athleteId: athleteIdStr } = await params;
  const athleteId = Number(athleteIdStr);
  if (Number.isNaN(athleteId)) notFound();

  const sb = createServiceClient();
  const { data: link } = await sb
    .from("coach_athletes")
    .select("status, permissions")
    .eq("coach_id", COACH_ID)
    .eq("athlete_id", athleteId)
    .maybeSingle();
  if (!link) notFound();

  const perms =
    (link.permissions as {
      view_activities?: boolean;
      view_notes?: boolean;
      view_streams?: boolean;
      modify_plan?: boolean;
    }) ?? {};

  const [athlete, coachAthlete, weekly, risk] = await Promise.all([
    getAthlete(COACH_ID),
    getAthlete(athleteId).catch(() => null),
    sb
      .from("weekly_summaries")
      .select("week_start, run_count, run_distance_meters, total_training_load, avg_run_heartrate")
      .eq("athlete_id", athleteId)
      .order("week_start", { ascending: false })
      .limit(6),
    computeACWR(athleteId),
  ]);

  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Coach"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {coachAthlete
            ? `${coachAthlete.firstname ?? ""} ${coachAthlete.lastname ?? ""}`.trim()
            : "Athlete"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Coach view · {link.status}
        </p>
      </div>

      <div className="mb-6 rounded-xl border bg-card p-4 text-xs text-muted-foreground">
        Permissions: activities {perms.view_activities ? "✓" : "—"} · notes{" "}
        {perms.view_notes ? "✓" : "—"} · modify plan {perms.modify_plan ? "✓" : "—"}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Injury risk
          </div>
          <div className="mt-1 font-mono text-2xl font-bold tabular-nums">
            {risk.acwr?.toFixed(2) ?? "—"}
          </div>
          <div className="mt-1 text-[10px] uppercase text-muted-foreground">
            {risk.level}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Last 6 weeks</h2>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-2 text-left font-semibold">Week</th>
              <th className="py-2 text-right font-semibold">Runs</th>
              <th className="py-2 text-right font-semibold">Distance</th>
              <th className="py-2 text-right font-semibold">Load</th>
              <th className="py-2 text-right font-semibold">Avg HR</th>
            </tr>
          </thead>
          <tbody>
            {(weekly.data ?? []).map((w) => (
              <tr key={w.week_start} className="border-t">
                <td className="py-2 font-mono tabular-nums">{w.week_start}</td>
                <td className="py-2 text-right font-mono tabular-nums">
                  {w.run_count}
                </td>
                <td className="py-2 text-right font-mono tabular-nums">
                  {((Number(w.run_distance_meters) || 0) / 1000).toFixed(1)} km
                </td>
                <td className="py-2 text-right font-mono tabular-nums">
                  {w.total_training_load}
                </td>
                <td className="py-2 text-right font-mono tabular-nums">
                  {w.avg_run_heartrate ? Math.round(Number(w.avg_run_heartrate)) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
