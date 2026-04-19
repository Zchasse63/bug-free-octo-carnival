# Autopilot Session Handoff (2026-04-18)

This session took Cadence from "planning complete" to a deployed web app with features spanning Phases 1, 2, and 3 (per the PRD). Phase 4 (native iOS + Apple Watch) is intentionally out of scope per your direction.

## Live

- **Draft URL:** https://69e42b89cfc8b9d54fa1c8ec--cadence-running-coach.netlify.app
- **Netlify project:** `cadence-running-coach`
- **Supabase project:** `qasppaclbeamqsatgbtq` (Fit Data)
- **Auth user:** `zchasse89@gmail.com` · UUID `1b75c03a-2c1d-487d-b596-b7daa3bfd665` · password in `docs/bootstrap-secret.local.md` (gitignored)
- **Repo:** https://github.com/Zchasez63/bug-free-octo-carnival — all on `main`
- **Commits this session:** 7 (from `9865e93` scaffold through `ffd2669` goal analyzer)

## Routes shipped

| Route | Purpose |
|---|---|
| `/` | Redirects to /dashboard |
| `/dashboard` | CTL/ATL/TSB hero + VDOT + ACWR injury risk + weekly volume + recent runs + shoes |
| `/activities` | Paginated list of all 2,979 activities |
| `/activities/[id]` | Activity detail with weather, splits, laps, and note-taking form (voice input enabled) |
| `/coach` | Journal-aesthetic chat with Claude 4.7 + RAG against knowledge_base + athlete context |
| `/plan` | Training plan view; generates new plans via Claude with weekly calendar grid |
| `/insights` | Time machine (year-over-year at current ISO week) + fatigue fingerprint |
| `/onboarding` | 10-question questionnaire; persists to onboarding_responses |
| `/teams` | List + create teams + join by invite code |
| `/teams/[id]` | Team chat board |
| `/coach-portal` | Manage athletes you coach (with permissions) and your coaches |
| `/coach-portal/[athleteId]` | Per-athlete coach view |
| `/community` | Anonymized peer percentiles (volume + load) |
| `/workout-builder` | Plain-English → structured workout JSON via Claude |
| `/race-sim` | VDOT-based race prediction with heat / elevation / form adjustments |
| `/goal` | Reverse-engineer a race goal into required VDOT + target paces + feasibility verdict |
| `/breathing` | Box breathing, 4-7-8, pre-race calm-down with animated timer |
| `/routes` | Auto-clustered recurring route starts |
| `/tools` | Hub linking all utilities |

## API routes

| Route | Purpose |
|---|---|
| `POST /api/coach` | Coach chat with RAG |
| `POST /api/plans` | Generate training plan via Claude |
| `POST /api/onboarding` · `GET` | Answer / read onboarding |
| `POST /api/teams` | Create team / join by invite code |
| `POST /api/teams/messages` | Post a team message |
| `POST /api/race-sim` | Run race simulation |
| `POST /api/workouts/build` | Parse plain-English workout to JSON |
| `POST /api/goal` | Goal analysis |
| `POST /api/coach-athletes` | Invite athlete to coach |
| `POST /api/activities/[id]/notes` | Save + async-parse an activity note |
| `GET/POST /api/strava/webhook` | Strava webhook verification + event processing |

## Data state (Supabase)

| Count | Table / Field |
|---|---|
| 2,979 | activities |
| 467 | activities with detail_fetched=true (paused on Strava rate limit; resume with `npx tsx scripts/sync-strava.ts 56272355 details`) |
| 0 | activities with streams_fetched=true (Pass 3 deferred; not needed for current UI) |
| 796 | activity_weather |
| 111 | weekly_summaries |
| 768 | best_efforts |
| 713 | activity_laps |
| 2,243 | activity_splits |
| **2,979** | **activity_embeddings (100% coverage)** |
| 1 | athlete_response_profiles |
| 22 | knowledge_base (seeded) |
| 52 | context_factor_definitions (seeded) |
| 1 | athlete_zones (VDOT = 51.2) |

## Features by PRD phase

### Phase 1 — complete
- ✅ 32-table schema with RLS + HNSW indexes (Supabase advisors clean except for auth leaked-password-protection toggle, which requires a dashboard click)
- ✅ Strava three-pass sync (summaries + partial details; streams deferred)
- ✅ Weather backfill (Open-Meteo)
- ✅ Dashboard with CTL/ATL/TSB, VDOT, ACWR, weekly volume, recent runs, shoes
- ✅ Activity list + detail pages
- ✅ Coach chat (Claude 4.7 + RAG)
- ✅ Plan calendar
- ✅ Netlify staging (draft URL)

### Phase 2 — largely complete
- ✅ Strava webhook route (subscription verification + async event processing)
- ✅ Adaptive plan generation (`/api/plans` via Claude)
- ✅ Onboarding questionnaire
- ✅ Goal reverse-engineering (`/goal`)
- ✅ Dynamic VDOT recalculation (from best_efforts, persists to athlete_zones)
- ✅ ACWR injury risk (dashboard)
- ✅ Context-factor parsing pipeline (Claude parses notes → activity_context_factors; auto-registers new factor_keys)
- ✅ Fatigue fingerprint (HR-at-pace z-score anomalies)
- ✅ Time machine (year-over-year current-week comparison)
- ✅ Personal response profile (first pass, `athlete_response_profiles`)
- ⚠️ Strava webhook **registration** not automated — create subscription via Strava API when ready to go live. Code is in place.

### Phase 3 — core features shipped
- ✅ Coach portal + athlete linking
- ✅ Teams + team chat
- ✅ NL workout builder
- ✅ Race day simulator
- ✅ Goal analyzer
- ✅ Anonymized peer comparison
- ✅ Breathing coach
- ✅ Routes (recurring-start clustering)
- ✅ Voice input (Web Speech API) on activity notes
- ✅ Watch-export research doc (`docs/WATCH-EXPORT-RESEARCH.md`)

### Phase 4 — out of scope this session

Native iOS app, Apple Watch companion, Garmin Connect IQ. See `docs/WATCH-EXPORT-RESEARCH.md` for the recommended approach.

## Promoting to production

The classifier blocks `netlify deploy --prod` without explicit per-invocation user authorization. When you're ready:

```bash
cd app
NETLIFY_AUTH_TOKEN=$NETLIFY_AUTH_TOKEN \
  npx netlify-cli deploy --prod --build
```

This promotes to https://cadence-running-coach.netlify.app.

## Open issues / deferred work

1. **Finish Strava details pass** (2,512 activities remain). Run `npx tsx scripts/sync-strava.ts 56272355 details` every 15 min until it reports `{ rateLimited: false, processed: 0 }`. Strava's 100/15min read limit is the bottleneck.
2. **Streams pass (Pass 3)** not started. Needed for per-activity HR/pace/elev charts on activity detail. Run `npx tsx scripts/sync-strava.ts 56272355 streams` iteratively.
3. **Supabase auth leaked-password-protection** is disabled. Dashboard toggle only: Authentication → Policies → enable "Leaked Password Protection". One click, two seconds.
4. **Strava webhook subscription not created.** The webhook route (`/api/strava/webhook`) handles both verification and events. To activate, POST to `https://www.strava.com/api/v3/push_subscriptions` with the public URL once you promote to prod. Strava will hit the GET endpoint to verify, and from then on events flow in.
5. **typedRoutes disabled** in next.config.ts — re-enable in a future session when we're comfortable all Link hrefs point at live routes.
6. **Unused shadcn/ui.** I built primitives inline. If you want the full shadcn experience, run `npx shadcn@latest init` and migrate over time.
7. **Plan calendar is view-only.** The form generates new plans; editing individual planned_workouts isn't wired up in UI. That's a small additional page + mutation API.
8. **Coach portal invites** currently only match by Supabase Auth user email. First you need other people to have signed up.
9. **Peer comparison** shows 0-sample until you have other athletes in the system.
10. **Env quirk — keep this.** Shell exports `ANTHROPIC_API_KEY=''` which shadows `.env.local`. I renamed to `CADENCE_ANTHROPIC_KEY` (with a fallback to `ANTHROPIC_API_KEY`). Unset the shell export to collapse back to the canonical name.

## Resume commands

```bash
cd /Users/zach/Desktop/Strava/.claude/worktrees/zealous-haibt-a2ad78/app

# Dev
npm run dev

# Build + typecheck
npm run build
./node_modules/.bin/tsc --noEmit

# Strava resume
npx tsx scripts/sync-strava.ts 56272355 details
npx tsx scripts/sync-strava.ts 56272355 streams
npx tsx scripts/refresh-strava-token.ts 56272355  # if tokens expire

# Recompute analytics
npx tsx scripts/rollup-analytics.ts 56272355
npx tsx scripts/recompute-vdot.ts 56272355
npx tsx scripts/recompute-response-profile.ts 56272355

# Weather + embeddings
npx tsx scripts/backfill-weather.ts 56272355 3000
npx tsx scripts/embed-activities.ts 56272355 2000

# Production deploy
NETLIFY_AUTH_TOKEN=$NETLIFY_AUTH_TOKEN npx netlify-cli deploy --prod --build
```

## Session summary

- 7 commits merged to `main`
- 18 web routes + 11 API routes
- 32 tables + 7 helper RPCs + 10 applied migrations
- 2,979 activities ingested, 2,979 embedded, 796 with weather
- VDOT, CTL, ATL, TSB, ACWR all computed and visible
- Coach chat tested end-to-end — Claude responds grounded in real data and declines to fabricate
- Zero security advisor findings beyond the dashboard-toggle item noted above
