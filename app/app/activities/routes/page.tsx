import { getAthlete } from "@/lib/data/queries";
import { createServiceClient } from "@/lib/supabase/service";
import { prefersMetric } from "@/lib/units";

const ATHLETE_ID = 56272355;

export default async function RoutesPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  const useMetric = prefersMetric(athlete.measurement_preference);
  const unit = useMetric ? "km" : "mi";
  const sb = createServiceClient();

  const { data: acts } = await sb
    .from("activities")
    .select("start_lat, start_lng, distance_meters, moving_time, name, sport_type")
    .eq("athlete_id", ATHLETE_ID)
    .not("start_lat", "is", null)
    .not("start_lng", "is", null)
    .in("sport_type", ["Run", "TrailRun"])
    .order("start_date", { ascending: false })
    .limit(500);

  type RouteCluster = {
    lat: number;
    lng: number;
    count: number;
    totalKm: number;
    totalMin: number;
    exampleName: string;
  };
  const clusters = new Map<string, RouteCluster>();
  for (const a of acts ?? []) {
    if (a.start_lat === null || a.start_lng === null) continue;
    const key = `${Number(a.start_lat).toFixed(3)},${Number(a.start_lng).toFixed(3)}`;
    const c = clusters.get(key) ?? {
      lat: Number(a.start_lat),
      lng: Number(a.start_lng),
      count: 0,
      totalKm: 0,
      totalMin: 0,
      exampleName: a.name,
    };
    c.count += 1;
    c.totalKm += (Number(a.distance_meters) || 0) / 1000;
    c.totalMin += (a.moving_time ?? 0) / 60;
    clusters.set(key, c);
  }
  const top = Array.from(clusters.values())
    .filter((c) => c.count >= 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Routes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recurring starting points — useful for comparing conditions across
          the same loop.
        </p>
      </div>

      {top.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          Not enough clustered starts yet. Routes appear after 3+ runs from the
          same spot.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {top.map((c, i) => {
            const avgKm = c.totalKm / c.count;
            const avg = useMetric ? avgKm : avgKm * 0.621371;
            return (
              <div key={i} className="rounded-xl border bg-card p-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm font-semibold">{c.exampleName}</div>
                    <div className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                      {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold tabular-nums">
                      {c.count}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      runs
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    Avg distance:{" "}
                    <span className="font-mono tabular-nums text-foreground">
                      {avg.toFixed(1)} {unit}
                    </span>
                  </div>
                  <div>
                    Total time:{" "}
                    <span className="font-mono tabular-nums text-foreground">
                      {Math.round(c.totalMin / 60)}h
                    </span>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${c.lat},${c.lng}`}
                  target="_blank"
                  rel="noopener"
                  className="mt-3 inline-block text-xs text-saffron-600 hover:underline dark:text-saffron-400"
                >
                  Open in Maps →
                </a>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
