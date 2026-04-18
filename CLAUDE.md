# Cadence (working name) — Project Instructions

**Status:** Planning phase complete (2026-04-18). Build phase ready to begin.
**Read `docs/SESSION-HANDOFF.md` first** — it is the canonical "where we are" doc for every new session.

## Project Overview

AI-powered running coach. Ingests complete training history (Strava Phase 1, others later), provides adaptive coaching, insights, and natural-language workout building. Chat-first UX with Claude. See `docs/planning/PRODUCT-VISION.md` for vision, `docs/PRD.md` for the full product spec.

## Tech Stack (Locked)

- **Database**: Supabase Postgres 17 — project `qasppaclbeamqsatgbtq`
- **Vector**: pgvector HNSW indexes (NOT IVFFlat) on `activity_embeddings` and `knowledge_base`
- **Backend**: Node.js / TypeScript (Edge Functions where appropriate)
- **Frontend**: Next.js 15 App Router + Tailwind CSS + shadcn/ui
- **AI**: Claude API (coaching + analysis), OpenAI `text-embedding-3-small` (1536d) for embeddings
- **Charts**: Recharts
- **Data Source (Phase 1)**: Strava API v3
- **Weather**: Open-Meteo (forecast + archive API for backfill)
- **Hosting**: Netlify (web) + Supabase (DB, auth, edge functions)
- **Deferred**: Terra API (expensive), native iOS (Phase 4)

## Working Name: "Cadence"

Temporary working title. Revisit before launch. Palette is Ink + Saffron (see Design).

## Design (Locked — do not re-litigate)

- **Palette:** Ink + Saffron. Primary accent `#C48A2A` / `#D99E3E` (dark). No orange anywhere. Full tokens in `docs/design/DESIGN-GUIDE.md` §3.
- **Widget treatment:** Gradient Glow (3-stop gradients, specular `::before`, shimmer `::after`, colored glow on hover, translateY lift). Reference: `docs/design/prototypes/dashboard.html` + `bento-glow.html`.
- **Chat aesthetic:** Journal / book. Canonical: `coach-chat-book.html`. Shantell Sans with BNCE variable axis. Paper `#EEE9DC` (light) / `#1A1612` (dark).
- **Data screens:** Clean SaaS — no journal aesthetic. Sidebar nav.
- **Nav (web):** Coach · Activities · Dashboard · Plan
- **Nav (iOS, Phase 4):** Coach · Run · Dashboard · Plan
- **Light + dark both first-class.** Never design only one.
- **Fonts:** Inter (UI), JetBrains Mono (numbers/tabular), Shantell Sans (chat only).

## Architecture (Locked)

- **32 tables** total. 19 active in Phase 1, 10 dormant for future phases. Full schema in `docs/architecture/SYSTEM-ARCHITECTURE.md`.
- **RLS on every table** with helpers `auth_athlete_id()` and `viewable_athlete_ids()`.
- **Data-agnostic schema:** `data_source` column on `activities`, plus `data_imports` and `training_gaps` tables. Strava-locked in Phase 1 but schema already supports Garmin, Apple Health, CSV, manual.
- **RAG pattern** (not fine-tuning) — `knowledge_base` + `activity_embeddings`. Knowledge base embeds training philosophies, coach personality, running vocabulary.
- **Weather in Celsius/metric**, converted in app layer.
- **Tokens plaintext Phase 1**, pgcrypto-encrypted before Phase 3 launch.
- **Strava sync:** three-pass (summaries → details → streams), recent-first, resumable, rate-limit-aware.
- **Training load:** CTL (42-day EMA), ATL (7-day EMA), TSB = CTL - ATL, ACWR for injury risk.

## Credentials

All in `.env` (gitignored, never commit):
- Strava: Client ID `226056`, Secret, Access Token, Refresh Token (full scope `activity:read_all`)
- Supabase: URL, Publishable Key, Service Role Key, DB Password
- Athlete ID: `56272355`

## Development Pipeline (Non-Negotiable)

Every feature MUST follow this pipeline. No exceptions.

### For features touching 3+ files or involving schema changes:
1. **Architect** — Run `feature-dev:code-architect` agent first
2. **Implement** — Follow the architect's blueprint
3. **Review** — Run `feature-dev:code-reviewer` agent on changes
4. **Verify** — Build, test, or run to confirm it works

### For trivial changes (<10 lines, single file):
1. **Implement**
2. **Verify**

### Rules:
- Never skip the architect step for non-trivial work
- Test as you implement, not after — no batching tests to the end
- Every migration gets verified with a test query (`execute_sql`)
- Every API integration gets a smoke test
- Document decisions in `docs/planning/DECISIONS.md` as you go

## Database Conventions

- Use Supabase MCP tools (`execute_sql`, `apply_migration`, `list_tables`) for all DB operations
- All tables in `public` schema
- Use `bigint` for Strava IDs (they're 64-bit)
- Use `timestamptz` for all timestamps
- Use `jsonb` for flexible/nested data (streams, metadata, context)
- RLS enabled on every table (even for personal use — good habit)
- Snake_case, plural (e.g., `activities`, `segment_efforts`, `activity_streams`)

## Code Conventions

- TypeScript for all code
- Explicit types, no `any`
- `const` over `let`
- Async/await over raw promises
- Error handling at boundaries
- Environment variables via `.env` — never hardcode secrets
- Server components by default in Next.js App Router; `"use client"` only when needed

## File Structure

```
/Users/zach/Desktop/Strava/
├── CLAUDE.md                          # This file — project conventions
├── STRAVA-API-V3-REFERENCE.md         # 1,047-line Strava API source-of-truth
├── .env                               # Credentials (gitignored)
├── .gitignore                         # Covers .env, .firecrawl/, .scrutiny/, .DS_Store, node_modules/
├── docs/
│   ├── SESSION-HANDOFF.md             # READ FIRST each session
│   ├── README.md                      # Doc index
│   ├── PRD.md                         # Full product requirements
│   ├── planning/                      # Vision, philosophy, decisions, feature brainstorm
│   ├── design/                        # Design guide, components, screens, prototypes
│   │   └── prototypes/                # Interactive HTML prototypes (canonical UI references)
│   ├── architecture/                  # SYSTEM-ARCHITECTURE.md (32 tables, RLS, sync)
│   ├── api/                           # (will fill as routes get documented)
│   └── database/                      # (migrations will live here)
├── research/                          # Strava API research artifacts
└── (app code will be added Phase 1 Week 1)
```

## Key References

- Strava API base: `https://www.strava.com/api/v3`
- Supabase URL: `https://qasppaclbeamqsatgbtq.supabase.co`
- Strava Swagger: `research/strava-swagger-spec.json`
- Strava rate limits: **200 req / 15 min, 2000 / day** (read: 100 / 15 min, 1000 / day)
- Strava tokens expire every 6 hours — always use refresh-token flow
- Repo: https://github.com/Zchasez63/bug-free-octo-carnival

## Do / Don't

**Do:**
- Read `docs/SESSION-HANDOFF.md` first, every session
- Use the architect agent for non-trivial work
- Use Supabase MCP tools for DB work
- Design light + dark in parallel
- Keep Ember orange out — we retired it

**Don't:**
- Re-litigate the palette, widget treatment, chat aesthetic, or 32-table schema — they're locked
- Use top-bar nav (we're sidebar)
- Mix journal aesthetic into data screens
- Skip the architect step
- Commit `.env` or anything in `.firecrawl/` / `.scrutiny/`
