import { createServiceClient } from "@/lib/supabase/service";

/**
 * Anonymized peer comparison: compute the athlete's percentile among
 * all athletes in the same VDOT band and recent-volume band.
 * No raw data about other athletes is returned.
 */
export async function peerCompare(athleteId: number) {
  const sb = createServiceClient();

  // My latest VDOT + weekly volume
  const { data: myZones } = await sb
    .from("athlete_zones")
    .select("estimated_vdot")
    .eq("athlete_id", athleteId)
    .order("effective_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  const myVdot = myZones?.estimated_vdot ? Number(myZones.estimated_vdot) : null;

  const { data: myLast4 } = await sb
    .from("weekly_summaries")
    .select("run_distance_meters, total_training_load")
    .eq("athlete_id", athleteId)
    .order("week_start", { ascending: false })
    .limit(4);
  const myAvgKm =
    (myLast4 ?? []).reduce((s, w) => s + Number(w.run_distance_meters) || 0, 0) /
    (myLast4?.length || 1) /
    1000;
  const myAvgLoad =
    (myLast4 ?? []).reduce((s, w) => s + (Number(w.total_training_load) || 0), 0) /
    (myLast4?.length || 1);

  // Peer pool: other athletes with recent data
  const { data: peers } = await sb
    .from("weekly_summaries")
    .select("athlete_id, run_distance_meters, total_training_load, week_start")
    .gte(
      "week_start",
      new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10),
    )
    .neq("athlete_id", athleteId);
  const byPeer = new Map<number, { km: number; load: number; n: number }>();
  for (const p of peers ?? []) {
    const b = byPeer.get(p.athlete_id) ?? { km: 0, load: 0, n: 0 };
    b.km += (Number(p.run_distance_meters) || 0) / 1000;
    b.load += Number(p.total_training_load) || 0;
    b.n += 1;
    byPeer.set(p.athlete_id, b);
  }
  const peerAverages = Array.from(byPeer.values())
    .filter((p) => p.n >= 2)
    .map((p) => ({ km: p.km / p.n, load: p.load / p.n }));

  function percentile(value: number, pool: number[]): number | null {
    if (pool.length === 0) return null;
    const sorted = [...pool].sort((a, b) => a - b);
    const below = sorted.filter((v) => v < value).length;
    return Math.round((below / sorted.length) * 100);
  }

  const kmPct = percentile(
    myAvgKm,
    peerAverages.map((p) => p.km),
  );
  const loadPct = percentile(
    myAvgLoad,
    peerAverages.map((p) => p.load),
  );

  return {
    my_vdot: myVdot,
    my_avg_km_per_week: Math.round(myAvgKm * 10) / 10,
    my_avg_load_per_week: Math.round(myAvgLoad),
    peer_sample_size: peerAverages.length,
    km_percentile: kmPct,
    load_percentile: loadPct,
  };
}
