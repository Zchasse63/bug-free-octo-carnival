import type { Database, Json } from "@/lib/supabase/types";
import type {
  StravaBestEffort,
  StravaDetailActivity,
  StravaLap,
  StravaSegmentEffort,
  StravaSplit,
  StravaStreamSet,
  StravaSummaryActivity,
} from "@/lib/strava/types";

type ActivityRow = Database["public"]["Tables"]["activities"]["Insert"];
type LapRow = Database["public"]["Tables"]["activity_laps"]["Insert"];
type SplitRow = Database["public"]["Tables"]["activity_splits"]["Insert"];
type BestEffortRow = Database["public"]["Tables"]["best_efforts"]["Insert"];
type SegmentEffortRow = Database["public"]["Tables"]["segment_efforts"]["Insert"];
type StreamRow = Database["public"]["Tables"]["activity_streams"]["Insert"];
type GearRow = Database["public"]["Tables"]["gear"]["Insert"];

function coordToNumber(pair: [number, number] | null | undefined, idx: 0 | 1): number | null {
  if (!pair || pair.length < 2) return null;
  const v = pair[idx];
  return typeof v === "number" && !Number.isNaN(v) ? v : null;
}

export function summaryToActivityRow(
  s: StravaSummaryActivity,
  athleteId: number,
): ActivityRow {
  return {
    id: s.id,
    athlete_id: athleteId,
    upload_id: s.upload_id ?? null,
    external_id: s.external_id ?? null,
    data_source: "strava",
    name: s.name,
    sport_type: s.sport_type ?? s.type,
    workout_type: s.workout_type ?? null,
    start_date: s.start_date,
    start_date_local: s.start_date_local,
    timezone: s.timezone,
    moving_time: s.moving_time,
    elapsed_time: s.elapsed_time,
    distance_meters: s.distance,
    total_elevation_gain: s.total_elevation_gain ?? null,
    elev_high: s.elev_high ?? null,
    elev_low: s.elev_low ?? null,
    average_speed: s.average_speed ?? null,
    max_speed: s.max_speed ?? null,
    has_heartrate: s.has_heartrate,
    average_heartrate: s.average_heartrate ?? null,
    max_heartrate: s.max_heartrate ?? null,
    average_watts: s.average_watts ?? null,
    max_watts: s.max_watts ?? null,
    weighted_average_watts: s.weighted_average_watts ?? null,
    kilojoules: s.kilojoules ?? null,
    device_watts: s.device_watts ?? null,
    average_cadence: s.average_cadence ?? null,
    suffer_score: s.suffer_score ?? null,
    start_lat: coordToNumber(s.start_latlng, 0),
    start_lng: coordToNumber(s.start_latlng, 1),
    end_lat: coordToNumber(s.end_latlng, 0),
    end_lng: coordToNumber(s.end_latlng, 1),
    map_polyline_summary: s.map?.summary_polyline ?? null,
    gear_id: s.gear_id ?? null,
    kudos_count: s.kudos_count ?? 0,
    comment_count: s.comment_count ?? 0,
    achievement_count: s.achievement_count ?? 0,
    pr_count: s.pr_count ?? 0,
    trainer: s.trainer ?? false,
    commute: s.commute ?? false,
    manual: s.manual ?? false,
    flagged: s.flagged ?? false,
    visibility: s.visibility ?? "everyone",
    detail_fetched: false,
    streams_fetched: false,
    embedding_needs_update: true,
  };
}

export function detailToActivityUpdate(
  d: StravaDetailActivity,
): Database["public"]["Tables"]["activities"]["Update"] {
  return {
    description: d.description ?? null,
    calories: d.calories ?? null,
    device_name: d.device_name ?? null,
    map_polyline: d.map?.polyline ?? null,
    map_polyline_summary: d.map?.summary_polyline ?? null,
    detail_fetched: true,
    updated_at: new Date().toISOString(),
  };
}

export function lapsToRows(laps: StravaLap[], athleteId: number): LapRow[] {
  return laps.map((l) => ({
    id: l.id,
    activity_id: l.activity.id,
    athlete_id: athleteId,
    lap_index: l.lap_index,
    name: l.name,
    start_date: l.start_date,
    start_date_local: l.start_date_local,
    elapsed_time: l.elapsed_time,
    moving_time: l.moving_time,
    distance_meters: l.distance,
    average_speed: l.average_speed,
    max_speed: l.max_speed,
    average_cadence: l.average_cadence ?? null,
    average_heartrate: l.average_heartrate ?? null,
    max_heartrate: l.max_heartrate ?? null,
    total_elevation_gain: l.total_elevation_gain,
    pace_zone: l.pace_zone ?? null,
    start_index: l.start_index,
    end_index: l.end_index,
  }));
}

export function splitsToRows(
  splits: StravaSplit[],
  activityId: number,
  athleteId: number,
  unit: "metric" | "standard",
): SplitRow[] {
  return splits.map((s) => ({
    activity_id: activityId,
    athlete_id: athleteId,
    unit_system: unit,
    split_number: s.split,
    distance_meters: s.distance,
    elapsed_time: s.elapsed_time,
    moving_time: s.moving_time,
    elevation_difference: s.elevation_difference,
    average_speed: s.average_speed,
    average_grade_adjusted_speed: s.average_grade_adjusted_speed ?? null,
    average_heartrate: s.average_heartrate ?? null,
    pace_zone: s.pace_zone,
  }));
}

export function bestEffortsToRows(
  efforts: StravaBestEffort[],
  athleteId: number,
): BestEffortRow[] {
  return efforts.map((e) => ({
    id: e.id,
    activity_id: e.activity.id,
    athlete_id: athleteId,
    name: e.name,
    distance_meters: e.distance,
    elapsed_time: e.elapsed_time,
    moving_time: e.moving_time,
    start_date: e.start_date,
    start_date_local: e.start_date_local,
    start_index: e.start_index,
    end_index: e.end_index,
    pr_rank: e.pr_rank ?? null,
  }));
}

export function segmentEffortsToRows(
  efforts: StravaSegmentEffort[],
  athleteId: number,
): SegmentEffortRow[] {
  return efforts.map((e) => ({
    id: e.id,
    activity_id: e.activity.id,
    athlete_id: athleteId,
    segment_id: e.segment.id,
    segment_name: e.segment.name,
    elapsed_time: e.elapsed_time,
    moving_time: e.moving_time,
    distance_meters: e.distance,
    start_date: e.start_date,
    start_date_local: e.start_date_local,
    average_cadence: e.average_cadence ?? null,
    average_watts: e.average_watts ?? null,
    average_heartrate: e.average_heartrate ?? null,
    pr_rank: e.pr_rank ?? null,
    kom_rank: e.kom_rank ?? null,
    is_kom: e.kom_rank === 1,
    start_index: e.start_index,
    end_index: e.end_index,
  }));
}

export function streamsToRow(
  streams: StravaStreamSet,
  activityId: number,
  athleteId: number,
): StreamRow {
  const recorded = Object.keys(streams).filter((k) => streams[k]);
  const anyStream = Object.values(streams).find((s) => s);
  return {
    activity_id: activityId,
    athlete_id: athleteId,
    time_data: (streams.time?.data as Json) ?? null,
    distance_data: (streams.distance?.data as Json) ?? null,
    latlng_data: (streams.latlng?.data as Json) ?? null,
    altitude_data: (streams.altitude?.data as Json) ?? null,
    velocity_data: (streams.velocity_smooth?.data as Json) ?? null,
    heartrate_data: (streams.heartrate?.data as Json) ?? null,
    cadence_data: (streams.cadence?.data as Json) ?? null,
    watts_data: (streams.watts?.data as Json) ?? null,
    temp_data: (streams.temp?.data as Json) ?? null,
    moving_data: (streams.moving?.data as Json) ?? null,
    grade_data: (streams.grade_smooth?.data as Json) ?? null,
    point_count: anyStream?.original_size ?? null,
    resolution: anyStream?.resolution ?? null,
    recorded_streams: recorded,
  };
}

export function gearToRow(
  g: { id: string; name: string; primary?: boolean; distance?: number },
  athleteId: number,
  gear_type: "shoe" | "bike" | "other",
): GearRow {
  return {
    id: g.id,
    athlete_id: athleteId,
    name: g.name,
    gear_type,
    is_primary: g.primary ?? false,
    distance_meters: g.distance ?? null,
  };
}
