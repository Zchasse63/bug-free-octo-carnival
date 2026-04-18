# Decision Log

## 2026-04-18 (Late PM) — Planning Phase Locked, Build Phase Ready

**Session end — all planning decisions frozen, all prototypes propagated, repo initialized + pushed.**

### Palette — LOCKED: Ink + Saffron
Zach: _"Ink + Saffron looks good, we may adjust in the future but this is it for now."_

- Primary accent: `#C48A2A` saffron (light) / `#D99E3E` (dark)
- Warm ink neutrals 0-950 (browns)
- Ember `#E94E1B` officially retired across the codebase — zero references remain in any prototype
- Fully documented in `docs/design/DESIGN-GUIDE.md` §3 (Color System rebuilt top-to-bottom)

### Widget treatment — LOCKED: Gradient Glow
Zach: _"Widgets look good."_ → Row 2 from `bento-preview.html`, refined in `bento-glow.html`, now the canonical treatment in `dashboard.html`.

### Coach chat — LOCKED: Book variant
Zach: _"Coach chat looks good."_ → `coach-chat-book.html` with Shantell Sans + `#EEE9DC` paper is the canonical chat direction. Other two variants (`coach-chat.html`, `coach-chat-journal.html`) kept as backups with orange fully purged.

### Dashboard rebuild — DONE
- `dashboard.html` rebuilt with Ink + Saffron + Gradient Glow bento + sidebar nav
- Hero metrics row (Weekly km / Readiness / CTL with sparkline)
- Insights moved UP per user feedback (Progress / Pattern / Recommendation)
- 5 Gradient Glow tiles (Fitness CTL / Weekly Volume / Training Mix / PR Progress / Readiness gauge)
- Training load chart with Saffron "Today" marker
- Recent activities + Active shoes cards
- Light + dark mode both first-class
- Previous iteration saved as `dashboard-v2.html`

### Git / Repo — INITIALIZED
- Repo: https://github.com/Zchasez63/bug-free-octo-carnival
- `.gitignore` expanded to cover `.DS_Store`, `.scrutiny/`, `.env`, `.firecrawl/`, `node_modules/`, build artifacts
- First commit: planning phase complete, zero application code yet

### Session handoff — WRITTEN
- `docs/SESSION-HANDOFF.md` is the canonical "where we are" doc for the next session
- Includes copy-pasteable kickoff prompt, Phase 1 6-week build plan, all locked decisions, all open decisions
- All future sessions should start by reading it

### Pre-build outstanding
- [ ] Rewrite `COACH-PERSONALITY.md` to be philosophy-neutral (currently Daniels-leaning; coach AI must flex across all 11 philosophies) — target: before Phase 1 Week 5
- [ ] Name / mascot / logo exploration — deferred to pre-launch
- [ ] Domain — pending

---

## 2026-04-18 (PM) — Paper Iterated, Widget Treatment Locked, Palette Preview Visualized

### Paper color — locked at `#EEE9DC`
Fourth iteration. Warm light notebook gray — between cream and full gray. Previous `#EAE5D8` read slightly too dark/gray. Alt/note paper now `#F4EFE3`.

### Gradient Glow — LOCKED as widget direction
Row 2 from `bento-preview.html` confirmed. Refinements applied in new `bento-glow.html`:
- 3-stop gradients (light → mid → deep) for real depth
- Specular highlight pseudo-element (static top-left radial glow)
- Shimmer sheen on hover (diagonal sweep, 900ms, respects prefers-reduced-motion)
- Colored glow shadow on hover (tinted to match each tile's accent)
- Hover lift (translateY -3px)
- Inner ring (1px inset white at low opacity — premium lens feel)
- Swapped HR Zones → Readiness gauge for Widget #5 (more visual variety)
- 3-stop bar gradients on Weekly Volume chart
- PR rows get vertical accent lines
- Dark mode is rich warm charcoal base with gradients that stay vibrant (lamp-lit premium)

### Palette preview — VISUAL version built
Zach couldn't see colors in the markdown doc. New `palette-preview.html` renders all 4 palettes as actual color swatches + sample UI per palette + side-by-side primary-accent comparison + recommendation banner (Saffron) at top. Markdown doc preserved as supplement.

### Still pending
- Palette pick (Forest / Rust / Cobalt / Saffron)
- Full dashboard rebuild (blocked on palette pick only — treatment is locked)
- Orange removal from coach-chat.html and coach-chat-journal.html (happens during dashboard rebuild pass)

---

## 2026-04-18 — Color Palette Exploration + Widget Treatment Preview

### Paper color — locked
Book chat paper updated from `#F2EDE2` (too cream/soft) → `#EAE5D8` (warm notebook gray). Alt/note paper: `#F1ECDF`. Dark mode paper unchanged (`#1A1612`).

### Color palette — in exploration
Ember orange (`#E94E1B`) formally retired because it reads as Strava. Four palette directions proposed in [docs/design/COLOR-PALETTE-EXPLORATION.md](../design/COLOR-PALETTE-EXPLORATION.md):

1. **Graphite + Forest** — warm neutrals + deep forest green accent `#1F4D3B`
2. **Obsidian + Rust** — warm near-black + dusty terracotta `#B45A3C`
3. **Slate + Cobalt** — cool slate + electric cobalt `#2D3FE8`
4. **Ink + Saffron** — warm ink + muted saffron `#C48A2A` ← **recommended**

Zach to pick. Once locked, all prototypes and design tokens update to that system.

### Widget treatment — in exploration
Bento widget treatments proposed in [docs/design/prototypes/bento-preview.html](../design/prototypes/bento-preview.html). Three visual directions × five widget types:

1. **Soft Flat** — subtle pastel fills, airy, minimal chrome
2. **Gradient Glow** — duotone gradients with soft inner glow, premium
3. **Editorial Card** — white/dark surface + thin accent stripe, restrained

Zach to pick a treatment (or hybrid) before full dashboard rebuild.

### Chat user-message design — philosophical question surfaced
Zach asked why his messages use a different font (JetBrains Mono typewriter) than Cadence's (Shantell Sans handwriting). Current answer: symbolic (it's Cadence's journal, you're writing in it) + practical (legibility and scan-ability). Three alternatives available if Zach wants to unify voice — default keeps current design.

### Dashboard rebuild — blocked, by design
Full dashboard rebuild intentionally deferred until palette + widget treatment are locked. Don't rebuild twice.

### Orange removal — partial
Orange fully removed from: `coach-chat-book.html`, `activity-detail.html`, `training-plan.html`, `onboarding.html`.
Orange still present in: `coach-chat.html` (clean variant), `coach-chat-journal.html` (notebook variant). Scheduled to be swapped during the dashboard rebuild pass.

---

## 2026-04-16 — Post-Scrutiny Feature Decisions

### New Features Added
1. **Coach Portal** — Coaches can log in and see their athletes' data, performance, and training. Support remote coaching of individuals and teams.
2. **Team Feature** — Athletes can form teams, see teammates' performances. Private feed/chat for team discussion.
3. **Onboarding Questionnaire** — Guided through chat (multiple choice, keyboard, or voice). Captures goals, experience, schedule, injury history — everything needed to build a personalized program.

### Features Approved from Brainstorm
| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| 1 | Personal Response Profiling | Must-have | Build out fully |
| 2 | Race Day Simulator | Must-have | Look for course profile API |
| 3 | Fatigue Fingerprint Detection | Must-have | Multi-signal early warning |
| 4 | Time Machine | Must-have | Historical comparison engine |
| 5 | Breathing Coach | Nice-to-have | Soft integration, not overbearing |
| 6 | Dynamic VDOT Recalculation | PRIMARY | Core feature of the entire project |
| 7 | Weekly Narrative Report | Must-have | Sunday coach call |
| 8 | Workout DNA Tagging | Must-have | Training distribution analysis |
| 9 | Injury Risk Score | Must-have | ACWR-based |
| 10 | Route Intelligence | Should-have | GPS clustering |
| 11 | Training Block Templates | Should-have | Composable plan building |
| 12 | Peer Comparison | Should-have | Anonymized, multi-user |
| 13 | Goal Reverse Engineering | Must-have | "I want sub-3:30 marathon in 6 months" |
| 14 | Post-Run Auto Analysis | Must-have | Coach reviews your run before you open app |
| 15 | Dopamine Management | REMOVED | User decided to cut this |

### Contextual Factor Additions
- Headphones / no headphones
- Listening to: music, podcast, audiobook, nothing
- These go into the dynamic contextual factors system

### Scrutiny Critical Fixes Required
1. Add chat/conversation tables to schema
2. Add activity_notes, activity_weather, activity_context_factors tables
3. Define background processing strategy
4. Design auth strategy (including coach role)
5. Document Strava sync strategy
6. Extend embeddings to include user notes
7. Design context window management
8. Use HNSW index instead of IVFFlat

### Scope Clarification
- Running only for coaching/planning (track all activity types for load)
- Text-first for Phase 1, voice later
- Web app (Next.js) for Phase 1, native mobile later
- Auto-regulating training programs are a core feature, not a nice-to-have

---

## 2026-04-17 — Working Name + Journal Aesthetic

### Working Name: "Cadence"
- Temporary working title pending deeper brand exploration
- User will revisit naming closer to launch
- For now, all docs can reference "Cadence" in place of "Stride AI"
- Ember `#E94E1B` brand color retained regardless of final name
- Mascot direction deferred to final naming decision

### Design Decisions Locked
- Light mode primary, dark mode fully supported
- Journal aesthetic for chat surfaces only (Caveat handwriting font, cream parchment bg, warm ink colors)
- Clean data-dense aesthetic for dashboard, activity detail, plan calendar, settings
- Font stack: Inter (UI) + JetBrains Mono (numbers) + Caveat (journal)
- shadcn/ui foundation, Kokonut UI Pro for marketing/onboarding, custom for training components
- Recharts for data visualization
- Web-only for Phase 1-3, native iOS Phase 4
- Tab nav: web uses `Coach · Activities · Dashboard · Plan`, iOS uses `Coach · Run · Dashboard · Plan`

---

## 2026-04-16 — Post-Scrutiny v2 Fixes

### Conversation Visibility Decision
- **Individual AI coaching conversations** (`conversations` + `messages` tables): **PRIVATE to the athlete**. Coaches never see these.
- **Team chat** (`team_messages`): **PUBLIC team board**. All team members and coaches can see and post. This is like a group chat, not individual messaging.

### All Scrutiny v2 Fixes Applied
| Issue | Fix |
|-------|-----|
| HIGH-1: Table count typo | Fixed: 29 tables (was incorrectly 35) |
| HIGH-2: RLS policies incomplete | Fixed: Complete RLS for all 29 tables with helper functions |
| MEDIUM-1: Count discrepancy | Fixed in header |
| MEDIUM-2: Weather in Fahrenheit | Fixed: All weather stored in Celsius/metric, converted in app layer |
| MEDIUM-3: Context factor synonyms | Fixed: FK constraint + normalization note in architecture |
| MEDIUM-4: UX doc says voice-first | Fixed: Added phase clarification note to UX-PHILOSOPHY.md |
| MEDIUM-5: Workout matching unspecified | Fixed: Matching algorithm documented with confidence thresholds |
| LOW-1: Token encryption | Documented: plaintext Phase 1, pgcrypto encryption before Phase 3 launch |
| LOW-2: Race predictions unlinked | Fixed: Added training_plan_id FK to race_predictions |
| LOW-3: ACWR/CTL methodology | Fixed: Full methodology documented with formulas |
| LOW-4: Team invite expiry | Fixed: Added expires_at, max_uses, use_count to teams |
| NEW: Weather backfill | Documented: Open-Meteo archive API for historical activities |
| NEW: Phase 1 active/dormant | Documented: 19 active tables, 10 dormant in Phase 1 |
