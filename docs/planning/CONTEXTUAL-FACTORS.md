# Contextual Factors: What Affects Performance Beyond the Run Itself

## The Problem

Most running apps track what happened during the run (pace, HR, distance) but ignore everything else that influenced it. Two identical runs on paper can feel completely different because of shoes, weather, sleep, what you wore, what you ate, or what you did earlier that day.

Our AI coach needs to understand ALL of this to give credible advice.

---

## Factor Categories

### 1. Gear — Shoes (High Priority)

Strava already tracks gear assignment per activity. We store this in `gear` table. But we go further:

**What to correlate:**
- Pace by shoe (easy runs, tempo, intervals, races)
- Cadence by shoe (different stack heights change cadence)
- Injury/discomfort mentions in notes by shoe
- Total mileage per shoe (retirement alerts)
- Surface type by shoe (track flats vs trail shoes vs daily trainers)
- Performance degradation as shoes age (pace drift at same HR over shoe mileage)

**AI should surface:**
- "Your easy pace is 15s/mi faster in the Vaporfly than the Pegasus at the same HR — save them for quality sessions"
- "You've logged 450 miles on your Brooks Ghost — most shoes lose cushioning around 300-500 miles"
- "Your cadence drops 4 spm in the Hokas vs the Nikes — worth noting for form"

**Post-run prompt:** "Which shoes did you wear?" (if not auto-detected from Strava gear)

---

### 2. Weather (High Priority)

Weather dramatically affects running performance. Heat alone can add 30-60 seconds per mile at the same effort.

**Data to capture:**
- Temperature (actual + feels-like/heat index)
- Humidity
- Wind speed and direction
- Precipitation (rain, snow)
- Air quality index (AQI)
- UV index
- Dew point (better heat stress indicator than temperature alone)

**How to get it:**
- Weather API (OpenWeatherMap, WeatherAPI, etc.) keyed to activity start time + GPS location
- Automatic — no user input needed
- Store per-activity in a `activity_weather` table or JSONB column

**AI should surface:**
- "Your pace was 20s/mi slower today but it was 92°F with 80% humidity — that's equivalent to your normal easy pace effort"
- "You PR'd your 5K at 58°F — that's in the optimal range. Your race next month forecasts 75°F, so adjust expectations by ~10-15s/mi"
- "Your best runs in the last 6 months were all between 55-65°F — you're a cool weather runner"

**Heat adjustment formula** (well-established in running science):
- 50-55°F: optimal
- 55-65°F: +0-10s/mi
- 65-75°F: +10-30s/mi
- 75-85°F: +30-60s/mi
- 85°F+: +60-90s/mi+ (danger zone)

---

### 3. Elevation / Altitude (Already tracked but worth expanding)

Strava gives us elevation gain/loss per activity and altitude streams. But:

**Additional context:**
- Training altitude vs race altitude (altitude acclimatization)
- Elevation-adjusted pace (Grade Adjusted Pace / GAP already in splits)
- Cumulative elevation profiles for route comparison
- "This was a flat run" vs "this was a hilly run" matters for comparing paces

---

### 4. Clothing / Equipment (From Post-Run Notes)

What you wear affects thermoregulation, comfort, and performance.

**Things to parse from notes:**
- Shirt / no shirt / tank / long sleeve
- Shorts / tights / pants
- Hat / visor / headband
- Gloves
- Vest / jacket (wind, rain)
- Sunglasses
- Hydration vest / belt / handheld
- Watch arm (some runners notice HR differences)

**AI should learn patterns:**
- "You mentioned being hot on 3 of your last 4 runs — have you tried a tank/singlet instead of a t-shirt?"
- "Every run where you mentioned a hat in summer, your perceived effort was lower"

---

### 5. Pre-Run Factors (From Post-Run Notes)

**Things to parse:**
- Sleep quality/quantity ("I only got 5 hours")
- Nutrition ("ran fasted", "had a big meal", "took a gel before")
- Hydration status
- Time of day (already have from Strava, but user perception matters)
- Caffeine ("had a coffee before")
- Alcohol previous night
- Stress level ("rough day at work")
- Previous day's training (already tracked, but user perception of residual fatigue)
- Ice bath / cold plunge before or after
- Stretching / mobility work before
- Warm-up quality

---

### 6. During-Run Factors (From Post-Run Notes)

**Things to parse:**
- Running surface (road, trail, track, treadmill, grass, sand)
- Traffic / stops (may explain elapsed vs moving time gap)
- Running with others / solo
- Music / podcast / nothing
- Dog / stroller
- Carried phone / no phone
- Stomach issues
- Side stitch
- Pain / discomfort (location, severity)
- Mental state ("was in the zone", "couldn't get into it")

---

### 7. Post-Run Factors (From Post-Run Notes)

**Things to parse:**
- Soreness (location, severity)
- Recovery activity (stretching, foam rolling, ice bath, cold plunge, sauna)
- Nutrition timing ("ate within 30 min", "forgot to eat")
- Overall mood / satisfaction

---

## Implementation: Dynamic Tag System

Rather than hardcoding every possible factor, we need a flexible system that can:

1. **Parse known factors** from free-text notes using AI
2. **Discover new factors** the user mentions that we haven't seen before
3. **Store everything** in a way that enables correlation analysis

### Schema Approach

```sql
-- Structured weather data (auto-fetched)
CREATE TABLE activity_weather (
  activity_id       bigint PRIMARY KEY REFERENCES activities(id),
  athlete_id        bigint NOT NULL REFERENCES athletes(id),
  temperature_f     numeric(5,1),
  feels_like_f      numeric(5,1),
  humidity_pct      integer,
  wind_speed_mph    numeric(5,1),
  wind_direction    text,
  precipitation     text,        -- 'none', 'light_rain', 'heavy_rain', 'snow'
  aqi               integer,
  uv_index          integer,
  dew_point_f       numeric(5,1),
  conditions        text,        -- 'clear', 'cloudy', 'partly_cloudy', 'rain', etc.
  weather_source    text,
  fetched_at        timestamptz DEFAULT now()
);

-- Dynamic contextual factors (parsed from notes by AI)
CREATE TABLE activity_context_factors (
  id                bigserial PRIMARY KEY,
  activity_id       bigint NOT NULL REFERENCES activities(id),
  athlete_id        bigint NOT NULL REFERENCES athletes(id),
  category          text NOT NULL,    -- 'gear', 'clothing', 'pre_run', 'during_run', 'post_run', 'nutrition', 'recovery', 'sleep', 'surface', 'custom'
  factor_key        text NOT NULL,    -- 'ice_bath_before', 'ran_fasted', 'wore_hat', 'dog', 'treadmill'
  factor_value      text,             -- 'yes', '5 hours', 'Brooks Ghost 15', '2 cups'
  source            text NOT NULL,    -- 'user_note', 'auto_detected', 'weather_api'
  confidence        numeric(3,2),     -- AI confidence in parsing (0.0-1.0)
  raw_text_excerpt  text,             -- the part of the note this was extracted from
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_context_factors_activity ON activity_context_factors(activity_id);
CREATE INDEX idx_context_factors_athlete_key ON activity_context_factors(athlete_id, factor_key);
CREATE INDEX idx_context_factors_category ON activity_context_factors(athlete_id, category, factor_key);

-- Factor dictionary (learns new factors over time)
CREATE TABLE context_factor_definitions (
  factor_key        text PRIMARY KEY,
  category          text NOT NULL,
  display_name      text NOT NULL,    -- "Ice Bath Before Run"
  description       text,
  data_type         text DEFAULT 'boolean',  -- 'boolean', 'numeric', 'text', 'duration'
  unit              text,             -- 'hours', 'cups', 'degrees', etc.
  is_builtin        boolean DEFAULT false,   -- true for our predefined factors
  first_seen_at     timestamptz DEFAULT now(),
  usage_count       integer DEFAULT 1
);
```

### How It Works

1. **User gives post-run note**: "Wore my new Saucony Endorphin Pros, no shirt, did an ice bath before. Legs felt great, maybe the cold plunge helped. It was hot though."

2. **AI parses into structured factors**:
   ```
   gear/shoes: "Saucony Endorphin Pro" (confidence: 0.95)
   clothing/shirt: "none" (confidence: 0.98)
   pre_run/ice_bath: "yes" (confidence: 0.92)
   during_run/perceived_effort: "legs felt great" (confidence: 0.88)
   custom/cold_plunge_benefit: "possible positive effect" (confidence: 0.7)
   weather/hot: "yes" (auto-confirmed from weather API)
   ```

3. **New factor discovered**: "ice_bath_before" wasn't in our dictionary → added to `context_factor_definitions` with `is_builtin: false`

4. **Over time, AI correlates**: After 20+ ice bath mentions, AI can say "Your runs after ice baths average 8 bpm lower HR at the same pace — the cold exposure seems to help your performance"

---

## Post-Run Note Prompts

The AI coach should ask smart follow-up questions based on context. Not a checklist — conversational:

**After every run:**
- "How did that feel?" (open-ended, always)

**Situational follow-ups (AI decides based on data):**
- If HR was unusually high: "Your heart rate was higher than usual today — did anything feel off? Sleep, stress, hydration?"
- If pace was significantly different: "You were 30s/mi faster than your usual easy pace — was that intentional?"
- If it's a new shoe: "First run in the Endorphin Pros — how'd they feel?"
- If weather was extreme: "It was 94°F out there — were you okay with hydration?"
- If it's after a rest day: "How did the legs feel coming off yesterday's rest?"
- If there was a big elapsed/moving time gap: "Looks like you had some stops — anything going on?"

**The key principle: ask 1-2 targeted questions, not a survey.** The AI picks the most relevant question based on the activity data. Over time, as it learns what the user mentions naturally, it asks less.

---

## Priority for Implementation

### Phase 1 (MVP)
- Weather auto-fetch and storage
- Free-text notes with AI parsing into known factors
- Shoe correlation (already have gear from Strava)
- Dynamic factor dictionary (learn new factors)

### Phase 2
- Smart post-run prompts (contextual questions)
- Factor correlation analysis ("ice bath → better performance?")
- Shoe retirement alerts
- Weather-adjusted pace normalization

### Phase 3
- Surface type detection (from GPS + map data)
- Cross-factor analysis (sleep + weather + shoes → predicted performance)
- Personalized factor importance ranking per athlete
