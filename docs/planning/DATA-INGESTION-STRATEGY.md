# Data Ingestion Strategy: Source-Agnostic Architecture

## Core Principle

**We are NOT a Strava app.** We are a running coach that happens to start with Strava data. The system must accept data from ANY source and help users get their data in regardless of format or origin.

---

## Data Sources (Priority Order)

### Tier 1: Direct API Integrations (Phase 1-2)
- **Strava** — Our starting point. Full API with streams, segments, laps. Used for personal development.
- **Apple Health** — Via Terra API or direct HealthKit (native app). Huge user base.
- **Garmin Connect** — Direct Garmin API or via Terra. Second largest watch market.

### Tier 2: Via Aggregator API (Phase 2-3)
- **Terra API** (tryterra.co) — Unified API connecting 100+ health platforms:
  - Apple Health, Garmin, Fitbit, WHOOP, Oura, Samsung, Polar, Suunto, Wahoo, Peloton, Zwift, COROS, and more
  - Normalizes data into one schema
  - Handles authentication per provider
  - Data backfill for historical data
  - Workout plan push capability
  - Webhook support for real-time sync
  - Pricing: Free tier available, paid plans for scale
  
### Tier 3: Manual Upload (Phase 1)
- **FIT files** — Standard from Garmin, Wahoo, most devices
- **GPX files** — Universal GPS format
- **TCX files** — Training Center XML (Garmin legacy)
- **CSV/Excel** — Users export from any app/device
- **Manual entry** — No device at all, just time/distance/effort

### Tier 4: First-Time Users (No History)
- User has never tracked a run before
- Onboarding captures: running experience, approximate weekly mileage, recent race times (if any)
- Coach starts with conservative recommendations and learns from first few weeks of data

---

## Smart Upload (AI-Powered Data Ingestion)

### The Problem
If we make users format their CSV to match our schema, they won't do it. People export data from Garmin Connect, Apple Health, RunKeeper, MapMyRun, Nike Run Club — every format is different. Column names, date formats, units, field availability all vary.

### The Solution
AI parses whatever they give us:

1. **User uploads a file** (CSV, Excel, FIT, GPX, TCX, JSON)
2. **System detects file type**:
   - FIT/GPX/TCX → parsed with standard libraries (same as Strava upload format)
   - CSV/Excel → AI examines headers, sample rows, and infers mapping
3. **AI mapping for CSV/Excel**:
   ```
   User's columns:          Our schema:
   "Date"              →    start_date
   "Distance (mi)"     →    distance_meters (× 1609.34)
   "Time"              →    moving_time (parse to seconds)
   "Avg Pace"          →    average_speed (convert from pace)
   "Avg HR"            →    average_heartrate
   "Calories"          →    calories
   "Notes"             →    → activity_notes.raw_text
   ```
4. **Confirmation step**: Show the user what we interpreted. "I see 247 runs from January 2022 to March 2026. Here's how I mapped your columns — does this look right?"
5. **User confirms** → data ingested into activities table
6. **Missing fields are null** — we work with whatever data is available

### What We Can Handle
- Mixed units (miles + km in same file)
- Various date formats (MM/DD/YYYY, YYYY-MM-DD, "Jan 5, 2024")
- Pace in min/mi or min/km
- Duration as "1:23:45" or "5045 seconds" or "84 minutes"
- Headers in any language (AI can interpret)
- Missing columns (just ingest what's there)

### Schema Impact
Add to activities table:
```sql
data_source text DEFAULT 'strava',  -- 'strava', 'garmin', 'apple_health', 'fitbit', 'whoop', 'terra', 'csv_upload', 'manual'
source_id   text,                    -- Original ID from source system
```

New table:
```sql
CREATE TABLE data_imports (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  source            text NOT NULL,    -- 'csv', 'excel', 'fit', 'gpx', 'tcx', 'json'
  filename          text,
  file_size_bytes   integer,
  status            text DEFAULT 'pending' CHECK (status IN ('pending', 'mapping', 'confirmed', 'importing', 'completed', 'failed')),
  column_mapping    jsonb,            -- AI-generated mapping from user columns to our schema
  row_count         integer,
  imported_count    integer DEFAULT 0,
  failed_count      integer DEFAULT 0,
  error_log         jsonb,
  ai_confidence     numeric(3,2),     -- How confident the AI is in the mapping
  created_at        timestamptz DEFAULT now(),
  completed_at      timestamptz
);
```

---

## Training Gap Detection

### During Data Ingestion
When processing a user's history (from any source), scan for gaps:

**Definition of a gap:**
- No activity data for 14+ consecutive days (adjustable)
- Sudden drop in weekly volume (>60% decline sustained for 2+ weeks)

**What to do:**
1. Flag each gap in a `training_gaps` table
2. During onboarding or post-ingestion, coach asks about each significant gap:
   - "I notice you didn't record any runs from February to April 2025. What happened during that time?"
   - Multiple choice: Injury, Illness, Life event, Used different app, Took a break, Other
3. If injury: ask what type, what body part → stored for injury pattern analysis
4. Pre-gap analysis: Look at training load, volume ramp, and pattern in the 4-6 weeks before the gap
   - "In the 6 weeks before your February 2025 gap, your weekly mileage increased 40% and you ran hard 4 days in a row. That might have contributed."

### Schema
```sql
CREATE TABLE training_gaps (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id        bigint NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  gap_start         date NOT NULL,
  gap_end           date NOT NULL,
  duration_days     integer NOT NULL,
  -- User-provided context
  reason            text,    -- 'injury', 'illness', 'life_event', 'different_app', 'break', 'other'
  details           text,    -- Free text from user
  injury_type       text,    -- If reason = injury: 'knee', 'shin', 'ankle', 'hip', etc.
  -- AI analysis
  pre_gap_analysis  text,    -- AI analysis of training patterns before the gap
  risk_factors      jsonb,   -- [{factor: "rapid volume increase", severity: "high"}, ...]
  created_at        timestamptz DEFAULT now()
);
```

---

## Data Source Abstraction Layer

### Design Principle
The activities table doesn't care where data came from. Every source normalizes into the same schema. Source-specific handling happens in the ingestion layer, not the storage layer.

```
                    ┌─────────────┐
                    │   Strava    │──┐
                    └─────────────┘  │
                    ┌─────────────┐  │    ┌──────────────────┐    ┌─────────────┐
                    │   Garmin    │──┼───→│  Normalization    │───→│  activities  │
                    └─────────────┘  │    │  Layer            │    │  table       │
                    ┌─────────────┐  │    │  (unified schema) │    │  (source     │
                    │ Apple Health│──┤    └──────────────────┘    │   agnostic)  │
                    └─────────────┘  │                            └─────────────┘
                    ┌─────────────┐  │
                    │  Terra API  │──┤
                    └─────────────┘  │
                    ┌─────────────┐  │
                    │  CSV Upload │──┤
                    └─────────────┘  │
                    ┌─────────────┐  │
                    │ Manual Entry│──┘
                    └─────────────┘
```

### What Each Source Provides

| Data Point | Strava | Garmin | Apple Health | CSV Upload | Manual Entry |
|-----------|--------|--------|-------------|------------|-------------|
| Distance | ✅ | ✅ | ✅ | Usually | ✅ |
| Duration | ✅ | ✅ | ✅ | Usually | ✅ |
| GPS track | ✅ | ✅ | ✅ | Sometimes | ❌ |
| Heart rate | ✅ | ✅ | ✅ | Sometimes | ❌ |
| Cadence | ✅ | ✅ | Sometimes | Rarely | ❌ |
| Power | ✅ | ✅ | Sometimes | Rarely | ❌ |
| Elevation | ✅ | ✅ | ✅ | Sometimes | ❌ |
| Laps | ✅ | ✅ | ❌ | Rarely | ❌ |
| Splits | ✅ | ✅ | ❌ | Rarely | ❌ |
| Segments | ✅ | ❌ | ❌ | ❌ | ❌ |
| Gear | ✅ | Partial | ❌ | ❌ | User input |
| Streams (per-second) | ✅ | ✅ (FIT) | ✅ (HK) | ❌ | ❌ |

**The coach works with whatever is available.** More data = better coaching. Less data = still useful, just broader recommendations.

---

## Phase Implementation

### Phase 1 (Personal Use)
- Strava API only (your data)
- Manual FIT/GPX/TCX upload support (parse with standard libraries)
- `data_source` column on activities

### Phase 2 (Web App)
- CSV/Excel smart upload with AI parsing
- Garmin Connect direct API
- Training gap detection
- Manual activity entry form

### Phase 3 (Multi-Source)
- Terra API integration (Apple Health, WHOOP, Fitbit, Polar, Suunto, Samsung, etc.)
- Full data source management UI (connect/disconnect sources)
- Deduplication across sources (same run from Strava + Garmin)
- Historical backfill via Terra

### Phase 4 (Native App)
- Direct Apple HealthKit integration (native iOS)
- Direct Garmin SDK integration
- Background sync without user action
