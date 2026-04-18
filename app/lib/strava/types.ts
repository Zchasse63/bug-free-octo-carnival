export type StravaTokenResponse = {
  token_type: "Bearer";
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
};

export type StravaSummaryActivity = {
  id: number;
  athlete: { id: number };
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  sport_type: string;
  type: string;
  workout_type: number | null;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  start_latlng: [number, number] | null;
  end_latlng: [number, number] | null;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: { id: string; summary_polyline: string };
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  gear_id: string | null;
  average_speed: number;
  max_speed: number;
  average_cadence?: number;
  average_watts?: number;
  max_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  has_heartrate: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number | null;
  upload_id?: number;
  external_id?: string;
  elev_high?: number;
  elev_low?: number;
  pr_count: number;
  visibility: string;
};

export type StravaDetailActivity = StravaSummaryActivity & {
  description: string | null;
  calories: number;
  device_name: string | null;
  embed_token: string | null;
  map: { id: string; polyline: string; summary_polyline: string };
  laps?: StravaLap[];
  splits_metric?: StravaSplit[];
  splits_standard?: StravaSplit[];
  best_efforts?: StravaBestEffort[];
  segment_efforts?: StravaSegmentEffort[];
  photos?: { primary: unknown; count: number };
};

export type StravaLap = {
  id: number;
  resource_state: number;
  name: string;
  activity: { id: number };
  athlete: { id: number };
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  start_index: number;
  end_index: number;
  total_elevation_gain: number;
  average_speed: number;
  max_speed: number;
  average_cadence?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  lap_index: number;
  split: number;
  pace_zone?: number;
};

export type StravaSplit = {
  distance: number;
  elapsed_time: number;
  elevation_difference: number;
  moving_time: number;
  split: number;
  average_speed: number;
  average_grade_adjusted_speed?: number;
  average_heartrate?: number;
  pace_zone: number;
};

export type StravaBestEffort = {
  id: number;
  resource_state: number;
  name: string;
  activity: { id: number };
  athlete: { id: number };
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  start_index: number;
  end_index: number;
  pr_rank: number | null;
};

export type StravaSegmentEffort = {
  id: number;
  resource_state: number;
  name: string;
  activity: { id: number };
  athlete: { id: number };
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  start_index: number;
  end_index: number;
  average_cadence?: number;
  average_watts?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  segment: { id: number; name: string };
  kom_rank: number | null;
  pr_rank: number | null;
};

export type StravaStream = {
  type: string;
  data: number[] | [number, number][];
  series_type: string;
  original_size: number;
  resolution: string;
};

export type StravaStreamSet = Record<string, StravaStream | undefined> & {
  time?: StravaStream;
  distance?: StravaStream;
  latlng?: StravaStream;
  altitude?: StravaStream;
  velocity_smooth?: StravaStream;
  heartrate?: StravaStream;
  cadence?: StravaStream;
  watts?: StravaStream;
  temp?: StravaStream;
  moving?: StravaStream;
  grade_smooth?: StravaStream;
};

export type StravaGear = {
  id: string;
  primary: boolean;
  name: string;
  resource_state: number;
  distance: number;
  brand_name?: string;
  model_name?: string;
  description?: string;
  frame_type?: number;
};

export type StravaRateLimit = {
  /** 15-min window usage */
  shortUsed: number;
  shortLimit: number;
  /** daily window usage */
  longUsed: number;
  longLimit: number;
};
