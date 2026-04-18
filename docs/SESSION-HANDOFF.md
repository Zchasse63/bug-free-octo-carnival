# Session Handoff — End of Planning Phase

**Date:** 2026-04-18
**Status:** Planning phase complete. Next session begins the build phase.
**Repo:** https://github.com/Zchasez63/bug-free-octo-carnival
**Working name:** Cadence (temporary, revisit before launch)

---

## TL;DR — Where we are

We have finished design + planning. Every meaningful product question has been answered, every palette/treatment/layout decision has been locked, and every major doc has been written. The codebase contains **only** design docs, architecture docs, and interactive HTML prototypes — no application code yet. The next session is where we start building the actual Next.js + Supabase app.

**Everything a fresh agent needs to start building is in this document.**

---

## Locked Decisions (Do Not Re-Litigate)

### Brand
- **Working name:** "Cadence" — temporary, revisit before launch
- **Brand color system:** **Ink + Saffron** (locked 2026-04-18)
  - Primary accent: `#C48A2A` saffron (light) / `#D99E3E` (dark)
  - Neutrals: warm ink browns (see `docs/design/DESIGN-GUIDE.md` §3)
  - Paper (book chat): `#EEE9DC` (light) / `#1A1612` (dark)
  - **Ember `#E94E1B` is retired.** It read as Strava. No orange anywhere in the product.
- **Name/mascot/logo:** deferred to pre-launch. Do not block on this.

### Design System
- **Light mode primary**, dark mode fully supported (not an inversion — designed separately).
- **Journal aesthetic** applies to **chat surfaces only** (`coach-chat-book.html` is the canonical direction). Data screens stay clean SaaS.
- **Widget treatment:** **Gradient Glow** — 3-stop gradients, specular highlight (`::before`), shimmer sweep on hover (`::after`), colored glow shadow, `translateY(-3px)` hover lift, inner 1px ring. Respects `prefers-reduced-motion`. Reference: `docs/design/prototypes/bento-glow.html` and `dashboard.html`.
- **Dashboard navigation:** **Sidebar** (not top bar). Saffron-highlighted active tab.
- **Web tabs:** Coach · Activities · Dashboard · Plan
- **iOS tabs (Phase 4):** Coach · Run · Dashboard · Plan
- **Fonts:** Inter (UI), JetBrains Mono (numbers/tabular), Shantell Sans with BNCE variable axis (journal/chat only).
- **Component foundation:** shadcn/ui primitives, Kokonut UI Pro for marketing only, custom for training-specific components (workout cards, load charts, plan calendar).

### Tech Stack
- **Database:** Supabase Postgres 17 — project `qasppaclbeamqsatgbtq`
- **Backend:** Node.js / TypeScript (Edge Functions where appropriate)
- **Frontend:** Next.js App Router + Tailwind CSS + shadcn/ui
- **AI:** Claude API (coach/analysis), OpenAI text-embedding-3-small for 1536d activity embeddings
- **Vector:** pgvector HNSW indexes (not IVFFlat)
- **Data source (Phase 1):** Strava API v3 (OAuth tested, full-scope token in `.env`)
- **Weather:** Open-Meteo (forecast + archive for historical backfill)
- **Hosting:** Netlify (Next.js) + Supabase (DB, auth, edge functions)
- **Deferred:** Terra API (expensive), native iOS (Phase 4)

### Architecture
- **32 tables** (19 active in Phase 1, 10 dormant for future phases, verified in `docs/architecture/SYSTEM-ARCHITECTURE.md`)
- **RLS on every table** with helper functions `auth_athlete_id()` and `viewable_athlete_ids()`
- **Data-agnostic design:** `data_source` column on `activities`, `data_imports` table, `training_gaps` table. Strava is Phase 1 but schema supports Garmin, Apple Health, CSV upload, manual entry.
- **RAG architecture** (not fine-tuning) — `knowledge_base` + `activity_embeddings` tables. Knowledge base embeds training philosophies, coach personality, running vocabulary.
- **Weather stored in Celsius/metric**, converted in app layer.
- **Tokens plaintext for Phase 1**, pgcrypto encryption before Phase 3 launch.
- **Three-pass Strava sync**: summaries → details → streams, recent-first, resumable.
- **Training load:** CTL (42-day EMA), ATL (7-day EMA), TSB = CTL - ATL, ACWR for injury risk.

### Features (Prioritized — see `docs/planning/DECISIONS.md` for full table)
- **PRIMARY:** Dynamic VDOT Recalculation
- **Must-haves:** Personal Response Profiling, Race Day Simulator, Fatigue Fingerprint, Time Machine, Weekly Narrative, Workout DNA, Injury Risk Score, Goal Reverse Engineering, Post-Run Auto Analysis
- **New since brainstorm:** Coach Portal, Team Feature, Onboarding Questionnaire
- **Removed:** Dopamine Management (user cut this)
- **Running-only scope** for coaching/plans. Track all activity types for load. No HIIT/lifting plans yet.

### Conversation Visibility (important)
- **1:1 coaching conversations** (`conversations` + `messages`): **private to the athlete**. Coaches never see these.
- **Team chat** (`team_messages`): **public team board**. Coaches and team members both can see/post.

---

## Open Decisions (Deferred, Not Blockers)

| Decision | Current State | When to Resolve |
|---|---|---|
| Final product name | "Cadence" (temporary) | Before marketing site / public launch |
| Mascot direction | None — previously floated fox, deferred | With final name |
| Logo / wordmark | None yet | With final name |
| Chart library | Recharts named in CLAUDE.md but not yet installed | Phase 1 Week 3 (when first chart is built) |
| Domain | None purchased | Before beta |

---

## What Exists In This Repo

```
/Users/zach/Desktop/Strava/
├── CLAUDE.md                          ← Dev pipeline + conventions (this is canonical)
├── STRAVA-API-V3-REFERENCE.md         ← 1,047 lines, source of truth for Strava API
├── .env                               ← Credentials (gitignored)
├── .gitignore                         ← Updated 2026-04-18 to cover .DS_Store, .scrutiny/, node_modules, etc.
├── docs/
│   ├── SESSION-HANDOFF.md             ← THIS FILE
│   ├── README.md                      ← Doc index
│   ├── PRD.md                         ← 1,063-line product requirements
│   ├── planning/
│   │   ├── PRODUCT-VISION.md
│   │   ├── UX-PHILOSOPHY.md
│   │   ├── COACH-PERSONALITY.md       ← Needs philosophy-neutral rewrite before Phase 1 Week 5
│   │   ├── TRAINING-PHILOSOPHIES.md   ← 11 methods, coach AI must stay philosophy-neutral
│   │   ├── ELITE-COACHES-AND-PLANS.md
│   │   ├── RUNNING-VOCABULARY.md      ← Terminology mapping for AI
│   │   ├── CONTEXTUAL-FACTORS.md
│   │   ├── DATA-INGESTION-STRATEGY.md
│   │   ├── FEATURE-BRAINSTORM.md
│   │   ├── COMPETITIVE-MOTRA.md
│   │   ├── COMPETITIVE-RUNNA.md
│   │   └── DECISIONS.md               ← Chronological decision log
│   ├── design/
│   │   ├── DESIGN-GUIDE.md            ← Canonical design system (palette locked)
│   │   ├── COMPONENT-LIBRARY.md
│   │   ├── SCREENS.md
│   │   ├── DATA-VIZ-GUIDE.md
│   │   ├── COMPETITIVE-DESIGN-ANALYSIS.md
│   │   ├── ALMA-UI-STUDY.md
│   │   ├── COLOR-PALETTE-EXPLORATION.md  ← Historical; palette is now locked
│   │   ├── NAME-AND-MASCOT.md
│   │   ├── DESIGN-PLAN.md
│   │   └── prototypes/
│   │       ├── dashboard.html              ← CANONICAL — Ink + Saffron + Gradient Glow
│   │       ├── dashboard-v2.html           ← backup of previous iteration
│   │       ├── coach-chat-book.html        ← CANONICAL chat direction
│   │       ├── coach-chat.html             ← Clean variant (orange removed)
│   │       ├── coach-chat-journal.html     ← Notebook variant (orange removed)
│   │       ├── bento-glow.html             ← Widget treatment reference
│   │       ├── bento-preview.html          ← Historical 3-treatment comparison
│   │       ├── palette-preview.html        ← Historical palette visualization
│   │       ├── activity-detail.html
│   │       ├── training-plan.html
│   │       └── onboarding.html
│   ├── architecture/
│   │   └── SYSTEM-ARCHITECTURE.md     ← 32 tables, RLS, sync strategy, training load methodology
│   ├── api/                           ← empty; will fill as API routes get documented
│   └── database/                      ← empty; migrations will live here once built
└── research/
    ├── strava-swagger-spec.json
    ├── swagger-endpoints-summary.md
    ├── api-capabilities-research.md
    └── developer-portal-raw.md
```

**No application code exists yet.** Next session creates `package.json`, scaffolds Next.js, initializes Supabase schema.

---

## Phase 1 Build Plan (Next Session Starts Here)

Phase 1 is the MVP — just enough to ingest Zach's Strava history, show it on a dashboard, and have a working AI coach conversation. Roughly 6 weeks of work. Agent should take this as rough guidance, not contract.

### Week 1 — Scaffolding + DB
1. Initialize Next.js 15 App Router project at `/Users/zach/Desktop/Strava/app/` (or decide on a different structure — address this in the architect step)
2. Wire Supabase client + TypeScript types
3. Apply the 19 active Phase 1 tables from `docs/architecture/SYSTEM-ARCHITECTURE.md` as a first migration
4. Apply all RLS policies
5. Set up pgvector extension + HNSW indexes on `activity_embeddings` and `knowledge_base`
6. Verify with a test query per table

### Week 2 — Strava OAuth + Ingestion
1. Strava OAuth flow (PKCE + refresh token rotation)
2. Three-pass sync job: summaries → details → streams
3. Resumable, recent-first, rate-limit-aware (200 req / 15 min, 2000 / day)
4. Backfill Zach's full history (~years of activities)
5. Weather backfill via Open-Meteo archive API

### Week 3 — Dashboard MVP
1. Port `docs/design/prototypes/dashboard.html` to real Next.js + Tailwind components
2. Extract Gradient Glow tile as a reusable `<GlowTile>` component
3. Wire real data: weekly volume, CTL/ATL/TSB, recent activities, active shoes
4. Recharts for training load chart
5. Light + dark mode toggle with localStorage persistence

### Week 4 — Activity Detail Page
1. Port `docs/design/prototypes/activity-detail.html`
2. Map (Mapbox or Leaflet — decide in architect step)
3. Streams chart (HR, pace, elevation)
4. Splits table, zones breakdown
5. Notes + context factor entry

### Week 5 — AI Coach (Chat)
1. Port `docs/design/prototypes/coach-chat-book.html` (book aesthetic is canonical for chat only)
2. Shantell Sans with BNCE axis, paper-textured background
3. Wire Claude API with tool-calling pattern
4. Build `knowledge_base` table seed: embed training philosophies, coach personality (rewrite first to be philosophy-neutral), running vocabulary
5. RAG query pipeline: user message → embed → pgvector search → context → Claude call
6. Conversation persistence (`conversations` + `messages` tables)

### Week 6 — Plan Calendar + Polish
1. Port `docs/design/prototypes/training-plan.html`
2. Auto-regulating plan adjustments based on actual execution
3. Polish, bug-fix, verify light/dark mode everywhere
4. Deploy to Netlify staging

---

## Pre-Phase-1 Tasks (Do Before Week 1)

- [ ] **Rewrite `docs/planning/COACH-PERSONALITY.md`** to be philosophy-neutral. Current draft leans Daniels; coach AI must be flexible across all 11 philosophies in `TRAINING-PHILOSOPHIES.md`.
- [ ] **Confirm domain + hosting accounts** (Netlify, any additional Supabase config).
- [ ] **Create Supabase branches** for dev/staging (we have prod project `qasppaclbeamqsatgbtq`; may want a branch for Phase 1).

---

## Dev Pipeline (Non-Negotiable — from CLAUDE.md)

For any feature touching 3+ files or involving schema:
1. **Architect** — `feature-dev:code-architect` agent
2. **Implement** — follow the blueprint
3. **Review** — `feature-dev:code-reviewer` agent
4. **Verify** — build / test / smoke

For trivial changes (<10 lines, single file): Implement + Verify only.

Test as you implement. Never batch tests to the end.

---

## Credentials (in `.env`, gitignored)

- Strava Client ID: `226056`
- Strava Client Secret, Access Token, Refresh Token — all present, full-scope (`activity:read_all`)
- Supabase project: `qasppaclbeamqsatgbtq`
- Supabase URL, Publishable Key, Service Role Key, DB Password — all present
- Athlete ID: `56272355`

---

## Kickoff Prompt for Next Session

Copy-paste the block below into a fresh Claude Code session to start Phase 1 Week 1:

```
We're starting the build phase of Cadence (AI running coach). All planning is done
and committed. Start by reading these three files in order:

1. /Users/zach/Desktop/Strava/docs/SESSION-HANDOFF.md — full context on where we are
2. /Users/zach/Desktop/Strava/CLAUDE.md — dev pipeline + conventions (non-negotiable)
3. /Users/zach/Desktop/Strava/docs/architecture/SYSTEM-ARCHITECTURE.md — the 32-table schema

Then execute Phase 1 Week 1 (scaffolding + DB):

1. Run the feature-dev:code-architect agent to design the Week 1 work. Ask it to
   decide:
   - Directory structure (Next.js app at repo root vs /app/ subdirectory)
   - Which of the 19 active Phase 1 tables to create in the first migration
   - Migration file naming and ordering
   - Whether to use Supabase branches for dev/staging
   - How to seed the knowledge_base table (can be deferred to Week 5)

2. After the architect returns, implement Week 1:
   - Next.js 15 App Router scaffold (TypeScript, Tailwind, shadcn/ui)
   - Supabase client + generated TypeScript types
   - First migration: the 19 Phase 1 tables
   - RLS policies from SYSTEM-ARCHITECTURE.md
   - pgvector extension + HNSW indexes on activity_embeddings and knowledge_base
   - Smoke-test queries to verify each table

3. Run feature-dev:code-reviewer on the Week 1 changes. Fix any high-priority issues.

4. Verify: `npm run build` should pass. All migrations should apply cleanly to a
   fresh Supabase branch.

Important constraints:
- Use Supabase MCP tools (apply_migration, execute_sql, list_tables) for DB work —
  not raw SQL files until the migration is final
- All credentials are in .env (gitignored) — never commit them
- Light + dark mode both first-class — never design only one
- No orange anywhere. Saffron #C48A2A / #D99E3E is the only accent color
- Follow the dev pipeline in CLAUDE.md strictly

Commit to `main` branch of the repo (already pushed to
https://github.com/Zchasez63/bug-free-octo-carnival). Make one commit per logical
unit (scaffold, first migration, RLS, indexes) so we can review the progression.

Report back with:
- What the architect recommended and any deviations
- Migration file names + table counts confirmed via list_tables
- Any issues the reviewer flagged and how you resolved them
- A short list of "what's broken / undecided" so I know what needs my attention
  next session
```

---

## Reminders for Future Zach

- **Don't re-pick the palette.** It's Ink + Saffron. You may tune it later, but don't throw it away because of a mood.
- **Don't rebuild the dashboard from scratch.** The current `dashboard.html` is the reference for production. Port it; don't redesign it.
- **Don't start coding without running the architect.** CLAUDE.md makes this non-negotiable for a reason — you already saw how many issues scrutiny caught.
- **The journal aesthetic is chat-only.** Dashboards and data screens are clean SaaS. Don't mix them.
- **32 tables feels like a lot; trust it.** Scrutiny v2 validated all 32. 10 are dormant and can wait until their phase arrives — don't prune them prematurely.
