import { getSyncStatus } from "@/lib/data/queries";
import { DataActions } from "@/components/settings/data-actions";
import { createServiceClient } from "@/lib/supabase/service";

const ATHLETE_ID = 56272355;

export default async function DataSettingsPage() {
  const sync = await getSyncStatus(ATHLETE_ID);
  const sb = createServiceClient();
  const { data: lastSyncs } = await sb
    .from("sync_log")
    .select("sync_type, status, activities_synced, started_at, rate_limit_hit")
    .eq("athlete_id", ATHLETE_ID)
    .order("started_at", { ascending: false })
    .limit(10);

  const pct = sync.total
    ? Math.round((sync.detailed / sync.total) * 100)
    : 0;
  const weatherPct = sync.total
    ? Math.round((sync.weathered / sync.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Stat title="Activities" value={sync.total.toLocaleString()} subtitle="Total summary-synced from Strava" />
        <Stat title="Details" value={`${pct}%`} subtitle={`${sync.detailed.toLocaleString()} / ${sync.total.toLocaleString()} fully fetched`} />
        <Stat title="Weather" value={`${weatherPct}%`} subtitle={`${sync.weathered.toLocaleString()} enriched with Open-Meteo`} />
        <Stat title="Embeddings" value={sync.embedded.toLocaleString()} subtitle="Activities indexed for semantic search" />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="serif text-xl">Connected services</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Athlete 56272355 on Strava (full-scope). Token auto-refreshes before each call.
        </p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Strava · connected
          </span>
        </div>
      </div>

      <DataActions />

      <div className="rounded-xl border bg-card p-6">
        <h2 className="serif text-xl">Recent sync history</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2 text-left font-semibold">When</th>
                <th className="py-2 text-left font-semibold">Pass</th>
                <th className="py-2 text-left font-semibold">Status</th>
                <th className="py-2 text-right font-semibold">Synced</th>
                <th className="py-2 text-right font-semibold">Rate-limited</th>
              </tr>
            </thead>
            <tbody>
              {(lastSyncs ?? []).map((s, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 font-mono text-xs tabular-nums">
                    {s.started_at
                      ? new Date(s.started_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="py-2 text-xs">{s.sync_type}</td>
                  <td className="py-2 text-xs uppercase tracking-wider">{s.status}</td>
                  <td className="py-2 text-right font-mono text-xs tabular-nums">
                    {s.activities_synced ?? 0}
                  </td>
                  <td className="py-2 text-right text-xs">
                    {s.rate_limit_hit ? "yes" : "—"}
                  </td>
                </tr>
              ))}
              {(lastSyncs ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-sm text-muted-foreground">
                    No sync runs logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="eyebrow">{title}</div>
      <div className="mt-1 hero-number text-3xl text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
    </div>
  );
}
