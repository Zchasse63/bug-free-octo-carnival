import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { createServiceClient } from "@/lib/supabase/service";
import {
  metersToKm,
  metersToMiles,
  paceFromSecondsPerKm,
  relativeDate,
  secondsToDuration,
} from "@/lib/format";
import Link from "next/link";

const ATHLETE_ID = 56272355;
const PAGE_SIZE = 40;

export const dynamic = "force-dynamic";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));
  const athlete = await getAthlete(ATHLETE_ID);

  const sb = createServiceClient();
  const { data: activities, count } = await sb
    .from("activities")
    .select(
      "id, name, sport_type, workout_classification, start_date_local, distance_meters, moving_time, average_heartrate, training_load, pace_per_km_seconds",
      { count: "exact" },
    )
    .eq("athlete_id", ATHLETE_ID)
    .order("start_date_local", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
  const useMetric = athlete.measurement_preference !== "standard";
  const distanceFn = useMetric ? metersToKm : metersToMiles;
  const unit = useMetric ? "km" : "mi";

  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Activities</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {count?.toLocaleString() ?? 0} total · page {page} of {totalPages}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Activity</th>
              <th className="px-4 py-3 text-right font-semibold">Distance</th>
              <th className="px-4 py-3 text-right font-semibold">Time</th>
              <th className="hidden px-4 py-3 text-right font-semibold md:table-cell">
                Pace
              </th>
              <th className="hidden px-4 py-3 text-right font-semibold md:table-cell">
                HR
              </th>
              <th className="hidden px-4 py-3 text-right font-semibold lg:table-cell">
                Load
              </th>
            </tr>
          </thead>
          <tbody>
            {(activities ?? []).map((a) => (
              <tr key={a.id} className="border-b last:border-b-0 hover:bg-black/[.02] dark:hover:bg-white/[.02]">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                  {relativeDate(a.start_date_local)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/activities/${a.id}`}
                    className="font-medium hover:underline"
                  >
                    {a.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {a.sport_type}
                    {a.workout_classification && ` · ${a.workout_classification}`}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">
                  {distanceFn(a.distance_meters, 1)} {unit}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-muted-foreground">
                  {secondsToDuration(a.moving_time)}
                </td>
                <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-muted-foreground md:table-cell">
                  {paceFromSecondsPerKm(
                    a.pace_per_km_seconds,
                    useMetric ? "metric" : "imperial",
                  )}
                </td>
                <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-muted-foreground md:table-cell">
                  {a.average_heartrate ? Math.round(a.average_heartrate) : "—"}
                </td>
                <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-muted-foreground lg:table-cell">
                  {a.training_load ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href={`/activities?page=${Math.max(1, page - 1)}`}
          className={`rounded-md border px-3 py-1.5 text-sm ${page === 1 ? "pointer-events-none opacity-40" : "hover:bg-black/[.03] dark:hover:bg-white/[.03]"}`}
        >
          ← Previous
        </Link>
        <Link
          href={`/activities?page=${Math.min(totalPages, page + 1)}`}
          className={`rounded-md border px-3 py-1.5 text-sm ${page === totalPages ? "pointer-events-none opacity-40" : "hover:bg-black/[.03] dark:hover:bg-white/[.03]"}`}
        >
          Next →
        </Link>
      </div>
    </AppShell>
  );
}
