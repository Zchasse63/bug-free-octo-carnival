# Stride AI — Product Requirements Document

> Working title. AI-powered running coach built on complete training history.
> PRD Version: 1.0 | 2026-04-16
> Author: Zach Chasse + Claude

---

## Quick Reference

| Attribute | Value |
|-----------|-------|
| **Product** | AI Running Coach (web app → native mobile) |
| **User** | Runners who want intelligent, adaptive coaching based on their data |
| **Tech Stack** | Next.js · Supabase (Postgres 17) · Netlify · Claude API · Strava API v3 |
| **Phase 1 Goal** | Personal use — ingest all Strava data, chat with AI coach, get insights |
| **Data Source** | Strava API v3 (activities, streams, segments, gear) |
| **Database** | 29 tables, full RLS, pgvector for embeddings |
| **AI Model** | Claude (Anthropic) via API — tool-calling pattern |
| **Hosting** | Netlify (frontend + serverless functions) |
| **Database Host** | Supabase (project: qasppaclbeamqsatgbtq, us-east-1) |

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Target Users & Personas](#2-target-users--personas)
3. [Competitive Landscape](#3-competitive-landscape)
4. [Features & User Stories](#4-features--user-stories)
5. [UI/UX Design](#5-uiux-design)
6. [Technical Foundation](#6-technical-foundation)
7. [Data & API Design](#7-data--api-design)
8. [AI System Design](#8-ai-system-design)
9. [Deployment & Operations](#9-deployment--operations)
10. [Phase Plan & Milestones](#10-phase-plan--milestones)
11. [Success Metrics](#11-success-metrics)
12. [Out of Scope (Phase 1)](#12-out-of-scope-phase-1)
13. [Open Questions](#13-open-questions)
14. [Reference Documents](#14-reference-documents)

---

## 1. Product Vision

### Problem Statement

Running apps today fall into two categories: data recorders (Strava, Garmin Connect) that show you what happened but don't tell you what it means, and training plan generators (Runna, TrainingPeaks) that give you a static plan but don't adapt based on what you've actually done. Neither understands your complete training history, and neither adjusts in real-time when reality deviates from the plan.

**Specific pain points:**
- Training plans don't account for the HIIT session you did yesterday, or the fact that your Tuesday run was 30% harder than planned
- No app lets you describe a workout in natural language ("400m repeats with 50s rest, then 1.5 mile cooldown")
- Post-run feedback is limited to smiley faces or 1-10 scores — your own words would be more meaningful
- No app correlates shoe choice, weather, sleep, or other contextual factors with performance
- Coaching advice is one-size-fits-all rather than learned from YOUR specific response patterns

### Solution

An AI running coach that:
1. **Knows your entire history** — every second of training data since 2020
2. **Adapts in real-time** — adjusts your plan based on what you've actually done, not just the schedule
3. **Speaks your language** — chat-first interface where you talk to your coach like a real person
4. **Learns YOU** — builds a personal response profile over time (what works for you, what doesn't)
5. **Understands the science** — grounded in all major training philosophies without being dogmatic about any one

### Tagline

"Your AI coach that actually knows you."

### Inspiration

- **Motra** (strength training) — learns what you do, recommends what's missing, balances training
- **Runna** (running, acquired by Strava) — personalized plans but static, doesn't adapt mid-week
- **A great human coach** — asks how you feel, adjusts the plan, explains the why

---

## 2. Target Users & Personas

### Primary Persona: The Data-Driven Runner

**Profile:** Runs 3-6 times per week, uses Strava, owns a GPS watch (Apple Watch, Garmin), wants to improve but doesn't have a human coach. Comfortable with technology. Interested in the science behind training but overwhelmed by conflicting advice (zone 2 vs threshold, 80/20 vs quality-focused).

**Pain points:**
- Follows a training plan but doesn't know if it's actually working
- Can't tell if their easy runs are too fast or their hard runs are too easy
- Wants to understand trends across months/years, not just today's run
- Gets generic advice from apps that don't know their history

**Goals:**
- Understand their own training data deeply
- Get personalized recommendations that adapt to their life
- Build custom workouts without rigid input forms
- Track progress toward specific race goals

### Secondary Persona: The Running Coach

**Profile:** Coaches remote athletes (individuals or teams). Needs to see athlete data, training load, and readiness without being in the same city. Currently cobbles together Strava, spreadsheets, and text messages.

**Pain points:**
- No single view of an athlete's training status
- Can't see how an athlete responded to the plan unless they message
- Team communication is scattered across platforms

**Goals:**
- View athlete dashboards with AI-generated insights
- Adjust athlete plans from a coach portal
- Communicate with athletes and teams in one place

### Tertiary Persona: The Team Runner

**Profile:** Part of a running club or training group. Wants to see teammates' activity, share encouragement, and train together even when not physically co-located.

**Goals:**
- Team activity feed
- Group discussion around training
- Friendly competition and accountability

---

## 3. Competitive Landscape

### Direct Competitors

| App | Strength | Weakness | Our Advantage |
|-----|----------|----------|---------------|
| **Runna** (Strava) | Beautiful UX, coach-backed plans, multi-device | Static plans, sycophantic feedback, no mid-week adaptation | Adaptive plans, honest coaching, learns individual patterns |
| **TrainingPeaks** | Gold standard for structured training, TSS/CTL | Complex, expensive, requires coach, no AI | AI replaces the coach for most users |
| **Garmin Coach** | Free, built into watch | Generic, limited adaptation, robotic communication | Deeply personalized, conversational, history-aware |
| **Nike Run Club** | Free, guided runs | No structured training plans, social-focused | Serious coaching, data-driven |

### Key Differentiator

No competitor does ALL of these:
1. Complete historical data ingestion (years, not just current plan)
2. Mid-week adaptive plan adjustment based on actual execution
3. Natural language workout creation
4. Free-form voice/text post-run feedback with AI parsing
5. Contextual factor correlation (shoes, weather, sleep → performance)
6. Training philosophy flexibility (not locked to one methodology)
7. Personal response profiling (learns what works for YOU)

### Competitive Risk

Strava acquired Runna in April 2025 and The Breakaway (cycling). They have 150M+ users and could ship similar features. Our moat is depth of coaching intelligence, philosophy flexibility, and contextual factor analysis — not just "we adapt plans."

---

## 4. Features & User Stories

### Feature Priority Matrix

| Priority | Features |
|----------|----------|
| **P0 (Must ship Phase 1)** | Strava data sync, AI chat interface, post-run analysis, weekly narrative report, workout DNA tagging, dynamic VDOT recalculation, activity embeddings, weather enrichment |
| **P1 (Phase 2)** | Adaptive training plans, onboarding questionnaire, fatigue fingerprint, injury risk score, time machine, goal reverse-engineering, personal response profiling, dashboard |
| **P2 (Phase 3)** | Coach portal, teams, workout builder (NL → structured), race day simulator, route intelligence, breathing coach, voice input, peer comparison |
| **P3 (Phase 4)** | Native iOS app, Apple Watch companion, Garmin export, multi-user launch |

---

### P0 Features (Phase 1)

#### F1: Strava Data Sync

**User Story:** As a runner, I want all my Strava activities imported into the system so the AI coach has my complete training history.

**Acceptance Criteria:**
- [ ] Three-pass sync: summaries → details → streams (deferred)
- [ ] Recent-first priority (last 90 days first, then historical backfill)
- [ ] Automatic token refresh before expiry
- [ ] Resumable on interruption (detail_fetched / streams_fetched flags)
- [ ] Rate limit handling: pause at 90/100 per 15-min window, stop at 900/1000 daily
- [ ] Sync log records every operation
- [ ] Weather auto-fetched for each activity via Open-Meteo (including historical backfill)
- [ ] Workout classification assigned by AI for each activity (easy/tempo/interval/long_run/race/etc.)
- [ ] Activity embeddings generated (including weather in summary text)

**Edge Cases:**
- Token refresh fails → set token_status to 'refresh_failed', notify user to re-authenticate
- Strava rate limit hit mid-batch → pause gracefully, resume from last cursor
- Duplicate activity detection (same external_id) → skip, don't duplicate
- Activity deleted on Strava → handle via webhook delete event (Phase 2), manual for Phase 1

---

#### F2: AI Chat Interface

**User Story:** As a runner, I want to chat with my AI coach in natural language and get personalized, data-driven responses.

**Acceptance Criteria:**
- [ ] Chat is the default/home screen of the app
- [ ] Persistent conversation history (searchable)
- [ ] Coach responds with context from training history, recent activities, and weekly summaries
- [ ] Coach uses tool-calling to query: weekly summaries, best efforts, similar activities, activity detail, training load
- [ ] Coach personality matches COACH-PERSONALITY.md (grounded, curious, patient, direct, philosophically flexible)
- [ ] Conversations linked to activities when relevant
- [ ] Markdown rendering in responses (bold, lists, tables)
- [ ] Streaming responses (not wait-for-complete)

**Edge Cases:**
- User asks about data not yet synced → coach explains sync is in progress
- User asks about very old activity → semantic search retrieves it
- Claude API failure → graceful error, retry with backoff
- Context window management: last 20 messages in full, older summarized

---

#### F3: Post-Run Auto-Analysis

**User Story:** As a runner, after I sync a new activity, I want the AI coach to automatically analyze it and have insights ready when I open the app.

**Acceptance Criteria:**
- [ ] After new activity syncs and detail is fetched, AI generates a brief analysis
- [ ] Analysis appears as a coach message in the active conversation
- [ ] Analysis covers: pace vs expectations, HR patterns, notable achievements or concerns
- [ ] Asks 1-2 smart follow-up questions based on the data (not a survey)
- [ ] If HR was unusually high: asks about sleep/stress
- [ ] If pace was significantly different: asks if intentional
- [ ] If new shoes: asks how they felt

**Edge Cases:**
- Multiple activities sync at once → analyze each, most recent first
- Non-run activity (HIIT, weights) → shorter analysis focused on load impact
- Manual activity (no HR/GPS) → minimal analysis, just log acknowledgment

---

#### F4: Weekly Narrative Report

**User Story:** As a runner, I want a conversational weekly summary every Sunday that tells me how my week went and what's ahead.

**Acceptance Criteria:**
- [ ] Generated Sunday evening (triggered by pg_cron or manual)
- [ ] Covers: volume (distance, time, elevation), quality sessions, easy run adherence, training load trend
- [ ] Notes cross-training impact (HIIT, weights)
- [ ] Highlights achievements (PRs, consistency streaks)
- [ ] Identifies concerns (rising easy HR, declining pace, overtraining signals)
- [ ] Forward-looking: what to focus on next week
- [ ] Delivered as a coach message in chat
- [ ] Stored as an ai_insight (type: weekly_analysis, trigger: scheduled_weekly)

---

#### F5: Workout DNA Tagging

**User Story:** As a runner, I want each activity automatically classified by workout type so I can see my training distribution.

**Acceptance Criteria:**
- [ ] AI classifies each run into: easy, recovery, tempo, threshold, interval, long_run, progression, fartlek, race
- [ ] Classification based on: pace variability, HR patterns, lap structure, duration, distance, user notes
- [ ] Stored in activities.workout_classification
- [ ] Weekly summary includes workout_type_distribution and intensity_distribution
- [ ] User can override classification in chat ("that was actually a tempo run")

---

#### F6: Dynamic VDOT Recalculation

**User Story:** As a runner, I want my estimated fitness level and training paces updated continuously from workout data, not just race results.

**Acceptance Criteria:**
- [ ] VDOT estimated from best_efforts (400m through marathon distances)
- [ ] Also estimated from pace:HR ratio on steady-state runs (fitness indicator)
- [ ] Updated after each relevant activity syncs
- [ ] Training paces (Easy, Marathon, Threshold, Interval, Repetition) derived from current VDOT
- [ ] Coach references current paces in recommendations
- [ ] Stored in athlete_zones with effective_date
- [ ] Notification when paces change: "Your training paces have been updated based on recent performance"

---

#### F7: Free-Form Post-Run Notes

**User Story:** As a runner, I want to describe how my run felt in my own words and have the AI understand and remember it.

**Acceptance Criteria:**
- [ ] Text input in chat linked to a specific activity
- [ ] Raw text always preserved verbatim (user sees their own words when they look back)
- [ ] AI parses into structured fields: perceived_effort (1-10), sentiment, tags, key_factors
- [ ] Contextual factors extracted: shoes mentioned, weather comments, clothing, sleep, nutrition, etc.
- [ ] New factors discovered dynamically (factor_key added to context_factor_definitions)
- [ ] Notes included in activity embedding text (re-embed when notes added)
- [ ] Searchable: "when did I last mention heavy legs?"

---

#### F8: Multi-Source Data Ingestion

**User Story:** As a runner, I want to import my training data from ANY source — not just Strava — so the AI coach has my complete history regardless of what devices or apps I've used.

**Acceptance Criteria:**
- [ ] Strava API integration (Phase 1 — primary)
- [ ] Manual file upload: FIT, GPX, TCX files parsed with standard libraries
- [ ] CSV/Excel smart upload: AI examines headers and sample rows, infers column mapping, user confirms
- [ ] Activities table has `data_source` column tracking origin ('strava', 'garmin', 'csv_upload', 'manual', etc.)
- [ ] Deduplication: detect if same activity uploaded from two sources (match by date + distance + duration)
- [ ] Manual activity entry form (date, distance, time, effort — for runners with no device)
- [ ] Data imports tracked in `data_imports` table with status, mapping, and error log
- [ ] AI handles ANY CSV format — mixed units, various date formats, different column names
- [ ] Future: Garmin Connect direct API (Phase 2), Terra API for 100+ sources (Phase 3+, cost-dependent)

**Edge Cases:**
- CSV with miles and km mixed → AI detects per-row and converts
- File with no headers → AI infers from data patterns
- Duplicate detection across sources → surface to user for confirmation
- Partial data (distance only, no HR) → import what's available, null the rest

---

#### F9: Training Gap Detection

**User Story:** As a runner with gaps in my training history, I want the AI to notice these gaps and ask what happened so it can understand my full story.

**Acceptance Criteria:**
- [ ] Scan for gaps: 14+ consecutive days with no activity data
- [ ] Scan for volume drops: >60% decline sustained for 2+ weeks
- [ ] During onboarding or post-ingestion, coach asks about each gap via chat
- [ ] Multiple choice + free text: Injury, Illness, Life event, Different app, Break, Other
- [ ] If injury: capture type and body part
- [ ] Pre-gap analysis: AI examines 4-6 weeks before gap for risk patterns
- [ ] Gaps stored in `training_gaps` table with user context and AI analysis
- [ ] Gap patterns influence future injury risk scoring

---

### P1 Features (Phase 2)

#### F10: Adaptive Training Plan

**User Story:** As a runner, I want a training plan that automatically adjusts based on what I've actually done, not just the original schedule.

**Acceptance Criteria:**
- [ ] Plan generated based on: goal race, current fitness (VDOT), available days, experience level, training history
- [ ] Plan stored in training_plans + planned_workouts
- [ ] After each completed activity, AI evaluates: was this harder/easier than planned? Should we adjust?
- [ ] Automatic adjustment triggers: effort significantly above/below target, missed session, extra session, illness/injury mention in notes
- [ ] Visible in Plan tab as a calendar view
- [ ] Coach explains WHY adjustments were made
- [ ] Planned workout ↔ actual activity matching (date + classification + distance proximity)

---

#### F9: Onboarding Questionnaire

**User Story:** As a new user, I want to be guided through a conversational questionnaire so the AI coach understands my goals and experience.

**Acceptance Criteria:**
- [ ] Delivered through the chat interface (not a form)
- [ ] Multiple choice OR free text answers
- [ ] Covers: running experience (years), current weekly mileage, goal race + date, available training days, injury history, preferred training style (if any), devices used
- [ ] Responses stored in onboarding_responses
- [ ] Used to generate initial training plan and set coach tone
- [ ] Can be revisited/updated anytime via chat

---

#### F10: Fatigue Fingerprint Detection

**User Story:** As a runner, I want early warning when I'm heading toward overtraining or illness, based on patterns in my data.

**Acceptance Criteria:**
- [ ] Multi-signal detection: HR drift on easy runs, pace decline at same effort, cadence drop, elevated ACWR, negative sentiment in notes
- [ ] Compares against athlete's own historical patterns
- [ ] Alert levels: green/yellow/orange/red
- [ ] Alerts surface as coach messages (not alarms)
- [ ] "Your data looks similar to [date] when you needed a recovery week"

---

#### F11: Injury Risk Score

**User Story:** As a runner, I want to know if my training load is in a safe zone or trending toward injury.

**Acceptance Criteria:**
- [ ] ACWR calculated weekly (acute:chronic workload ratio)
- [ ] Sweet spot: 0.8-1.3. Above 1.5 = danger zone.
- [ ] Factors: rapid volume increase, consecutive hard days, shoe mileage, surface type, sleep trends
- [ ] Surfaced in weekly summary and as proactive alerts when elevated
- [ ] Stored on weekly_summaries.acwr and weekly_summaries.injury_risk_level

---

#### F12: Time Machine

**User Story:** As a runner, I want to compare my current training to any past period and understand the differences.

**Acceptance Criteria:**
- [ ] "Compare my last 4 weeks to the 4 weeks before my 5K PR"
- [ ] Uses structured queries + semantic search
- [ ] Shows: volume difference, intensity distribution, pace trends, HR trends
- [ ] AI commentary on what's different and what it means
- [ ] Accessible through chat natural language queries

---

#### F13: Goal Reverse-Engineering

**User Story:** As a runner with a goal time, I want the AI to tell me what it would take to get there and whether it's realistic.

**Acceptance Criteria:**
- [ ] User states goal: "Sub-3:30 marathon in 6 months"
- [ ] AI calculates: current estimated marathon time (from VDOT), gap to goal, required weekly mileage, quality session types, realistic timeline
- [ ] Honest assessment: "Based on your current VDOT of 48, a 3:30 marathon is ambitious. Here's what it would take..."
- [ ] Generates a macro plan with milestones
- [ ] Links to training plan generation

---

#### F14: Personal Response Profiling

**User Story:** As a runner, I want the AI to learn how MY body responds to training over time and personalize recommendations accordingly.

**Acceptance Criteria:**
- [ ] Track: optimal quality days per week, recovery rate, best-responding workout types, heat tolerance, preferred run time
- [ ] Built from accumulated data (needs 3+ months of history)
- [ ] Stored in athlete_response_profiles
- [ ] Influences plan generation and coaching advice
- [ ] "Based on 8 months of data, your biggest pace improvements came from 2 threshold sessions per week"

---

### P2 Features (Phase 3)

#### F15: Coach Portal

**User Story:** As a running coach, I want to view my athletes' data, training status, and performance trends from one dashboard.

**Acceptance Criteria:**
- [ ] Coach login with 'coach' role
- [ ] View linked athletes (coach_athletes table, status = active)
- [ ] See athlete activity feed, weekly summaries, training load, ACWR
- [ ] Permissions-based: configurable per athlete (view activities, view notes, modify plan)
- [ ] Can adjust athlete's training plan (if permission granted)
- [ ] Individual coaching conversations NEVER visible to coach

---

#### F16: Teams

**User Story:** As a team runner, I want to see my teammates' activities and discuss training together.

**Acceptance Criteria:**
- [ ] Create team, invite via code (7-day expiry, max 50 uses)
- [ ] Team member list with roles (owner, coach, member)
- [ ] Team activity feed showing member activities
- [ ] Team chat (public board — all members and coaches see everything)
- [ ] Activity sharing: post an activity to the team feed with commentary

---

#### F17: Natural Language Workout Builder

**User Story:** As a runner, I want to describe a workout in plain language and get a structured workout I can execute.

**Acceptance Criteria:**
- [ ] "I want 400m repeats with 50 seconds rest, then a 1.5 mile cooldown with 3-4 minutes rest between"
- [ ] AI parses into structured format: warm-up, intervals (distance, target pace, rest duration), cooldown
- [ ] Target paces calculated from current VDOT
- [ ] Saved to planned_workouts with structure JSONB
- [ ] Viewable as a step-by-step workout card
- [ ] Future: exportable to Apple Watch / Garmin

---

#### F18: Race Day Simulator

**User Story:** As a runner preparing for a race, I want a predicted finish time and pacing strategy based on my fitness, the course, and expected weather.

**Acceptance Criteria:**
- [ ] Input: race name/distance, date, course profile (GPX or FindMyMarathon lookup)
- [ ] Factors: current VDOT, CTL/TSB (fitness/form), weather forecast, course elevation, shoe recommendation
- [ ] Output: predicted time (optimistic/realistic/conservative), per-mile pacing strategy, heat adjustment
- [ ] AI analysis: "The heat will cost you ~15-20s/mi vs your cool-weather fitness"
- [ ] Stored in race_predictions, optionally linked to training_plan

---

## 5. UI/UX Design

### Visual Style

| Attribute | Decision |
|-----------|----------|
| **Aesthetic** | Clean, modern, athletic. Not clinical (TrainingPeaks), not bubbly (Nike). Think Strava meets Claude. |
| **Color Palette** | TBD — needs design direction. Lean toward dark mode default with high-contrast accent for running metrics. |
| **Typography** | System fonts for performance. Consider Inter or Plus Jakarta Sans for headings. Monospace for pace/time displays. |
| **Icons** | Lucide icons (clean, consistent, open source) |
| **UI Kit** | shadcn/ui + Tailwind CSS (Next.js ecosystem standard) |
| **Design References** | Strava (data density), Claude iOS app (chat UX), Whoop (dark athletic feel), Linear (clean UI patterns) |

### Layout & Navigation

**4-tab bottom navigation (mobile-first responsive):**

```
┌──────────────────────────────────┐
│         App Header               │
├──────────────────────────────────┤
│                                  │
│       Content Area               │
│       (varies by tab)            │
│                                  │
├──────────────────────────────────┤
│  Coach  │  Run   │  Dash  │ Plan │
│   💬    │  🏃    │  📊   │  📅  │
└──────────────────────────────────┘
```

| Tab | Purpose | Key Elements |
|-----|---------|-------------|
| **Coach** (default) | AI chat interface | Message list, text input, activity cards inline, streaming responses |
| **Run** | Live workout display | Current pace, HR, distance, time. Workout structure if following plan. Minimal — glanceable. |
| **Dashboard** | Training data overview | Weekly volume chart, fitness/fatigue trend, recent insights cards, PR tracking, training distribution pie chart |
| **Plan** | Training calendar | Calendar view of planned vs completed workouts. Color-coded by type. Tap to see detail or modify. |

### Key Screens

#### 5.1 Coach Chat Screen (Primary)

The main screen. Conversation with the AI coach.

**Elements:**
- Message bubbles (user right-aligned, coach left-aligned)
- Activity cards embedded in conversation (when coach references a run, show a mini activity card with key metrics)
- Text input bar at bottom with send button
- Microphone button (Phase 3 — hidden in Phase 1)
- "Attach activity" option (link a note to a specific activity)
- Typing indicator when AI is generating
- Scroll to latest message on open

**States:**
- Empty state (first visit): Coach initiates with welcome message → onboarding questionnaire (Phase 2), or "I see you have X activities on Strava. Let me take a look..." (Phase 1)
- Active conversation: Scrollable message history
- Loading: Streaming dots while AI generates

#### 5.2 Dashboard Screen

**Elements:**
- **This Week card**: Distance / time / activities count with target comparison
- **Training Load chart**: CTL/ATL/TSB sparkline for past 8 weeks
- **Recent Insights**: Last 3 AI insights as expandable cards
- **Pace Trend**: Average easy pace and threshold pace over past 12 weeks
- **HR Trend**: Average easy-run HR over past 12 weeks
- **PR Board**: Recent best efforts with trends (improving/declining)
- **Training Distribution**: Pie chart — easy vs tempo vs interval vs long run percentages

#### 5.3 Activity Detail Screen

Accessed by tapping any activity from Dashboard or Chat.

**Elements:**
- Map (decoded polyline)
- Key metrics bar: distance, time, pace, HR, elevation
- Splits table (per-mile with pace, HR, elevation, GAP)
- Laps table (if structured workout)
- HR chart over time
- Pace chart over time
- AI analysis (post-run insight if generated)
- User notes (if any)
- Weather conditions
- Gear used
- Segment efforts (if any)

#### 5.4 Plan Screen (Phase 2+)

**Elements:**
- Calendar view (week view default, month view toggle)
- Planned workouts color-coded by type:
  - 🟢 Easy / Recovery
  - 🔵 Long Run
  - 🟡 Tempo / Threshold
  - 🔴 Intervals / VO2max
  - ⚪ Rest
  - 🟣 Cross-training
- Completed activities overlaid on planned slots
- Deviation indicators (✓ completed as planned, ↑ harder than planned, ↓ easier, ✕ missed)
- Tap to see workout detail or chat with coach about it

### User Flows

#### Flow 1: First-Time Setup (Phase 1)
1. User visits app → Supabase Auth login/signup
2. Choose data source: "Connect Strava" / "Upload Files" / "Start Fresh"
   - **Connect Strava**: OAuth flow, tokens stored, sync begins
   - **Upload Files**: Drag-and-drop FIT/GPX/TCX/CSV → AI parses → user confirms mapping
   - **Start Fresh**: No history — coach starts with onboarding questionnaire
3. Redirect to Coach chat → Coach: "Welcome! I'm pulling your training history now..."
4. Background: sync/import begins
5. **Gap detection**: If history has 14+ day gaps, coach asks about them
6. Coach posts updates as data loads: "I've pulled your last 90 days so far. Looking good — you've been averaging X miles/week."
7. After initial batch: Coach provides first insights

#### Flow 2: Daily Use (Post-Run)
1. User completes a run (recorded on Apple Watch, auto-syncs to Strava)
2. App syncs new activity (webhook in Phase 2, manual refresh in Phase 1)
3. AI generates post-run analysis → appears as coach message
4. User opens app → sees coach's analysis waiting
5. User responds with notes: "Legs felt heavy from yesterday's HIIT"
6. AI parses notes, stores structured data, re-embeds activity
7. AI responds with context-aware feedback: "That makes sense — your HR was 8bpm higher than usual at that pace. Rest day tomorrow?"

#### Flow 3: Weekly Planning
1. Sunday evening: AI generates weekly narrative report → coach message
2. User reads summary, reacts
3. User asks: "What should I do this week?"
4. AI considers: last week's execution, current ACWR, training phase, goals, personal response profile
5. AI suggests a week of workouts (or adjusts existing plan)
6. User agrees or modifies via chat

### UX Patterns

| Pattern | Choice |
|---------|--------|
| **Loading states** | Skeleton loaders for data, streaming dots for AI responses |
| **Empty states** | Coach conversation prompt (never a blank screen) |
| **Error handling** | Toast notifications for transient errors, inline for form validation |
| **Success feedback** | Subtle animation + toast for actions (note saved, plan updated) |
| **Dark mode** | Default. Light mode available as toggle. |
| **Responsive** | Mobile-first, fully responsive. Desktop gets wider chat + side panel for context. |
| **Accessibility** | WCAG 2.1 AA target. Keyboard navigation, screen reader support, focus indicators, color contrast. |

---

## 6. Technical Foundation

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14+ (App Router) | React ecosystem, SSR for performance, API routes for server-side ops |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first, great DX, consistent components |
| **Database** | Supabase (Postgres 17) | Managed Postgres, built-in Auth, RLS, pgvector, Edge Functions, real-time |
| **Vector Search** | pgvector (HNSW index) | Semantic search for activity similarity |
| **AI** | Claude API (Anthropic) | Tool-calling, streaming, large context, excellent reasoning |
| **Embeddings** | text-embedding-3-small (OpenAI) | 1536d vectors, cheap ($0.02/1M tokens), good quality |
| **Hosting** | Netlify | Git-based deploys, serverless functions, edge network |
| **Data Source** | Strava API v3 | OAuth2, REST, webhooks, comprehensive activity data |
| **Weather** | Open-Meteo API | Free, historical + forecast, no API key needed |
| **Auth** | Supabase Auth | Built-in, supports OAuth (Strava as provider), JWT-based RLS |

### Repository Structure

```
stride-ai/
├── .github/
│   └── workflows/            # CI/CD (lint, test, deploy)
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (auth)/           # Auth pages (login, callback)
│   │   ├── (app)/            # Authenticated app shell
│   │   │   ├── coach/        # Chat interface (default tab)
│   │   │   ├── run/          # Live run screen
│   │   │   ├── dashboard/    # Dashboard
│   │   │   ├── plan/         # Training plan calendar
│   │   │   └── activity/     # Activity detail [id]
│   │   ├── api/              # API routes (serverless functions)
│   │   │   ├── strava/       # Strava sync, webhooks, OAuth callback
│   │   │   ├── chat/         # Claude API proxy, streaming
│   │   │   ├── insights/     # Trigger insight generation
│   │   │   └── weather/      # Weather enrichment
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── chat/             # Chat-specific components
│   │   ├── dashboard/        # Dashboard widgets
│   │   ├── activity/         # Activity detail components
│   │   └── plan/             # Plan calendar components
│   ├── lib/
│   │   ├── supabase/         # Supabase client (server + client + middleware)
│   │   ├── strava/           # Strava API client (token refresh, sync, types)
│   │   ├── ai/               # Claude integration (context composition, tools, streaming)
│   │   ├── embeddings/       # Embedding generation and search
│   │   ├── weather/          # Open-Meteo client
│   │   └── utils/            # Shared utilities (pace conversion, date helpers)
│   ├── types/                # TypeScript type definitions
│   └── styles/               # Global styles, Tailwind config
├── supabase/
│   └── migrations/           # SQL migration files (001-024)
├── scripts/
│   ├── sync.ts               # CLI: manual Strava sync
│   ├── backfill-weather.ts   # CLI: weather backfill for historical activities
│   ├── generate-embeddings.ts # CLI: batch embedding generation
│   └── compute-summaries.ts  # CLI: recompute weekly/monthly summaries
├── docs/                     # All planning and architecture docs
├── .env.local                # Local environment variables
├── .gitignore
├── netlify.toml              # Netlify configuration
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md                 # Project instructions for Claude Code
```

### Git Strategy

- **Main branch**: `main` — always deployable, auto-deploys to Netlify production
- **Feature branches**: `feature/[name]` — PR-based workflow
- **Commit convention**: Conventional Commits (feat:, fix:, chore:, docs:)
- **PR requirement**: All PRs get code review (feature-dev:code-reviewer agent)

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qasppaclbeamqsatgbtq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side ONLY, never exposed to client

# Strava
STRAVA_CLIENT_ID=226056
STRAVA_CLIENT_SECRET=586371b...
# Per-user tokens stored in database, not env vars

# AI
ANTHROPIC_API_KEY=...            # Claude API
OPENAI_API_KEY=...               # Embeddings only (text-embedding-3-small)

# App
NEXT_PUBLIC_APP_URL=https://stride-ai.netlify.app  # or custom domain
STRAVA_WEBHOOK_VERIFY_TOKEN=...  # Phase 2
```

---

## 7. Data & API Design

### Database Schema

**32 tables across 11 groups.** Full SQL definitions in [docs/architecture/SYSTEM-ARCHITECTURE.md](docs/architecture/SYSTEM-ARCHITECTURE.md).

| Group | Tables | Purpose |
|-------|--------|---------|
| Identity & Auth | athletes, gear | User profiles, OAuth tokens, equipment |
| Activity Data | activities, activity_laps, activity_splits, best_efforts, segment_efforts, activity_streams | Core training data (source-agnostic) |
| Activity Context | activity_notes, activity_weather, activity_context_factors, context_factor_definitions | User feedback, weather, dynamic factors |
| Athlete Config | athlete_zones, athlete_response_profiles, onboarding_responses | Zones, learned patterns, questionnaire |
| Computed Analytics | weekly_summaries, monthly_summaries | Pre-computed aggregations with ACWR, CTL/ATL/TSB |
| AI Layer | activity_embeddings, ai_insights, race_predictions, **knowledge_base** | Vectors, insights, race modeling, **RAG knowledge** |
| Training Plans | training_plans, planned_workouts | Adaptive plan management |
| Conversations | conversations, messages | Chat history with AI metadata |
| Coach & Teams | coach_athletes, teams, team_members, team_messages | Social features |
| Data Management | **data_imports**, **training_gaps** | Multi-source ingestion, gap analysis |
| Operations | sync_log | Audit trail |

**Data-agnostic design:** The `activities` table has a `data_source` column. All sources (Strava, Garmin, Apple Health, CSV upload, manual entry) normalize into the same schema. The coaching layer doesn't care where data came from.

### Complete RLS Policy Coverage

All 29 tables have RLS enabled with policies covering:
- Athletes see own data
- Coaches see linked athletes' data (configurable permissions)
- Team members see team content
- Individual AI coaching conversations are PRIVATE to the athlete
- Team chat is PUBLIC to all team members

Helper functions: `auth_athlete_id()` and `viewable_athlete_ids()`.

Full policy SQL in architecture doc.

### API Routes

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/strava/callback` | GET | OAuth callback, exchange code for tokens | Public |
| `/api/strava/sync` | POST | Trigger manual sync | Authenticated |
| `/api/strava/webhook` | POST | Receive Strava webhook events | Webhook verify |
| `/api/chat` | POST | Send message to AI coach, stream response | Authenticated |
| `/api/chat/history` | GET | Get conversation messages | Authenticated |
| `/api/insights/weekly` | POST | Trigger weekly report generation | Authenticated / Cron |
| `/api/insights/post-run` | POST | Trigger post-run analysis for activity | Authenticated |
| `/api/weather/enrich` | POST | Fetch weather for activity | Authenticated |
| `/api/embeddings/generate` | POST | Generate/regenerate embeddings | Authenticated |

### External API Integrations

| Service | Purpose | Rate Limits | Cost |
|---------|---------|-------------|------|
| Strava API v3 | Activity data, athlete profile, gear | 200/15min, 2000/day (100/1000 read) | Free |
| Claude API | AI coaching, analysis, workout parsing | Token-based | ~$0.05-0.08/interaction |
| OpenAI Embeddings | text-embedding-3-small | 3500 RPM | ~$0.02/1M tokens |
| Open-Meteo | Historical + forecast weather | Fair use (no hard limit) | Free |
| FindMyMarathon | Race course profiles (future) | TBD | TBD |

---

## 8. AI System Design

### Context Composition (5 Layers)

Every AI interaction composes context from these layers:

| Layer | Tokens | Source | Always/On-Demand |
|-------|--------|--------|-----------------|
| System prompt (condensed coach personality) | ~2500 | Static + athlete profile | Always |
| Recent context (4 weeks summaries + last 7 activities) | ~1500 | SQL | Always |
| Historical summaries (12 months) | ~1000 | SQL | Always |
| Semantic retrieval (similar activities) | ~2000 | pgvector search | On-demand |
| Conversation history (last 20 messages) | ~2000 | messages table | Always |

**Total per interaction: ~9500 tokens input, ~1500 output ≈ $0.05-0.08**

### AI Tools (Claude Tool-Calling)

```typescript
const tools = [
  { name: "query_weekly_summary", description: "Get week-by-week training data" },
  { name: "query_best_efforts", description: "Get PR progression for a distance" },
  { name: "query_similar_activities", description: "Semantic search for similar workouts" },
  { name: "query_activity_detail", description: "Get laps, splits, and notes for an activity" },
  { name: "query_training_load", description: "Get fitness/fatigue/form for a date range" },
  { name: "query_athlete_profile", description: "Get current VDOT, zones, response profile" },
  { name: "create_workout", description: "Generate a structured workout from NL description" },
  { name: "update_training_plan", description: "Modify a planned workout" },
];
```

### RAG Knowledge Base Architecture

The AI coach is powered by RAG (Retrieval-Augmented Generation), NOT fine-tuning. All domain knowledge is embedded into pgvector and retrieved at query time.

**Why RAG over fine-tuning:**
- Update knowledge instantly (new research, new methods) without retraining
- Source attribution ("According to Jack Daniels' research...")
- Per-user activity data must be RAG (can't fine-tune per user)
- Cost: embedding is ~$0.02/1M tokens vs thousands for fine-tuning

**Two vector stores:**

| Store | Table | Contents | Size |
|-------|-------|----------|------|
| **Domain Knowledge** | `knowledge_base` | Training philosophies, coaching methods, personality guidelines, running vocabulary | ~200-500 chunks |
| **Personal Data** | `activity_embeddings` | Per-activity summaries with metrics + notes + weather | ~1000+ per user |

**Knowledge base sources** (chunked and embedded):
- TRAINING-PHILOSOPHIES.md (11 methods, debates, science)
- ELITE-COACHES-AND-PLANS.md (coaches, plans, what the best do)
- COACH-PERSONALITY.md (tone, anti-patterns, sample conversations)
- RUNNING-VOCABULARY.md (terminology mappings, abbreviations)

**Activity embedding strategy:**
- Activity-level text summaries (metrics + weather + user notes + contextual factors)
- Re-embed when notes added, weather fetched, or classification assigned
- Model: text-embedding-3-small (1536 dimensions)
- Index: HNSW (m=16, ef_construction=64)

**Running vocabulary** embedded so AI understands:
- "tempo" = "threshold" = "comfortably hard" = "LT run" = "T pace"
- "bonked" = glycogen depletion, "heavy legs" = muscular fatigue
- "BQ" = Boston Qualifier, "GAP" = Grade Adjusted Pace
- All common abbreviations, race distances, effort descriptions

Full vocabulary: [docs/planning/RUNNING-VOCABULARY.md](docs/planning/RUNNING-VOCABULARY.md)

### Coach Personality (Runtime)

The 783-line COACH-PERSONALITY.md is condensed to ~2500 tokens for the system prompt, with the full document available via RAG retrieval when deeper personality guidance is needed. Key elements:
- Core identity: knowledgeable friend with exercise physiology PhD
- Philosophically flexible: understands all training methods, doesn't preach one
- 6 universal coaching truths (easy days easy, consistency, specificity, overload, recovery, individuality)
- Tone: grounded, curious, patient, direct, warm, practical
- Anti-patterns to avoid: cheerleader, data dump, lecture hall, yes-man, robot, nag, therapist, ideologue

Full reference in [docs/planning/COACH-PERSONALITY.md](docs/planning/COACH-PERSONALITY.md).

### Data Ingestion Strategy

The system is **source-agnostic**. Data flows from any source through a normalization layer into the same schema.

- **Phase 1:** Strava API + manual FIT/GPX/TCX upload
- **Phase 2:** Garmin Connect API + CSV/Excel AI-powered smart upload + manual entry
- **Phase 3:** Terra API (100+ sources including Apple Health, WHOOP, Fitbit, Polar — cost-dependent)
- **Phase 4:** Native HealthKit + Garmin SDK (direct device integration)

Full strategy: [docs/planning/DATA-INGESTION-STRATEGY.md](docs/planning/DATA-INGESTION-STRATEGY.md)

---

## 9. Deployment & Operations

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| Production | stride-ai.netlify.app (or custom domain) | main | Live app |
| Preview | Auto-generated per PR | feature/* | PR previews |
| Local | localhost:3000 | any | Development |

### CI/CD Pipeline

1. Push to feature branch → Netlify preview deploy
2. PR opened → automated lint + type check + tests
3. Code review (feature-dev:code-reviewer agent)
4. PR merged to main → auto-deploy to production

### Monitoring

| Aspect | Tool |
|--------|------|
| Error tracking | Sentry (free tier) |
| Uptime | Netlify built-in |
| Database | Supabase dashboard |
| AI costs | Anthropic/OpenAI usage dashboards |
| Strava rate limits | sync_log table + response headers |

### Background Jobs (Phase 1 = CLI, Phase 2+ = automated)

| Job | Phase 1 | Phase 2+ |
|-----|---------|----------|
| Strava sync | `npm run sync` (manual) | Webhook → API route |
| Weather enrichment | `npm run weather` (manual) | Post-sync trigger |
| Embedding generation | `npm run embeddings` (manual) | Post-sync trigger |
| Weekly summary | `npm run weekly` (manual) | pg_cron → Edge Function |
| Monthly summary | `npm run monthly` (manual) | pg_cron → Edge Function |

---

## 10. Phase Plan & Milestones

### Phase 1: Personal Foundation (4-6 weeks)

**Goal:** Chat with an AI coach that knows your entire Strava history.

| Week | Focus | Deliverables |
|------|-------|-------------|
| 1 | Database + Auth | Deploy all 29 tables, Supabase Auth setup, Strava OAuth flow |
| 2 | Strava Sync | Token refresh, activity sync (Pass 1+2), weather enrichment, workout classification |
| 3 | AI Layer | Embedding generation, weekly/monthly summary computation, VDOT estimation |
| 4 | Chat Interface | Next.js app, Claude integration with tool-calling, streaming responses, conversation persistence |
| 5 | Post-Run Analysis | Auto-analysis after sync, activity notes, smart follow-up questions |
| 6 | Polish + Weekly Report | Weekly narrative generation, basic dashboard, testing, deployment to Netlify |

**Phase 1 Exit Criteria:**
- [ ] All Strava activities synced with detail
- [ ] Weather data for all activities
- [ ] Can chat with AI coach and get data-driven responses
- [ ] Post-run analysis appears after sync
- [ ] Weekly report generated
- [ ] Training distribution visible (workout classification)
- [ ] VDOT and training paces calculated
- [ ] Deployed on Netlify, accessible via URL

### Phase 2: Web App (6-8 weeks)
- Adaptive training plans
- Full dashboard with visualizations
- Onboarding questionnaire
- Fatigue detection + injury risk
- Time machine + goal reverse-engineering
- Personal response profiling (initial)

### Phase 3: Social & Advanced (8-12 weeks)
- Coach portal + teams
- NL workout builder
- Race day simulator
- Route intelligence
- Voice input (Web Speech API)
- Watch export research

### Phase 4: Native & Scale (TBD)
- Native iOS app
- Apple Watch companion
- Garmin integration
- Multi-user launch + billing

---

## 11. Success Metrics

### Phase 1 (Personal Use)

| Metric | Target |
|--------|--------|
| Activities synced | 100% of Strava history |
| AI response quality | Accurate data references, helpful insights (subjective) |
| Chat interactions per week | 5+ (proves the UX is engaging) |
| Weekly report usefulness | Actionable insights, not just data summaries |
| VDOT accuracy | Within 1 point of race-validated VDOT |

### Phase 2+ (Multi-User)

| Metric | Target |
|--------|--------|
| User retention (30-day) | >60% |
| Weekly active users | >70% of registered |
| Training plan adherence | >75% of planned workouts completed |
| NPS score | >50 |
| Injury rate reduction | Measurable vs pre-app baseline |

---

## 12. Out of Scope (Phase 1)

- Voice input (text only)
- Proactive coach messages (user-initiated only, except post-run analysis)
- Native mobile app
- Apple Watch / Garmin export
- Training plan generation and management UI
- Coach portal and teams
- WHOOP / Garmin Connect / Apple Health integrations
- Subscription billing
- Multi-user signup
- Dashboard visualizations beyond basic
- Route intelligence
- Race day simulator
- Peer comparison
- Onboarding questionnaire (coach works with available data)

---

## 13. Open Questions

| Question | Impact | Needs Decision By |
|----------|--------|-------------------|
| Product name (Stride AI is working title) | Branding, domain, deployment | Before Phase 2 launch |
| Custom domain vs netlify.app subdomain | UX, professionalism | Phase 1 deploy |
| Dark mode default or light mode default? | UI design | Design phase |
| Anthropic API key budget for personal use | Monthly cost | Before Phase 1 |
| OpenAI vs Voyage vs Cohere for embeddings? | Quality, cost | Before Phase 1 |
| FindMyMarathon API access method | Race simulator feature | Phase 3 |
| Garmin Connect API access for watch export | Watch export feature | Phase 3 |
| Strava webhook hosting (Netlify Functions vs Supabase Edge) | Architecture | Phase 2 |

---

## 14. Reference Documents

All detailed specifications live in the project docs directory:

| Document | Path | Contents |
|----------|------|----------|
| System Architecture | docs/architecture/SYSTEM-ARCHITECTURE.md | 32 tables, RLS, sync strategy, embeddings, AI context, training load methodology |
| Product Vision | docs/planning/PRODUCT-VISION.md | Full vision and build phases |
| UX Philosophy | docs/planning/UX-PHILOSOPHY.md | Chat-first design, screen structure |
| Training Philosophies | docs/planning/TRAINING-PHILOSOPHIES.md | 11 methods, debates, science (602 lines) |
| Elite Coaches | docs/planning/ELITE-COACHES-AND-PLANS.md | 12+ coaches, plan structures (1015 lines) |
| Coach Personality | docs/planning/COACH-PERSONALITY.md | AI persona, tone, sample conversations (783 lines) |
| Feature Brainstorm | docs/planning/FEATURE-BRAINSTORM.md | 15 features, prioritized |
| Contextual Factors | docs/planning/CONTEXTUAL-FACTORS.md | Shoes, weather, dynamic factors |
| **Data Ingestion** | **docs/planning/DATA-INGESTION-STRATEGY.md** | **Multi-source, smart upload, Terra API, gap detection** |
| **Running Vocabulary** | **docs/planning/RUNNING-VOCABULARY.md** | **Terminology mapping, abbreviations, RAG knowledge base design** |
| Decisions Log | docs/planning/DECISIONS.md | All technical and feature decisions |
| Competitive Analysis | docs/planning/COMPETITIVE-*.md | Motra + Runna deep dives |
| Strava API Reference | STRAVA-API-V3-REFERENCE.md | Complete API v3 docs (1047 lines) |
| Swagger Spec | research/strava-swagger-spec.json | Machine-readable API spec |
| Scrutiny Reports | .scrutiny/SCRUTINY-SUMMARY*.md | Adversarial reviews v1 + v2 |
| Project Config | CLAUDE.md | Dev pipeline, conventions, credentials reference |
