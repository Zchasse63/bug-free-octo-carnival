# Product Vision: AI Running Coach

## Overview

An AI-powered running coach that uses complete historical training data (every second since 2020) to provide intelligent, adaptive recommendations. Unlike existing running apps that give static plans, this system understands your full training history and adapts in real-time.

**Inspiration**: Motra (strength training app) — learns patterns, recommends what's missing, balances training load. We're building this concept for running/endurance.

---

## Core Capabilities (Build Priority Order)

### 1. Deep Historical Analysis
- Ingest ALL Strava data since account creation (2020)
- AI analyzes every second of every activity
- Surface: progress trends, regression, gaps in training, strengths, weaknesses
- Cross-activity patterns (e.g., "your Tuesday runs are consistently your worst — consider swapping rest days")

### 2. Insights Dashboard (Web App)
- AI-generated insights, not just charts and numbers
- Examples:
  - "Your 5K pace improved 12% since January but long run consistency dropped"
  - "You've been overtraining this month — 3 consecutive high-effort weeks"
  - "Your cadence drops significantly after mile 3 — consider cadence drills"
  - "Heart rate drift is increasing — possible sign of under-recovery"
- Historical trend visualization with AI commentary

### 3. Adaptive Weekly Planning
- Unlike static training plans, adjusts based on what you've ACTUALLY done
- If 3 of 5 planned runs were higher effort than expected → AI adjusts remaining runs
- Accounts for:
  - Cumulative fatigue (weekly/monthly training load)
  - Missed sessions
  - Intensity deviations from plan
  - Cross-training activities (HIIT, weight training)
  - Rest and recovery patterns
- "You already ran hard intervals Tuesday and Thursday. Today should be easy recovery, not the tempo run originally planned."

### 4. Free-form Workout Builder
- Natural language input → structured workout
- Example: "I want 400m repeats with 50 seconds rest, then a 1.5 mile cooldown with 3-4 minutes rest between the intervals and the cooldown"
- AI parses into structured workout with:
  - Warm-up, intervals, rest periods, cooldown
  - Target paces based on your current fitness
  - Exportable format

### 5. Watch Integration
- Export built workouts directly to Apple Watch or Garmin
- Immediate execution — build workout, send to watch, go run

---

## Key Differentiators vs Existing Apps

| Existing Apps | Our Approach |
|--------------|-------------|
| Static training plans | Adaptive — adjusts based on actual execution |
| Ignore what you've already done today | Considers all activity for the day/week/month |
| Rigid workout input forms | Natural language: just describe what you want |
| Show data, you interpret | AI interprets data and provides actionable insights |
| Current plan only | Full historical context (years of data) |
| Running only | Holistic — considers weight training, HIIT, recovery |

---

## Build Phases

### Phase 1: Personal Data Foundation (Current)
- Ingest all Strava data into Supabase
- Build data pipeline (sync, streams, token refresh)
- AI analysis of historical data
- Basic insights dashboard

### Phase 2: Web App with Adaptive Coaching
- Full Next.js web application
- Real-time insights dashboard
- Adaptive weekly plan generation
- Training load tracking and recovery recommendations

### Phase 3: Workout Builder
- Natural language workout creation
- Structured workout export
- Apple Watch / Garmin integration

### Phase 4: Multi-User Application
- User authentication
- Onboarding flow (Strava OAuth)
- Subscription model
- Scaling considerations

---

## Technical Decisions Needed

1. **Embeddings strategy**: What training data gets embedded for semantic search?
2. **AI model interaction**: How does the AI access and reason over historical data?
3. **Database schema**: Optimized for both structured queries AND AI analysis
4. **Real-time vs batch**: When do insights get generated?
5. **Frontend framework**: Next.js (given Supabase SSR setup already provided)

---

## User Profile

- **Athlete**: Zach Chasse, Tampa FL
- **Strava member since**: April 2020
- **Devices**: Apple Watch Ultra, WHOOP
- **Activities**: Running (primary), HIIT, Weight Training
- **Strava subscription**: Summit (active)
- **Data available**: GPS, HR, power (wrist-estimated), cadence, altitude, temperature
