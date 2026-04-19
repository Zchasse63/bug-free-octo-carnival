import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { peerCompare } from "@/lib/analytics/peer-compare";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const [athlete, compare] = await Promise.all([
    getAthlete(ATHLETE_ID),
    peerCompare(ATHLETE_ID),
  ]);

  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Anonymized comparison against other Cadence athletes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Your VDOT
          </div>
          <div className="mt-1 font-mono text-3xl font-bold tabular-nums">
            {compare.my_vdot?.toFixed(1) ?? "—"}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Weekly km percentile
          </div>
          <div className="mt-1 font-mono text-3xl font-bold tabular-nums">
            {compare.km_percentile !== null ? `${compare.km_percentile}th` : "—"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {compare.my_avg_km_per_week} km/week (4-week avg)
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Weekly load percentile
          </div>
          <div className="mt-1 font-mono text-3xl font-bold tabular-nums">
            {compare.load_percentile !== null ? `${compare.load_percentile}th` : "—"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {compare.my_avg_load_per_week} load/week (4-week avg)
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        Peer pool: {compare.peer_sample_size} other athletes. Only anonymized
        aggregates are compared — no individual data is ever shared.
      </div>
    </AppShell>
  );
}
