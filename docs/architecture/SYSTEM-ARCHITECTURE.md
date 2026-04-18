# AI Running Coach — System Architecture (v2)

> Rebuilt 2026-04-16 incorporating all scrutiny findings, approved features, coach/team features, and onboarding.
> **29 tables** — Original 16 (updated) + 13 new tables addressing all critical and high-priority gaps.

---

## Table of Contents

1. [Architecture Decisions](#architecture-decisions)
2. [Database Schema — All 35 Tables](#database-schema)
3. [Authentication & Roles](#authentication--roles)
4. [Background Processing Strategy](#background-processing-strategy)
5. [Strava Sync Strategy](#strava-sync-strategy)
6. [Embeddings Strategy (Updated)](#embeddings-strategy)
7. [AI Context Management](#ai-context-management)
8. [Data Flow](#data-flow)
9. [Phase Boundaries](#phase-boundaries)
10. [Migration Plan](#migration-plan)

---

## Architecture Decisions

### Three-Tier Data Design (unchanged)

1. **Tier 1 — Structured analytics**: Activities, laps, splits, efforts, gear. Fully normalized. SQL handles 95% of queries.
2. **Tier 2 — Raw time-series**: JSONB per activity for streams. One row per activity, not per data point.
3. **Tier 3 — AI layer**: Embeddings, computed summaries, insights, training plans, conversations.

### Key Changes from v1

| Issue | v1 | v2 |
|-------|----|----|
| Chat schema | Missing | `conversations` + `messages` tables |
| User feedback | Missing | `activity_notes` table |
| Weather data | Missing | `activity_weather` table |
| Context factors | Missing | `activity_context_factors` + `context_factor_definitions` |
| Coach/Team | Missing | `coaches`, `teams`, `team_members`, `team_messages` |
| Onboarding | Missing | `onboarding_responses` table |
| Response profiling | Missing | `athlete_response_profiles` table |
| Race predictions | Missing | `race_predictions` table |
| Workout classification | Missing | `workout_classification` column on activities |
| Background jobs | Unspecified | Supabase Edge Functions + pg_cron |
| Auth | Unspecified | Supabase Auth with roles (athlete/coach/admin) |
| Sync strategy | Unspecified | Three-pass, recent-first, resumable |
| Vector index | IVFFlat | HNSW (better for small-to-medium scale) |
| Embeddings | Metrics only | Includes user notes + contextual factors |

---

## Database Schema

### Group 1: Identity & Auth

#### Table 1: `athletes`

```sql
CREATE TABLE athletes (
  id                    bigint PRIMARY KEY,
  auth_user_id          uuid UNIQUE REFERENCES auth.users(id),  -- Supabase Auth link
  strava_id             bigint UNIQUE NOT NULL,
  username              text,
  firstname             text,
  lastname              text,
  profile_url           text,
  city                  text,
  state                 text,
  country               text,
  sex                   char(1),
  weight_kg             numeric(5,2),
  ftp                   integer,
  measurement_preference text DEFAULT 'meters',
  summit                boolean DEFAULT false,
  role                  text DEFAULT 'athlete' CHECK (role IN ('athlete', 'coach', 'admin')),
  -- OAuth tokens
  access_token          text NOT NULL,
  refresh_token         text NOT NULL,
  token_expires_at      timestamptz NOT NULL,
  token_scope           text,
  token_status          text DEFAULT 'valid' CHECK (token_status IN ('valid', 'expired', 'revoked', 'refresh_failed')),
  -- Sync state
  last_sync_at          timestamptz,
  sync_cursor_epoch     bigint,
  initial_sync_complete boolean DEFAULT false,
  -- Onboarding
  onboarding_complete   boolean DEFAULT false,
  -- Metadata
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);
```

#### Table 2: `gear`

```sql
CREATE TABLE gear (
  id                text PRIMARY KEY,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  name              text NOT NULL,
  brand_name        text,
  model_name        text,
  description       text,
  gear_type         text NOT NULL CHECK (gear_type IN ('shoe', 'bike', 'other')),
  is_primary        boolean DEFAULT false,
  retired           boolean DEFAULT false,
  distance_meters   numeric(12,2),
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_gear_athlete ON gear(athlete_id);
```

---

### Group 2: Activity Data (Core)

#### Table 3: `activities`

```sql
CREATE TABLE activities (
  id                        bigint PRIMARY KEY,
  athlete_id                bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  upload_id                 bigint,
  external_id               text,
  -- Classification
  name                      text NOT NULL,
  description               text,
  sport_type                text NOT NULL,
  workout_type              integer,
  workout_classification    text,  -- AI-tagged: 'easy','tempo','interval','long_run','race','recovery','fartlek','progression','cross_train','rest'
  is_race                   boolean GENERATED ALWAYS AS (workout_type = 1) STORED,
  -- Timing
  start_date                timestamptz NOT NULL,
  start_date_local          timestamptz NOT NULL,
  timezone                  text,
  moving_time               integer NOT NULL,
  elapsed_time              integer NOT NULL,
  -- Distance & Elevation
  distance_meters           numeric(10,2),
  total_elevation_gain      numeric(8,2),
  elev_high                 numeric(8,2),
  elev_low                  numeric(8,2),
  -- Speed
  average_speed             numeric(8,4),
  max_speed                 numeric(8,4),
  -- Heart Rate
  has_heartrate             boolean DEFAULT false,
  average_heartrate         numeric(5,1),
  max_heartrate             numeric(5,1),
  -- Power
  average_watts             numeric(8,2),
  max_watts                 integer,
  weighted_average_watts    integer,
  kilojoules                numeric(10,2),
  device_watts              boolean DEFAULT false,
  -- Cadence
  average_cadence           numeric(5,1),
  -- Effort
  suffer_score              integer,
  calories                  numeric(8,1),
  -- Location
  start_lat                 numeric(10,7),
  start_lng                 numeric(10,7),
  end_lat                   numeric(10,7),
  end_lng                   numeric(10,7),
  map_polyline              text,
  map_polyline_summary      text,
  -- Gear
  gear_id                   text REFERENCES gear(id),
  device_name               text,
  -- Social
  kudos_count               integer DEFAULT 0,
  comment_count             integer DEFAULT 0,
  achievement_count         integer DEFAULT 0,
  pr_count                  integer DEFAULT 0,
  -- Flags
  trainer                   boolean DEFAULT false,
  commute                   boolean DEFAULT false,
  manual                    boolean DEFAULT false,
  flagged                   boolean DEFAULT false,
  visibility                text DEFAULT 'everyone',
  -- Sync state
  detail_fetched            boolean DEFAULT false,
  streams_fetched           boolean DEFAULT false,
  -- AI computed
  training_load             numeric(8,2),
  intensity_factor          numeric(5,3),
  estimated_vdot            numeric(5,1),
  pace_per_km_seconds       integer GENERATED ALWAYS AS (
    CASE WHEN distance_meters > 0 AND moving_time > 0
    THEN ROUND((moving_time / (distance_meters / 1000.0)))::integer
    ELSE NULL END
  ) STORED,
  embedding_needs_update    boolean DEFAULT true,
  -- Timestamps
  created_at                timestamptz DEFAULT now(),
  updated_at                timestamptz DEFAULT now(),
  UNIQUE(athlete_id, id)
);

CREATE INDEX idx_activities_athlete_date ON activities(athlete_id, start_date DESC);
CREATE INDEX idx_activities_sport_type ON activities(athlete_id, sport_type, start_date DESC);
CREATE INDEX idx_activities_classification ON activities(athlete_id, workout_classification, start_date DESC);
CREATE INDEX idx_activities_detail_needed ON activities(athlete_id) WHERE detail_fetched = false;
CREATE INDEX idx_activities_streams_needed ON activities(athlete_id) WHERE streams_fetched = false;
CREATE INDEX idx_activities_embedding_needed ON activities(athlete_id) WHERE embedding_needs_update = true;
```

#### Table 4: `activity_laps`

```sql
CREATE TABLE activity_laps (
  id                bigint PRIMARY KEY,
  activity_id       bigint NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  lap_index         integer NOT NULL,
  name              text,
  start_date        timestamptz,
  start_date_local  timestamptz,
  elapsed_time      integer,
  moving_time       integer,
  distance_meters   numeric(10,2),
  average_speed     numeric(8,4),
  max_speed         numeric(8,4),
  average_cadence   numeric(5,1),
  average_heartrate numeric(5,1),
  max_heartrate     numeric(5,1),
  total_elevation_gain numeric(8,2),
  pace_zone         integer,
  start_index       integer,
  end_index         integer,
  created_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_laps_activity ON activity_laps(activity_id);
CREATE INDEX idx_laps_athlete ON activity_laps(athlete_id, start_date DESC);
```

#### Table 5: `activity_splits`

```sql
CREATE TABLE activity_splits (
  id                bigserial PRIMARY KEY,
  activity_id       bigint NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  unit_system       text NOT NULL CHECK (unit_system IN ('metric', 'standard')),
  split_number      integer NOT NULL,
  distance_meters   numeric(10,2),
  elapsed_time      integer,
  moving_time       integer,
  elevation_difference numeric(8,2),
  average_speed     numeric(8,4),
  average_grade_adjusted_speed numeric(8,4),
  average_heartrate numeric(5,1),
  pace_zone         integer,
  created_at        timestamptz DEFAULT now(),
  UNIQUE(activity_id, unit_system, split_number)
);
CREATE INDEX idx_splits_activity ON activity_splits(activity_id);
```

#### Table 6: `best_efforts`

```sql
CREATE TABLE best_efforts (
  id                bigint PRIMARY KEY,
  activity_id       bigint NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  name              text NOT NULL,
  distance_meters   numeric(10,2),
  elapsed_time      integer NOT NULL,
  moving_time       integer,
  start_date        timestamptz,
  start_date_local  timestamptz,
  start_index       integer,
  end_index         integer,
  pr_rank           integer,
  created_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_best_efforts_athlete_name ON best_efforts(athlete_id, name, elapsed_time ASC);
CREATE INDEX idx_best_efforts_activity ON best_efforts(activity_id);
CREATE INDEX idx_best_efforts_pr ON best_efforts(athlete_id, name, start_date DESC) WHERE pr_rank = 1;
```

#### Table 7: `segment_efforts`

```sql
CREATE TABLE segment_efforts (
  id                bigint PRIMARY KEY,
  activity_id       bigint NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  segment_id        bigint NOT NULL,
  segment_name      text,
  elapsed_time      integer NOT NULL,
  moving_time       integer,
  distance_meters   numeric(10,2),
  start_date        timestamptz,
  start_date_local  timestamptz,
  average_cadence   numeric(5,1),
  average_watts     numeric(8,2),
  average_heartrate numeric(5,1),
  max_heartrate     numeric(5,1),
  pr_rank           integer CHECK (pr_rank BETWEEN 1 AND 3),
  kom_rank          integer CHECK (kom_rank BETWEEN 1 AND 10),
  is_kom            boolean DEFAULT false,
  start_index       integer,
  end_index         integer,
  created_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_seg_efforts_athlete ON segment_efforts(athlete_id, segment_id, elapsed_time ASC);
CREATE INDEX idx_seg_efforts_activity ON segment_efforts(activity_id);
```

#### Table 8: `activity_streams`

```sql
CREATE TABLE activity_streams (
  activity_id       bigint PRIMARY KEY REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  time_data         jsonb,
  distance_data     jsonb,
  latlng_data       jsonb,
  altitude_data     jsonb,
  velocity_data     jsonb,
  heartrate_data    jsonb,
  cadence_data      jsonb,
  watts_data        jsonb,
  temp_data         jsonb,
  moving_data       jsonb,
  grade_data        jsonb,
  point_count       integer,
  resolution        text,
  recorded_streams  text[],
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_streams_athlete ON activity_streams(athlete_id);
```

---

### Group 3: Activity Context (NEW — Fixes CRITICAL-2)

#### Table 9: `activity_notes`

User's free-form post-run feedback. Raw text always preserved.

```sql
CREATE TABLE activity_notes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id       bigint NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  raw_text          text NOT NULL,
  voice_transcript  text,
  input_method      text DEFAULT 'text' CHECK (input_method IN ('text', 'voice')),
  -- AI parsed fields
  perceived_effort  numeric(3,1),  -- AI-estimated 1-10
  sentiment         text CHECK (sentiment IN ('positive', 'neutral', 'negative', 'mixed')),
  ai_parsed_tags    text[],
  key_factors       jsonb,   -- [{factor: "heavy legs", category: "fatigue"}, ...]
  -- Metadata
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_notes_activity ON activity_notes(activity_id);
CREATE INDEX idx_notes_athlete ON activity_notes(athlete_id, created_at DESC);
```

#### Table 10: `activity_weather`

Auto-fetched from weather API per activity.

```sql
CREATE TABLE activity_weather (
  activity_id       bigint PRIMARY KEY REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  temperature_c     numeric(5,1),    -- Celsius (convert to F in application layer per athlete preference)
  feels_like_c      numeric(5,1),
  humidity_pct      integer,
  dew_point_c       numeric(5,1),
  wind_speed_kmh    numeric(5,1),    -- km/h (convert to mph in application layer)
  wind_direction    text,
  precipitation     text,
  conditions        text,
  aqi               integer,
  uv_index          integer,
  weather_source    text DEFAULT 'open-meteo',
  fetched_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_weather_athlete ON activity_weather(athlete_id);
```

#### Table 11: `activity_context_factors`

Dynamic contextual factors parsed from notes by AI. The AI parsing pipeline MUST normalize factor_key values against `context_factor_definitions` before insert to prevent synonym drift (e.g., "ice_bath", "ice bath", "icebath" must all resolve to the canonical "ice_bath" key).

```sql
CREATE TABLE activity_context_factors (
  id                bigserial PRIMARY KEY,
  activity_id       bigint NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  category          text NOT NULL,
  factor_key        text NOT NULL REFERENCES context_factor_definitions(factor_key),
  factor_value      text,
  source            text NOT NULL CHECK (source IN ('user_note', 'auto_detected', 'weather_api')),
  confidence        numeric(3,2),
  raw_text_excerpt  text,
  created_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_context_activity ON activity_context_factors(activity_id);
CREATE INDEX idx_context_athlete_key ON activity_context_factors(athlete_id, factor_key);
```

#### Table 12: `context_factor_definitions`

Dictionary of all known factors (grows as users mention new things).

```sql
CREATE TABLE context_factor_definitions (
  factor_key        text PRIMARY KEY,
  category          text NOT NULL,
  display_name      text NOT NULL,
  description       text,
  data_type         text DEFAULT 'boolean',
  unit              text,
  is_builtin        boolean DEFAULT false,
  first_seen_at     timestamptz DEFAULT now(),
  usage_count       integer DEFAULT 1
);
```

---

### Group 4: Athlete Configuration

#### Table 13: `athlete_zones`

```sql
CREATE TABLE athlete_zones (
  id                bigserial PRIMARY KEY,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  effective_date    date NOT NULL,
  hr_zones          jsonb,
  power_zones       jsonb,
  custom_hr_zones   boolean DEFAULT false,
  ftp_at_time       integer,
  estimated_vdot    numeric(5,1),
  created_at        timestamptz DEFAULT now(),
  UNIQUE(athlete_id, effective_date)
);
CREATE INDEX idx_zones_athlete ON athlete_zones(athlete_id, effective_date DESC);
```

#### Table 14: `athlete_response_profiles`

Learned individual patterns (NEW — Feature #1).

```sql
CREATE TABLE athlete_response_profiles (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        bigint UNIQUE NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  -- Optimal training patterns (learned from data)
  optimal_quality_days_per_week integer,
  optimal_weekly_volume_km    numeric(8,1),
  recovery_rate_category      text, -- 'fast', 'moderate', 'slow'
  avg_recovery_hours_easy     integer,
  avg_recovery_hours_hard     integer,
  avg_recovery_hours_long     integer,
  -- Training response
  best_responding_workout_types text[], -- e.g., ['threshold', 'long_run']
  heat_tolerance              text, -- 'low', 'moderate', 'high'
  preferred_run_time_of_day   text,
  -- Injury patterns
  injury_risk_factors         jsonb,
  -- Raw analysis data
  analysis_data               jsonb,
  model_version               text,
  last_computed_at            timestamptz,
  created_at                  timestamptz DEFAULT now(),
  updated_at                  timestamptz DEFAULT now()
);
```

#### Table 15: `onboarding_responses`

Questionnaire answers for plan generation (NEW).

```sql
CREATE TABLE onboarding_responses (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  question_key      text NOT NULL,
  question_text     text NOT NULL,
  response_value    text NOT NULL,
  response_type     text DEFAULT 'text', -- 'text', 'choice', 'number', 'date'
  created_at        timestamptz DEFAULT now(),
  UNIQUE(athlete_id, question_key)
);
CREATE INDEX idx_onboarding_athlete ON onboarding_responses(athlete_id);
```

---

### Group 5: Computed Analytics

#### Table 16: `weekly_summaries`

```sql
CREATE TABLE weekly_summaries (
  id                bigserial PRIMARY KEY,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  week_start        date NOT NULL,
  week_number       integer,
  year              integer,
  -- Volume
  total_activities  integer DEFAULT 0,
  run_count         integer DEFAULT 0,
  run_distance_meters numeric(12,2) DEFAULT 0,
  run_moving_time   integer DEFAULT 0,
  run_elevation_gain numeric(10,2) DEFAULT 0,
  -- Cross-training
  hiit_count        integer DEFAULT 0,
  hiit_duration     integer DEFAULT 0,
  strength_count    integer DEFAULT 0,
  strength_duration integer DEFAULT 0,
  other_count       integer DEFAULT 0,
  other_duration    integer DEFAULT 0,
  -- Intensity (runs)
  avg_run_heartrate numeric(5,1),
  avg_run_pace_seconds_per_km integer,
  avg_suffer_score  numeric(5,1),
  total_suffer_score integer DEFAULT 0,
  total_training_load numeric(8,2) DEFAULT 0,
  -- Training distribution (NEW)
  workout_type_distribution jsonb,  -- {"easy": 3, "tempo": 1, "interval": 1, "long_run": 1}
  intensity_distribution    jsonb,  -- {"low": 0.75, "moderate": 0.10, "high": 0.15}
  hr_zone_distribution      jsonb,
  acwr                      numeric(4,2), -- Acute:Chronic Workload Ratio
  injury_risk_level         text,         -- 'low', 'moderate', 'high'
  -- Long run
  long_run_distance_meters numeric(12,2),
  long_run_date     date,
  -- AI
  ai_summary        text,
  computed_at       timestamptz DEFAULT now(),
  UNIQUE(athlete_id, week_start)
);
CREATE INDEX idx_weekly_athlete ON weekly_summaries(athlete_id, week_start DESC);
```

#### Table 17: `monthly_summaries`

```sql
CREATE TABLE monthly_summaries (
  id                bigserial PRIMARY KEY,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  year              integer NOT NULL,
  month             integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  total_activities  integer DEFAULT 0,
  run_count         integer DEFAULT 0,
  run_distance_meters numeric(12,2) DEFAULT 0,
  run_moving_time   integer DEFAULT 0,
  run_elevation_gain numeric(10,2) DEFAULT 0,
  avg_weekly_distance numeric(12,2),
  avg_suffer_score  numeric(5,1),
  total_training_load numeric(8,2) DEFAULT 0,
  fitness_score     numeric(6,2),  -- CTL (42-day EMA)
  fatigue_score     numeric(6,2),  -- ATL (7-day EMA)
  form_score        numeric(6,2),  -- TSB = fitness - fatigue
  estimated_vdot    numeric(5,1),
  pr_count          integer DEFAULT 0,
  ai_summary        text,
  computed_at       timestamptz DEFAULT now(),
  UNIQUE(athlete_id, year, month)
);
```

---

### Group 6: AI Layer

#### Table 18: `activity_embeddings`

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE activity_embeddings (
  activity_id       bigint PRIMARY KEY REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  summary_text      text NOT NULL,  -- includes metrics + user notes + weather + context
  embedding         vector(1536),
  embedding_model   text NOT NULL DEFAULT 'text-embedding-3-small',
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_embeddings_vector ON activity_embeddings
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_embeddings_athlete ON activity_embeddings(athlete_id);
```

#### Table 19: `ai_insights`

```sql
CREATE TABLE ai_insights (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  insight_type      text NOT NULL,  -- 'weekly_analysis','post_run','trend','warning','achievement','recommendation'
  trigger           text NOT NULL,  -- 'post_sync','scheduled_weekly','scheduled_monthly','on_demand'
  scope             text NOT NULL,
  scope_ref_id      text,
  activity_id       bigint REFERENCES activities(id) ON DELETE CASCADE,
  title             text NOT NULL,
  body              text NOT NULL,
  severity          text,
  tags              text[],
  model_used        text,
  prompt_version    text,
  generated_at      timestamptz DEFAULT now(),
  dismissed_at      timestamptz,
  bookmarked        boolean DEFAULT false,
  created_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_insights_athlete ON ai_insights(athlete_id, insight_type, generated_at DESC);
CREATE INDEX idx_insights_activity ON ai_insights(activity_id) WHERE activity_id IS NOT NULL;
```

#### Table 20: `race_predictions`

```sql
CREATE TABLE race_predictions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  race_name         text,
  race_date         date,
  race_distance_meters numeric(12,2) NOT NULL,
  -- Course
  course_profile    jsonb,          -- elevation data if available
  course_source     text,           -- 'findmymarathon', 'gpx_upload', 'manual', 'flat_estimate'
  -- Conditions
  predicted_temp_f  numeric(5,1),
  predicted_humidity integer,
  -- Prediction
  predicted_time_seconds integer NOT NULL,
  pace_strategy     jsonb,          -- per-mile/km split recommendations
  confidence_range  jsonb,          -- {optimistic: 12300, realistic: 12600, conservative: 12900}
  -- Inputs used
  current_vdot      numeric(5,1),
  current_ctl       numeric(6,2),
  current_tsb       numeric(6,2),
  shoe_recommendation text,
  training_plan_id  uuid REFERENCES training_plans(id),  -- link prediction to the plan targeting this race
  -- AI analysis
  analysis_text     text,
  model_used        text,
  created_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_predictions_athlete ON race_predictions(athlete_id, race_date DESC);
```

---

### Group 7: Training Plans

#### Table 21: `training_plans`

```sql
CREATE TABLE training_plans (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  name              text NOT NULL,
  goal              text,
  goal_race_date    date,
  goal_race_distance text,
  goal_time_seconds integer,
  status            text DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'abandoned')),
  plan_type         text,           -- 'base_building','5k','10k','half_marathon','marathon','maintenance'
  start_date        date NOT NULL,
  end_date          date,
  current_phase     text,           -- 'base','build','peak','taper'
  plan_config       jsonb NOT NULL, -- weekly structure, target mileage ramp, quality day config
  generated_by      text DEFAULT 'claude',
  model_version     text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_plans_athlete ON training_plans(athlete_id, start_date DESC);
```

#### Table 22: `planned_workouts`

```sql
CREATE TABLE planned_workouts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id           uuid NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  planned_date      date NOT NULL,
  day_of_week       integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  workout_type      text NOT NULL,
  title             text NOT NULL,
  description       text,
  structure         jsonb,    -- [{type:'warmup', distance:1600, pace:'easy'}, {type:'interval', reps:8, distance:400, rest:50}, ...]
  target_distance_meters numeric(10,2),
  target_duration   integer,
  target_pace_range jsonb,
  -- Execution tracking
  status            text DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'skipped', 'modified')),
  actual_activity_id bigint REFERENCES activities(id),
  deviation_notes   text,
  ai_adjustment_reason text,  -- why the AI changed this from original plan
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_planned_athlete_date ON planned_workouts(athlete_id, planned_date);
CREATE INDEX idx_planned_plan ON planned_workouts(plan_id, planned_date);
```

---

### Group 8: Conversations (NEW — Fixes CRITICAL-1)

#### Table 23: `conversations`

```sql
CREATE TABLE conversations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  title             text,
  conversation_type text DEFAULT 'coaching' CHECK (conversation_type IN ('coaching', 'onboarding', 'workout_builder', 'race_planning')),
  is_active         boolean DEFAULT true,
  message_count     integer DEFAULT 0,
  last_message_at   timestamptz,
  context_snapshot  jsonb,  -- cached context for this conversation (athlete profile, recent data)
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_conversations_athlete ON conversations(athlete_id, last_message_at DESC);
```

#### Table 24: `messages`

```sql
CREATE TABLE messages (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  role              text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content           text NOT NULL,
  message_type      text DEFAULT 'text' CHECK (message_type IN ('text', 'voice_transcript', 'proactive', 'post_run_analysis', 'weekly_report', 'system')),
  -- References
  activity_id       bigint REFERENCES activities(id),
  insight_id        uuid REFERENCES ai_insights(id),
  planned_workout_id uuid REFERENCES planned_workouts(id),
  -- Voice
  voice_audio_url   text,
  -- AI metadata
  model_used        text,
  prompt_tokens     integer,
  completion_tokens integer,
  tool_calls        jsonb,   -- what tools the AI used to answer
  -- Metadata
  created_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_athlete ON messages(athlete_id, created_at DESC);
CREATE INDEX idx_messages_activity ON messages(activity_id) WHERE activity_id IS NOT NULL;
```

---

### Group 9: Coach & Teams (NEW)

#### Table 25: `coach_athletes`

Links coaches to their athletes.

```sql
CREATE TABLE coach_athletes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id          bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  status            text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  permissions       jsonb DEFAULT '{"view_activities": true, "view_notes": false, "view_streams": false, "modify_plan": false}',
  invited_at        timestamptz DEFAULT now(),
  accepted_at       timestamptz,
  created_at        timestamptz DEFAULT now(),
  UNIQUE(coach_id, athlete_id)
);
CREATE INDEX idx_coach_athletes_coach ON coach_athletes(coach_id, status);
CREATE INDEX idx_coach_athletes_athlete ON coach_athletes(athlete_id);
```

#### Table 26: `teams`

```sql
CREATE TABLE teams (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  description       text,
  owner_id          bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  invite_code       text UNIQUE,
  is_public         boolean DEFAULT false,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_teams_owner ON teams(owner_id);
```

#### Table 27: `team_members`

```sql
CREATE TABLE team_members (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id           uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  role              text DEFAULT 'member' CHECK (role IN ('owner', 'coach', 'member')),
  joined_at         timestamptz DEFAULT now(),
  UNIQUE(team_id, athlete_id)
);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_athlete ON team_members(athlete_id);
```

#### Table 28: `team_messages`

Private team feed/chat.

```sql
CREATE TABLE team_messages (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id           uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  author_id         bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  content           text NOT NULL,
  message_type      text DEFAULT 'text' CHECK (message_type IN ('text', 'activity_share', 'achievement', 'system')),
  activity_id       bigint REFERENCES activities(id),
  created_at        timestamptz DEFAULT now()
);
CREATE INDEX idx_team_messages_team ON team_messages(team_id, created_at DESC);
```

---

### Group 10: Operations

#### Table 29: `sync_log`

```sql
CREATE TABLE sync_log (
  id                bigserial PRIMARY KEY,
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  sync_type         text NOT NULL,
  status            text NOT NULL,
  activities_synced integer DEFAULT 0,
  activities_failed integer DEFAULT 0,
  error_message     text,
  rate_limit_hit    boolean DEFAULT false,
  strava_rate_remaining jsonb,
  started_at        timestamptz DEFAULT now(),
  completed_at      timestamptz
);
CREATE INDEX idx_sync_athlete ON sync_log(athlete_id, started_at DESC);
```

---

### Table Count Summary

| Group | Tables | Purpose |
|-------|--------|---------|
| Identity & Auth | 2 | athletes, gear |
| Activity Data | 6 | activities, laps, splits, best_efforts, segment_efforts, streams |
| Activity Context | 4 | notes, weather, context_factors, factor_definitions |
| Athlete Config | 3 | zones, response_profiles, onboarding_responses |
| Computed Analytics | 2 | weekly_summaries, monthly_summaries |
| AI Layer | 3 | embeddings, insights, race_predictions |
| Training Plans | 2 | training_plans, planned_workouts |
| Conversations | 2 | conversations, messages |
| Coach & Teams | 4 | coach_athletes, teams, team_members, team_messages |
| Operations | 1 | sync_log |
| **Total** | **29** | |

---

## Authentication & Roles

### Strategy: Supabase Auth + Role-Based RLS

```
User signs up → Supabase Auth creates auth.users row
             → Links to athletes.auth_user_id
             → athletes.role determines permissions
```

**Roles:**
- `athlete` — Can see own data, interact with own coach
- `coach` — Can see linked athletes' data (based on coach_athletes permissions)
- `admin` — Full access (future)

**RLS Policies (examples):**
```sql
-- Athletes see own data
CREATE POLICY athletes_own_data ON activities
  FOR ALL USING (athlete_id IN (
    SELECT id FROM athletes WHERE auth_user_id = auth.uid()
  ));

-- Coaches see linked athletes' data
CREATE POLICY coach_view_athletes ON activities
  FOR SELECT USING (athlete_id IN (
    SELECT athlete_id FROM coach_athletes
    WHERE coach_id IN (SELECT id FROM athletes WHERE auth_user_id = auth.uid())
    AND status = 'active'
  ));
```

**Phase 1 (personal use):** Create a single Supabase Auth user. Link to athletes row. All API routes use this auth. Service role key stays server-side only.

---

## Background Processing Strategy

### Decision: Supabase Edge Functions + pg_cron

| Job | Trigger | Runs Where |
|-----|---------|------------|
| Token refresh | Before each Strava API call | Edge Function |
| Activity sync (manual) | CLI script / API call | Node.js script (Phase 1) → Edge Function (Phase 2) |
| Activity sync (webhook) | Strava webhook POST | Edge Function (Phase 2+) |
| Detail fetch queue | After activity list sync | Edge Function, processes batch |
| Stream fetch queue | After detail fetch | Edge Function, processes batch |
| Weather enrichment | After new activity detail fetched | Edge Function |
| Embedding generation | When activities.embedding_needs_update = true | Edge Function |
| Weekly summary compute | pg_cron: Sunday 11pm UTC | Edge Function invoked by pg_cron via pg_net |
| Monthly summary compute | pg_cron: 1st of month, midnight UTC | Edge Function |
| Post-run analysis | After new activity fully synced | Edge Function |
| Workout classification | After activity detail fetched | Edge Function (bundled with post-run) |
| VDOT recalculation | After new best_effort or race result | Edge Function |
| Response profile update | pg_cron: Monthly | Edge Function |

**Phase 1:** Most jobs run as CLI scripts you trigger manually. The schema is ready for automation.

**Phase 2+:** Edge Functions with pg_cron for scheduled tasks. Strava webhooks received by an Edge Function.

---

## Strava Sync Strategy

### Three-Pass, Recent-First, Resumable

**Pass 1 — Activity Summaries** (~5 API calls for 1000 activities)
```
GET /athlete/activities?per_page=200&page=1
GET /athlete/activities?per_page=200&page=2
...until empty page
```
- Store as SummaryActivity → `activities` table with `detail_fetched=false`
- ~5 calls for 1000 activities (200 per page)
- Update `athletes.sync_cursor_epoch` after each page

**Pass 2 — Activity Details** (1 call per activity)
```
GET /activities/{id}?include_all_efforts=true
```
- Priority: most recent first (ORDER BY start_date DESC WHERE detail_fetched = false)
- Inserts: laps, splits, best_efforts, segment_efforts
- Updates: activities with full detail fields, `detail_fetched=true`
- Rate limit: 100 read/15min. Process ~95 activities per 15-min window (leave buffer).
- ~1000 activities = ~160 minutes = ~2.7 hours

**Pass 3 — Streams** (1 call per activity, can defer)
```
GET /activities/{id}/streams?keys=time,distance,latlng,altitude,heartrate,cadence,watts,temp,velocity_smooth,grade_smooth,moving&key_by_type=true
```
- Priority: most recent first
- Same rate limit math as Pass 2
- Can be deferred — streams aren't needed for coaching in Phase 1

**Rate Limit Handling:**
- Check `X-RateLimit-Usage` header on every response
- If 15-min usage > 90: pause until next 15-min window
- If daily usage > 900: stop for the day, resume tomorrow
- All progress is saved via `detail_fetched`/`streams_fetched` flags — fully resumable

**Incremental Sync (after initial backfill):**
```
GET /athlete/activities?after={sync_cursor_epoch}&per_page=200
```
- Only fetches new activities since last sync
- Typically 1-5 activities = 1 API call + 1-5 detail calls + 1-5 stream calls

---

## Embeddings Strategy

### Updated: Include User Notes + Weather + Context

**Summary template:**
```
{day_of_week} {time_of_day} {sport_type}, {city} {state}.
{distance} {pace_descriptor} ({pace}/km), {duration} moving time.
Avg HR {hr} bpm ({zone}), cadence {cadence} spm{power_if_available}.
{elevation_descriptor}. {weather_if_available}.
{workout_structure_if_applicable}.
{user_notes_if_available}.
Training load: {load}. {plan_context_if_available}.
```

**Example with notes:**
```
Tuesday morning track workout, Tampa FL.
6.9km at mixed paces, 28:51 moving time.
Avg HR 172 bpm (zone 4), cadence 174 spm, avg power 395W.
Flat, 10 laps alternating fast (5:50/mi) and recovery (9:00/mi).
82°F, 75% humidity. Wore Saucony Endorphin Pros.
User notes: "Legs felt heavy from HIIT yesterday. Last two reps struggled with form."
Training load: 82. Week 5 of base building.
```

**When to re-embed:**
- `activities.embedding_needs_update` flag set to `true` when:
  - Activity detail first fetched
  - User adds/edits a note
  - Weather data fetched
  - Context factors parsed
- Background job processes all `embedding_needs_update = true` activities

**Vector Index: HNSW**
```sql
CREATE INDEX idx_embeddings_vector ON activity_embeddings
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
```
- HNSW works at any scale (no pre-training needed unlike IVFFlat)
- Better recall at small dataset sizes (< 10K vectors)

---

## AI Context Management

### Condensed System Prompt (~2500 tokens)

The full COACH-PERSONALITY.md (783 lines) is a reference doc. For runtime, a condensed version:
- Core identity and personality (3-4 sentences)
- Key coaching principles (the 6 universal truths)
- Tone rules (brief list)
- Anti-patterns (brief list)
- Words to avoid (brief list)
- Current athlete context (injected dynamically)

### Conversation History Windowing

- Include last **20 messages** in full
- For older messages: generate a summary (stored on conversation.context_snapshot)
- Re-summarize every 50 messages

### Per-Interaction Token Budget (~9500 tokens input)

| Layer | Tokens | Source |
|-------|--------|--------|
| System prompt (condensed personality) | ~2500 | Static |
| Athlete profile + current fitness | ~500 | SQL query |
| Recent context (4 weeks + last 7 activities) | ~1500 | SQL query |
| Historical summaries (12 months) | ~1000 | SQL query |
| Semantic retrieval (if needed) | ~2000 | Vector search |
| Conversation history (last 20 messages) | ~2000 | From messages table |
| **Total input** | **~9500** | |
| Output budget | ~1500 | |
| **Total per interaction** | **~11000** | |

**Estimated cost:** ~$0.05-0.08 per interaction. ~$25-40/month at 10-15 interactions/day.

---

## Data Flow

```
STRAVA API
    │
    ├── [Token refresh] POST /oauth/token (auto, before each call)
    │
    ├── [Sync] GET /athlete/activities → activities table
    ├── [Detail] GET /activities/{id} → laps, splits, efforts, best_efforts
    ├── [Streams] GET /activities/{id}/streams → activity_streams
    │
    v
SUPABASE POSTGRES (29 tables)
    │
    ├── [Weather] Open-Meteo API → activity_weather
    ├── [Classify] AI → activities.workout_classification
    ├── [Embed] AI → activity_embeddings (summary + notes + weather)
    ├── [Compute] SQL → weekly_summaries, monthly_summaries
    ├── [VDOT] Compute from best_efforts → athlete_zones
    ├── [Post-run] AI → ai_insights (trigger: post_sync)
    ├── [Weekly] AI → ai_insights (trigger: scheduled_weekly)
    │
    v
NEXT.JS APP
    │
    ├── [Chat] ← Claude API with tool-calling
    │   ├── Tools: query_weekly_summary, query_best_efforts,
    │   │   query_similar_activities, query_activity_detail,
    │   │   query_training_load, create_workout
    │   └── Context: 5-layer composition
    │
    ├── [Dashboard] ← Supabase queries
    ├── [Training Plan] ← training_plans + planned_workouts
    ├── [Activity Detail] ← activities + laps + splits + streams
    │
    v
USER (athlete, coach, or team member)
```

---

## Phase Boundaries

### Phase 1: Personal Foundation (4-6 weeks)
- Database: Deploy all 29 tables
- Strava sync: Manual CLI script (Pass 1 + 2, defer streams)
- AI: Weekly summaries, embeddings, VDOT estimation, workout classification
- Chat: Text-only, Claude with tool-calling, persistent history
- Post-run analysis (after manual sync)
- Weather enrichment (Open-Meteo)
- Basic auth (single Supabase Auth user)
- **Cut:** Voice, proactive messages, webhooks, dashboard, live run, training plan UI, coach portal, teams

### Phase 2: Web App (6-8 weeks)
- Full Next.js app with 4-tab layout (Coach, Dashboard, Plan, Run placeholder)
- Auto-sync via Strava webhooks
- Adaptive training plan generation
- Onboarding questionnaire
- Goal reverse-engineering
- Dynamic VDOT recalculation
- Injury risk scoring (ACWR)
- Activity context factors + smart post-run prompts
- Fatigue fingerprint detection
- Time machine (historical comparison)
- Personal response profiling (initial version)

### Phase 3: Social & Advanced (8-12 weeks)
- Coach portal + coach-athlete linking
- Teams + team chat
- Workout builder (NL → structured workout)
- Race day simulator
- Route intelligence
- Training block templates
- Peer comparison (anonymized)
- Breathing coach integration (soft)
- Voice input (Web Speech API)
- Watch export research (Garmin API first)

### Phase 4: Native & Scale
- Native iOS app (voice-first, Apple Speech)
- Apple Watch companion app (WorkoutKit)
- Garmin Connect IQ integration
- Multi-user public launch
- Subscription billing

---

## Migration Plan

**Execution order (dependency-safe):**

```
Migration 001: Extensions (pgvector)
Migration 002: athletes
Migration 003: gear
Migration 004: activities (references athletes, gear)
Migration 005: activity_laps, activity_splits (reference activities)
Migration 006: best_efforts, segment_efforts (reference activities)
Migration 007: activity_streams (references activities)
Migration 008: activity_notes (references activities)
Migration 009: activity_weather (references activities)
Migration 010: activity_context_factors + context_factor_definitions (references activities)
Migration 011: athlete_zones, athlete_response_profiles (reference athletes)
Migration 012: onboarding_responses (references athletes)
Migration 013: weekly_summaries, monthly_summaries (reference athletes)
Migration 014: activity_embeddings (references activities, requires pgvector)
Migration 015: ai_insights (references activities, athletes)
Migration 016: race_predictions (references athletes)
Migration 017: training_plans (references athletes)
Migration 018: planned_workouts (references training_plans, activities)
Migration 019: conversations + messages (references athletes, activities, insights, planned_workouts)
Migration 020: coach_athletes (references athletes)
Migration 021: teams, team_members, team_messages (references athletes, activities)
Migration 022: sync_log (references athletes)
Migration 023: RLS policies (all tables)
Migration 024: Seed builtin context_factor_definitions
```

### Phase 1: Active vs Dormant Tables

Not all 29 tables have active Phase 1 logic. Tables are deployed in Phase 1 for schema stability but only populated/used as noted:

| Table | Phase 1 Status | Notes |
|-------|---------------|-------|
| athletes | **Active** | Populated on setup |
| gear | **Active** | Populated from Strava sync |
| activities | **Active** | Core data from sync |
| activity_laps | **Active** | From detail fetch |
| activity_splits | **Active** | From detail fetch |
| best_efforts | **Active** | From detail fetch |
| segment_efforts | **Active** | From detail fetch |
| activity_streams | **Deferred** | Streams fetch is Pass 3, not needed for Phase 1 coaching |
| activity_notes | **Active** | User feedback via chat |
| activity_weather | **Active** | Auto-fetched after sync (including historical backfill via Open-Meteo) |
| activity_context_factors | Dormant | Activated Phase 2 (requires AI parsing pipeline) |
| context_factor_definitions | **Active** | Seeded with builtins at deploy |
| athlete_zones | **Active** | From Strava zones endpoint |
| athlete_response_profiles | Dormant | Activated Phase 2 (needs data accumulation) |
| onboarding_responses | Dormant | Activated Phase 2 (onboarding flow) |
| weekly_summaries | **Active** | Computed after sync |
| monthly_summaries | **Active** | Computed after sync |
| activity_embeddings | **Active** | Generated after sync |
| ai_insights | **Active** | Post-run analysis + weekly reports |
| race_predictions | Dormant | Activated Phase 2 |
| training_plans | Dormant | Activated Phase 2 |
| planned_workouts | Dormant | Activated Phase 2 |
| conversations | **Active** | Chat is the primary UI |
| messages | **Active** | Chat history |
| coach_athletes | Dormant | Activated Phase 3 |
| teams | Dormant | Activated Phase 3 |
| team_members | Dormant | Activated Phase 3 |
| team_messages | Dormant | Activated Phase 3 |
| sync_log | **Active** | Logging from day one |

**Phase 1 active: 19 tables. Dormant: 10 tables.**

---

## RLS Policies (Complete)

All tables use `athlete_id` for row-level security. Service role (background jobs) bypasses RLS.

### Visibility Rules

- **Individual coaching conversations** (`conversations`, `messages`): Private to the athlete. Coaches do NOT see these.
- **Team chat** (`team_messages`): Visible to all team members including coaches. This is a public team board.
- **Activity data**: Visible to the athlete. Coaches with active `coach_athletes` relationship can view (based on permissions JSONB).
- **Notes and context factors**: Private to the athlete by default. Coach access controlled by `coach_athletes.permissions.view_notes`.

### Helper Function

```sql
-- Returns the athlete_id for the current authenticated user
CREATE OR REPLACE FUNCTION auth_athlete_id()
RETURNS bigint AS $$
  SELECT id FROM athletes WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Returns athlete_ids this user can view (own + coached athletes)
CREATE OR REPLACE FUNCTION viewable_athlete_ids()
RETURNS SETOF bigint AS $$
  SELECT auth_athlete_id()
  UNION
  SELECT athlete_id FROM coach_athletes
  WHERE coach_id = auth_athlete_id() AND status = 'active'
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### Policies by Table

```sql
-- ========== IDENTITY & AUTH ==========

-- athletes: see own row + coached athletes (read-only for coach)
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
CREATE POLICY athletes_select ON athletes FOR SELECT
  USING (id IN (SELECT viewable_athlete_ids()));
CREATE POLICY athletes_update ON athletes FOR UPDATE
  USING (id = auth_athlete_id());

-- gear: see own + coached athletes' gear
ALTER TABLE gear ENABLE ROW LEVEL SECURITY;
CREATE POLICY gear_select ON gear FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY gear_modify ON gear FOR ALL
  USING (athlete_id = auth_athlete_id());

-- ========== ACTIVITY DATA ==========

-- activities: see own + coached athletes' activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY activities_select ON activities FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY activities_modify ON activities FOR ALL
  USING (athlete_id = auth_athlete_id());

-- activity_laps: same as activities
ALTER TABLE activity_laps ENABLE ROW LEVEL SECURITY;
CREATE POLICY laps_select ON activity_laps FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY laps_modify ON activity_laps FOR ALL
  USING (athlete_id = auth_athlete_id());

-- activity_splits: same as activities
ALTER TABLE activity_splits ENABLE ROW LEVEL SECURITY;
CREATE POLICY splits_select ON activity_splits FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY splits_modify ON activity_splits FOR ALL
  USING (athlete_id = auth_athlete_id());

-- best_efforts: same as activities
ALTER TABLE best_efforts ENABLE ROW LEVEL SECURITY;
CREATE POLICY efforts_select ON best_efforts FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY efforts_modify ON best_efforts FOR ALL
  USING (athlete_id = auth_athlete_id());

-- segment_efforts: same as activities
ALTER TABLE segment_efforts ENABLE ROW LEVEL SECURITY;
CREATE POLICY seg_efforts_select ON segment_efforts FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY seg_efforts_modify ON segment_efforts FOR ALL
  USING (athlete_id = auth_athlete_id());

-- activity_streams: same as activities (coach can view if permissions allow)
ALTER TABLE activity_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY streams_select ON activity_streams FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY streams_modify ON activity_streams FOR ALL
  USING (athlete_id = auth_athlete_id());

-- ========== ACTIVITY CONTEXT ==========

-- activity_notes: own only by default; coach sees if permissions.view_notes = true
ALTER TABLE activity_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY notes_select ON activity_notes FOR SELECT
  USING (
    athlete_id = auth_athlete_id()
    OR athlete_id IN (
      SELECT athlete_id FROM coach_athletes
      WHERE coach_id = auth_athlete_id()
      AND status = 'active'
      AND (permissions->>'view_notes')::boolean = true
    )
  );
CREATE POLICY notes_modify ON activity_notes FOR ALL
  USING (athlete_id = auth_athlete_id());

-- activity_weather: same as activities
ALTER TABLE activity_weather ENABLE ROW LEVEL SECURITY;
CREATE POLICY weather_select ON activity_weather FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY weather_modify ON activity_weather FOR ALL
  USING (athlete_id = auth_athlete_id());

-- activity_context_factors: same as notes (private, coach needs permission)
ALTER TABLE activity_context_factors ENABLE ROW LEVEL SECURITY;
CREATE POLICY context_select ON activity_context_factors FOR SELECT
  USING (
    athlete_id = auth_athlete_id()
    OR athlete_id IN (
      SELECT athlete_id FROM coach_athletes
      WHERE coach_id = auth_athlete_id()
      AND status = 'active'
      AND (permissions->>'view_notes')::boolean = true
    )
  );
CREATE POLICY context_modify ON activity_context_factors FOR ALL
  USING (athlete_id = auth_athlete_id());

-- context_factor_definitions: readable by all authenticated users (shared dictionary)
ALTER TABLE context_factor_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY factor_defs_select ON context_factor_definitions FOR SELECT
  USING (true);
CREATE POLICY factor_defs_insert ON context_factor_definitions FOR INSERT
  WITH CHECK (true);

-- ========== ATHLETE CONFIG ==========

-- athlete_zones: same as activities
ALTER TABLE athlete_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY zones_select ON athlete_zones FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY zones_modify ON athlete_zones FOR ALL
  USING (athlete_id = auth_athlete_id());

-- athlete_response_profiles: own only (coaches don't need raw profile)
ALTER TABLE athlete_response_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY response_select ON athlete_response_profiles FOR SELECT
  USING (athlete_id = auth_athlete_id());
CREATE POLICY response_modify ON athlete_response_profiles FOR ALL
  USING (athlete_id = auth_athlete_id());

-- onboarding_responses: own only
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY onboarding_select ON onboarding_responses FOR SELECT
  USING (athlete_id = auth_athlete_id());
CREATE POLICY onboarding_modify ON onboarding_responses FOR ALL
  USING (athlete_id = auth_athlete_id());

-- ========== COMPUTED ANALYTICS ==========

-- weekly_summaries: same as activities
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY weekly_select ON weekly_summaries FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY weekly_modify ON weekly_summaries FOR ALL
  USING (athlete_id = auth_athlete_id());

-- monthly_summaries: same as activities
ALTER TABLE monthly_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY monthly_select ON monthly_summaries FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY monthly_modify ON monthly_summaries FOR ALL
  USING (athlete_id = auth_athlete_id());

-- ========== AI LAYER ==========

-- activity_embeddings: own only (internal AI data)
ALTER TABLE activity_embeddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY embeddings_select ON activity_embeddings FOR SELECT
  USING (athlete_id = auth_athlete_id());
CREATE POLICY embeddings_modify ON activity_embeddings FOR ALL
  USING (athlete_id = auth_athlete_id());

-- ai_insights: own only
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY insights_select ON ai_insights FOR SELECT
  USING (athlete_id = auth_athlete_id());
CREATE POLICY insights_modify ON ai_insights FOR ALL
  USING (athlete_id = auth_athlete_id());

-- race_predictions: own only
ALTER TABLE race_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY predictions_select ON race_predictions FOR SELECT
  USING (athlete_id = auth_athlete_id());
CREATE POLICY predictions_modify ON race_predictions FOR ALL
  USING (athlete_id = auth_athlete_id());

-- ========== TRAINING PLANS ==========

-- training_plans: own + coach can view/modify if permissions.modify_plan = true
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY plans_select ON training_plans FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY plans_modify ON training_plans FOR ALL
  USING (
    athlete_id = auth_athlete_id()
    OR athlete_id IN (
      SELECT athlete_id FROM coach_athletes
      WHERE coach_id = auth_athlete_id()
      AND status = 'active'
      AND (permissions->>'modify_plan')::boolean = true
    )
  );

-- planned_workouts: same as training_plans
ALTER TABLE planned_workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY planned_select ON planned_workouts FOR SELECT
  USING (athlete_id IN (SELECT viewable_athlete_ids()));
CREATE POLICY planned_modify ON planned_workouts FOR ALL
  USING (
    athlete_id = auth_athlete_id()
    OR athlete_id IN (
      SELECT athlete_id FROM coach_athletes
      WHERE coach_id = auth_athlete_id()
      AND status = 'active'
      AND (permissions->>'modify_plan')::boolean = true
    )
  );

-- ========== CONVERSATIONS (PRIVATE TO ATHLETE) ==========

-- conversations: own only. Coaches NEVER see individual AI coaching chats.
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY convo_select ON conversations FOR SELECT
  USING (athlete_id = auth_athlete_id());
CREATE POLICY convo_modify ON conversations FOR ALL
  USING (athlete_id = auth_athlete_id());

-- messages: own only
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY messages_select ON messages FOR SELECT
  USING (athlete_id = auth_athlete_id());
CREATE POLICY messages_modify ON messages FOR ALL
  USING (athlete_id = auth_athlete_id());

-- ========== COACH & TEAMS ==========

-- coach_athletes: coach sees their relationships, athlete sees their coaches
ALTER TABLE coach_athletes ENABLE ROW LEVEL SECURITY;
CREATE POLICY coach_rel_select ON coach_athletes FOR SELECT
  USING (coach_id = auth_athlete_id() OR athlete_id = auth_athlete_id());
CREATE POLICY coach_rel_insert ON coach_athletes FOR INSERT
  WITH CHECK (coach_id = auth_athlete_id());
CREATE POLICY coach_rel_update ON coach_athletes FOR UPDATE
  USING (coach_id = auth_athlete_id() OR athlete_id = auth_athlete_id());

-- teams: members can see their teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY teams_select ON teams FOR SELECT
  USING (
    owner_id = auth_athlete_id()
    OR id IN (SELECT team_id FROM team_members WHERE athlete_id = auth_athlete_id())
    OR is_public = true
  );
CREATE POLICY teams_modify ON teams FOR ALL
  USING (owner_id = auth_athlete_id());

-- team_members: members of the team can see each other
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY team_members_select ON team_members FOR SELECT
  USING (
    team_id IN (SELECT team_id FROM team_members WHERE athlete_id = auth_athlete_id())
  );
CREATE POLICY team_members_modify ON team_members FOR INSERT
  WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE owner_id = auth_athlete_id())
    OR athlete_id = auth_athlete_id()
  );

-- team_messages: ALL team members and coaches see the team chat (PUBLIC BOARD)
ALTER TABLE team_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY team_msg_select ON team_messages FOR SELECT
  USING (
    team_id IN (SELECT team_id FROM team_members WHERE athlete_id = auth_athlete_id())
  );
CREATE POLICY team_msg_insert ON team_messages FOR INSERT
  WITH CHECK (
    author_id = auth_athlete_id()
    AND team_id IN (SELECT team_id FROM team_members WHERE athlete_id = auth_athlete_id())
  );

-- ========== OPERATIONS ==========

-- sync_log: own only
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY sync_select ON sync_log FOR SELECT
  USING (athlete_id = auth_athlete_id());
CREATE POLICY sync_modify ON sync_log FOR ALL
  USING (athlete_id = auth_athlete_id());
```

---

## Training Load Methodology (ACWR / CTL / ATL / TSB)

### Daily Training Load Calculation

Each activity produces a training load score. Sources in priority order:

1. **Strava Suffer Score** (if available): Use directly. Strava subscribers get this on every activity with HR data.
2. **hrTSS (Heart Rate Training Stress Score)**: If HR data available but no suffer score:
   ```
   hrTSS = (duration_seconds × avgHR × IF) / (LTHR × 3600) × 100
   where IF (Intensity Factor) = avgHR / LTHR
   and LTHR = Lactate Threshold Heart Rate (estimated as 89% of max HR if not lab-tested)
   ```
3. **Duration-based estimate**: If no HR data (manual activities):
   ```
   load = duration_minutes × sport_factor
   sport_factors: Run=1.2, HIIT=1.5, WeightTraining=0.8, Walk=0.4, Ride=0.9
   ```

### Weekly Metrics

**ACWR (Acute:Chronic Workload Ratio)**:
```
Acute Load = sum of daily training loads for the past 7 days
Chronic Load = average of weekly loads for the past 28 days (4-week rolling average)
ACWR = Acute / Chronic
```

| ACWR Range | Risk Level | Interpretation |
|-----------|------------|----------------|
| < 0.8 | Low (undertraining) | Detraining; losing fitness |
| 0.8 - 1.3 | Optimal ("sweet spot") | Productive training adaptation |
| 1.3 - 1.5 | Elevated | Caution — higher injury risk |
| > 1.5 | High | Danger zone — significantly elevated injury risk |

**CTL (Chronic Training Load = "Fitness")**:
```
CTL_today = CTL_yesterday + (1/42) × (today's load - CTL_yesterday)
```
42-day exponential moving average. Higher = more fit (more training accumulated).

**ATL (Acute Training Load = "Fatigue")**:
```
ATL_today = ATL_yesterday + (1/7) × (today's load - ATL_yesterday)
```
7-day exponential moving average. Higher = more fatigued (more recent training).

**TSB (Training Stress Balance = "Form")**:
```
TSB = CTL - ATL
```
| TSB Range | State | Coaching Action |
|----------|-------|----------------|
| -30 or below | Very fatigued | Risk of overtraining. Reduce load. |
| -10 to -30 | Productively tired | Good training zone. Keep building. |
| -10 to +10 | Neutral | Transitioning. Maintain or build. |
| +10 to +25 | Fresh | Good for racing or key workouts |
| +25 or above | Very fresh (possibly detrained) | Start building again |

### Intensity Distribution

Classified from workout_classification on activities:

```
Low intensity: easy, recovery
Moderate intensity: tempo, progression, fartlek
High intensity: interval, race
```

```
weekly_intensity_distribution = {
  low: count(low) / total_runs,
  moderate: count(moderate) / total_runs,
  high: count(high) / total_runs
}
```

### Weather Backfill Strategy

For historical activities (2020-present), Open-Meteo provides free historical weather data:
```
GET https://archive-api.open-meteo.com/v1/archive
  ?latitude={lat}&longitude={lng}
  &start_date={date}&end_date={date}
  &hourly=temperature_2m,relative_humidity_2m,dew_point_2m,wind_speed_10m,precipitation
```
- Batch by date range (one API call covers multiple activities on the same day)
- Run as a one-time backfill script after initial Strava sync
- No rate limits on Open-Meteo archive API (fair use)

### Planned Workout → Activity Matching

When a new activity syncs, attempt to match it to a `planned_workout`:

```
1. Find planned_workouts WHERE planned_date = activity.start_date_local::date
   AND athlete_id = activity.athlete_id
   AND status = 'planned'
2. If multiple matches for same date, rank by:
   a. Sport type match (Run planned → Run actual)
   b. Workout classification match (interval planned → interval classified)
   c. Distance proximity (closest to target_distance_meters)
   d. Time proximity (closest start time if multiple runs same day)
3. If confidence > 0.7, auto-link: planned_workouts.actual_activity_id = activity.id
4. If confidence 0.4-0.7, suggest match in post-run analysis
5. If confidence < 0.4, leave unmatched
```

### Team Invite Code Security

```sql
-- Add expiry and usage tracking to teams table
ALTER TABLE teams ADD COLUMN invite_code_expires_at timestamptz;
ALTER TABLE teams ADD COLUMN invite_code_max_uses integer DEFAULT 50;
ALTER TABLE teams ADD COLUMN invite_code_use_count integer DEFAULT 0;
```

Invite codes expire after 7 days by default. Owners can regenerate codes. Expired/maxed codes are rejected at join time.

### Token Encryption Note

Phase 1 (personal use): OAuth tokens stored plaintext in `athletes` table. Acceptable risk — single user, service role key server-side only.

Phase 3+ (multi-user): Before launch, encrypt tokens at rest using `pgcrypto`:
```sql
-- Future: encrypt sensitive columns
ALTER TABLE athletes
  ALTER COLUMN access_token TYPE bytea USING pgp_sym_encrypt(access_token, current_setting('app.token_key')),
  ALTER COLUMN refresh_token TYPE bytea USING pgp_sym_encrypt(refresh_token, current_setting('app.token_key'));
```
