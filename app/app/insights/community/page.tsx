import { peerCompare } from "@/lib/analytics/peer-compare";
import { getAthlete } from "@/lib/data/queries";
import { prefersMetric } from "@/lib/units";
import { runningScoreBand } from "@/lib/analytics/labels";

const ATHLETE_ID = 56272355;

export default async function CommunityPage() {
  const [athlete, compare] = await Promise.all([
    getAthlete(ATHLETE_ID),
    peerCompare(ATHLETE_ID),
  ]);
  const useMetric = prefersMetric(athlete.measurement_preference);
  const unit = useMetric ? "km" : "mi";
  const km = compare.my_avg_km_per_week;
  const vol = useMetric ? km : km * 0.621371;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Anonymized comparison against other Cadence athletes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Your running score
          </div>
          <div className="mt-1 text-2xl font-semibold">
            {runningScoreBand(compare.my_vdot) ?? "—"}
          </div>
          <div className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
            {compare.my_vdot?.toFixed(1) ?? "—"} · VO₂max estimate
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Weekly {unit} percentile
          </div>
          <div className="mt-1 font-mono text-3xl font-bold tabular-nums">
            {compare.km_percentile !== null
              ? `${compare.km_percentile}th`
              : compare.peer_sample_size === 0
                ? "—"
                : "—"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {compare.peer_sample_size === 0
              ? `You: ${vol.toFixed(1)} ${unit}/week (need more athletes to compare)`
              : `${vol.toFixed(1)} ${unit}/week (4-week avg)`}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Weekly load percentile
          </div>
          <div className="mt-1 font-mono text-3xl font-bold tabular-nums">
            {compare.load_percentile !== null
              ? `${compare.load_percentile}th`
              : "—"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {compare.peer_sample_size === 0
              ? `You: ${compare.my_avg_load_per_week} load/week (need more athletes to compare)`
              : `${compare.my_avg_load_per_week} load/week (4-week avg)`}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        {compare.peer_sample_size === 0
          ? "No peers yet. Percentiles show up once more Cadence athletes are in the pool. Only anonymized aggregates are compared — no individual data is ever shared."
          : `Peer pool: ${compare.peer_sample_size} other athletes. Only anonymized aggregates are compared — no individual data is ever shared.`}
      </div>
    </>
  );
}
