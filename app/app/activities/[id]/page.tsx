import { AppShell } from "@/components/app-shell";
import { ActivityNoteForm } from "@/components/activity-note-form";
import { ActivityStreamsPanel } from "@/components/activity-streams-panel";
import { getAthlete } from "@/lib/data/queries";
import { createServiceClient } from "@/lib/supabase/service";
import {
  cToF,
  kmhToMph,
  metersToKm,
  metersToMiles,
  paceFromSecondsPerKm,
  secondsToDuration,
} from "@/lib/format";
import { notFound } from "next/navigation";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (Number.isNaN(id)) notFound();

  const sb = createServiceClient();
  const [athlete, activityRes, weatherRes, lapsRes, splitsRes, streamsRes, notesRes] =
    await Promise.all([
      getAthlete(ATHLETE_ID),
      sb.from("activities").select("*").eq("id", id).maybeSingle(),
      sb.from("activity_weather").select("*").eq("activity_id", id).maybeSingle(),
      sb
        .from("activity_laps")
        .select("*")
        .eq("activity_id", id)
        .order("lap_index", { ascending: true }),
      sb
        .from("activity_splits")
        .select("*")
        .eq("activity_id", id)
        .eq("unit_system", "metric")
        .order("split_number", { ascending: true }),
      sb
        .from("activity_streams")
        .select(
          "time_data, distance_data, heartrate_data, velocity_data, altitude_data, cadence_data",
        )
        .eq("activity_id", id)
        .maybeSingle(),
      sb
        .from("activity_notes")
        .select("id, raw_text, sentiment, perceived_effort, created_at")
        .eq("activity_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const activity = activityRes.data;
  if (!activity) notFound();

  const useMetric = athlete.measurement_preference !== "standard";
  const distanceFn = useMetric ? metersToKm : metersToMiles;
  const unit = useMetric ? "km" : "mi";
  const weather = weatherRes.data;
  const laps = lapsRes.data ?? [];
  const splits = splitsRes.data ?? [];
  const streamsRow = streamsRes.data;
  const notes = notesRes.data ?? [];

  const streams = streamsRow
    ? {
        time: (streamsRow.time_data as number[] | null) ?? [],
        distance: (streamsRow.distance_data as number[] | null) ?? undefined,
        heartrate: (streamsRow.heartrate_data as number[] | null) ?? undefined,
        velocity: (streamsRow.velocity_data as number[] | null) ?? undefined,
        altitude: (streamsRow.altitude_data as number[] | null) ?? undefined,
        cadence: (streamsRow.cadence_data as number[] | null) ?? undefined,
      }
    : null;

  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <div className="text-sm text-muted-foreground">
          {new Date(activity.start_date_local).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          {" · "}
          {activity.sport_type}
          {activity.workout_classification && ` · ${activity.workout_classification}`}
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {activity.name}
        </h1>
        {activity.description && (
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {activity.description}
          </p>
        )}
      </div>

      {/* Key metrics */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          label="Distance"
          value={distanceFn(activity.distance_meters, 2)}
          unit={unit}
        />
        <MetricCard
          label="Moving time"
          value={secondsToDuration(activity.moving_time)}
        />
        <MetricCard
          label="Avg pace"
          value={paceFromSecondsPerKm(
            activity.pace_per_km_seconds,
            useMetric ? "metric" : "imperial",
          )}
        />
        <MetricCard
          label="Avg HR"
          value={
            activity.average_heartrate
              ? `${Math.round(activity.average_heartrate)}`
              : "—"
          }
          unit={activity.average_heartrate ? "bpm" : undefined}
        />
        <MetricCard
          label="Max HR"
          value={
            activity.max_heartrate ? `${Math.round(activity.max_heartrate)}` : "—"
          }
          unit={activity.max_heartrate ? "bpm" : undefined}
        />
        <MetricCard
          label="Elev gain"
          value={`${Math.round(Number(activity.total_elevation_gain ?? 0))}`}
          unit="m"
        />
        <MetricCard
          label="Avg cadence"
          value={
            activity.average_cadence
              ? `${Math.round(activity.average_cadence * 2)}`
              : "—"
          }
          unit={activity.average_cadence ? "spm" : undefined}
        />
        <MetricCard label="Training load" value={activity.training_load ?? "—"} />
      </div>

      {/* Streams charts */}
      {streams && streams.time.length > 0 && (
        <div className="mb-6">
          <ActivityStreamsPanel streams={streams} useMetric={useMetric} />
        </div>
      )}

      {/* Weather */}
      {weather && (
        <div className="mb-6 rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Weather
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <WField
              label="Temp"
              value={
                weather.temperature_c !== null
                  ? useMetric
                    ? `${weather.temperature_c?.toFixed(0)}°C`
                    : `${cToF(weather.temperature_c)?.toFixed(0)}°F`
                  : "—"
              }
            />
            <WField
              label="Feels like"
              value={
                weather.feels_like_c !== null
                  ? useMetric
                    ? `${weather.feels_like_c?.toFixed(0)}°C`
                    : `${cToF(weather.feels_like_c)?.toFixed(0)}°F`
                  : "—"
              }
            />
            <WField label="Humidity" value={weather.humidity_pct != null ? `${weather.humidity_pct}%` : "—"} />
            <WField
              label="Wind"
              value={
                weather.wind_speed_kmh != null
                  ? useMetric
                    ? `${weather.wind_speed_kmh?.toFixed(0)} km/h ${weather.wind_direction}`
                    : `${kmhToMph(weather.wind_speed_kmh)?.toFixed(0)} mph ${weather.wind_direction}`
                  : "—"
              }
            />
            <WField label="Conditions" value={weather.conditions ?? "—"} />
          </div>
        </div>
      )}

      {/* Splits */}
      {splits.length > 0 && (
        <div className="mb-6 rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Splits ({splits.length} km)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 text-left font-semibold">#</th>
                  <th className="py-2 text-right font-semibold">Pace</th>
                  <th className="py-2 text-right font-semibold">HR</th>
                  <th className="py-2 text-right font-semibold">Elev ∆</th>
                </tr>
              </thead>
              <tbody>
                {splits.map((s) => {
                  const paceSec =
                    s.distance_meters && Number(s.distance_meters) > 0 && s.moving_time
                      ? s.moving_time / (Number(s.distance_meters) / 1000)
                      : null;
                  return (
                    <tr key={s.split_number} className="border-t">
                      <td className="py-2 font-mono tabular-nums">{s.split_number}</td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {paceFromSecondsPerKm(paceSec, useMetric ? "metric" : "imperial")}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {s.average_heartrate ? Math.round(s.average_heartrate) : "—"}
                      </td>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {s.elevation_difference
                          ? `${Number(s.elevation_difference) > 0 ? "+" : ""}${Math.round(Number(s.elevation_difference))}m`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Laps */}
      {laps.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Laps ({laps.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 text-left font-semibold">#</th>
                  <th className="py-2 text-right font-semibold">Distance</th>
                  <th className="py-2 text-right font-semibold">Time</th>
                  <th className="py-2 text-right font-semibold">Avg HR</th>
                  <th className="py-2 text-right font-semibold">Cadence</th>
                </tr>
              </thead>
              <tbody>
                {laps.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="py-2 font-mono tabular-nums">{l.lap_index}</td>
                    <td className="py-2 text-right font-mono tabular-nums">
                      {distanceFn(l.distance_meters, 2)} {unit}
                    </td>
                    <td className="py-2 text-right font-mono tabular-nums text-muted-foreground">
                      {secondsToDuration(l.moving_time)}
                    </td>
                    <td className="py-2 text-right font-mono tabular-nums">
                      {l.average_heartrate ? Math.round(l.average_heartrate) : "—"}
                    </td>
                    <td className="py-2 text-right font-mono tabular-nums">
                      {l.average_cadence ? Math.round(l.average_cadence * 2) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mb-6">
        <ActivityNoteForm activityId={activity.id} />
      </div>

      {notes.length > 0 && (
        <div className="mb-6 rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Notes
          </h2>
          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="rounded-md border p-3 text-sm">
                <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                  <span>
                    {n.created_at
                      ? new Date(n.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                  <span className="uppercase tracking-wider">
                    {n.sentiment ?? ""}
                    {n.perceived_effort ? ` · RPE ${n.perceived_effort}` : ""}
                  </span>
                </div>
                <div className="mt-1 whitespace-pre-wrap">{n.raw_text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!activity.detail_fetched && (
        <div className="mt-6 rounded-xl border border-dashed bg-muted/40 p-5 text-sm text-muted-foreground">
          Detailed splits, laps, and efforts have not been synced yet for this activity.
          Pass 2 of the Strava backfill runs in batches due to rate limits.
        </div>
      )}
    </AppShell>
  );
}

function MetricCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function WField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm tabular-nums">{value}</div>
    </div>
  );
}
