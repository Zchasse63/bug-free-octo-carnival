# Design System & UI/UX Build Plan

> Plan for creating the complete design system and UI/UX for the Stride AI web app.
> Started: 2026-04-16

---

## Scope

Complete design system and interactive prototypes for the entire Stride AI web application (Phase 1-3 features). This precedes implementation — the goal is to have the visual and interaction design locked before writing production code.

**What this includes:**
- Deep competitive research across athletic dashboards, AI chat UIs, and design systems
- Complete design system: principles, colors, typography, spacing, motion, accessibility
- Component library: every UI component cataloged with variants, states, and data sources
- Screen inventory with wireframes for every screen
- Data visualization playbook defining chart type per data pattern
- Five interactive HTML prototypes of hero screens

**What this does NOT include:**
- iOS app design (deferred to Phase 4)
- Logo design (direction proposed only, execution later)
- Production code (this is design, not implementation)
- Marketing site (out of scope)

---

## Design Principles (Baseline)

These will be refined in DESIGN-GUIDE.md but set the tone:

1. **Light mode primary, dark mode secondary** — default to light, dark mode fully supported but not the hero experience
2. **Chat is the hero** — every other screen supports the conversation
3. **Numbers are the content** — tabular figures, monospace for times/paces, legible at a glance
4. **Athletic but restrained** — no bro-y gradients, no fitness-neon
5. **Show the why, not just the what** — data needs context, not just values
6. **Mobile-first responsive** — design for 375px, scale up
7. **Accessibility is not optional** — WCAG 2.1 AA minimum

---

## Phases

### Phase 1: Research (45-60 min)
**Goal:** Understand what works and what doesn't in athletic and AI-coaching UIs.

**Actions:**
1. Firecrawl scrape the following 15 sources in parallel:
   - Athletic dashboards: Strava web, Runna, Whoop web, Oura web, TrainingPeaks, Garmin Connect, Intervals.icu, Final Surge
   - AI chat UIs: Claude.ai, ChatGPT web, Perplexity, Linear
   - Design system references: Vercel Dashboard, Superhuman, shadcn/ui gallery
2. Save raw scrapes to `.firecrawl/design-research/` (gitignored)
3. Synthesize findings into `docs/design/COMPETITIVE-DESIGN-ANALYSIS.md`

**Output:** COMPETITIVE-DESIGN-ANALYSIS.md

---

### Phase 2: Design System Documentation (60-90 min)
**Goal:** Every design decision documented with rationale.

**Actions:**
1. Write `docs/design/DESIGN-GUIDE.md` covering:
   - A. Design Principles (6-10 principles)
   - B. Brand + Visual Identity (name options, logo direction, voice)
   - C. Color System (light mode primary + dark mode, HR zones, pace zones, semantic colors)
   - D. Typography (font families, scale, numerical typography rules)
   - E. Spacing + Layout (base unit, scale, grid, breakpoints)
   - F. Iconography (Lucide base + custom training icons list)
   - G. Motion + Interaction (easing, duration, when/when-not-to-animate)
   - H. Accessibility (WCAG 2.1 AA minimum, color contrast, keyboard nav)

**Output:** DESIGN-GUIDE.md

---

### Phase 3: Component Library Specification (60-90 min)
**Goal:** Every UI component needed is documented.

**Actions:**
1. Write `docs/design/COMPONENT-LIBRARY.md` grouping:
   - Primitives (shadcn/ui base + extensions)
   - Training-specific components (ActivityCard, StreamChart, HRZoneBar, etc.)
   - Layout components (AppShell, ChatLayout, DashboardGrid, etc.)
2. For each component: purpose, variants, props, states, accessibility notes, data source reference

**Output:** COMPONENT-LIBRARY.md

---

### Phase 4: Screen Inventory + Wireframes (45-60 min)
**Goal:** Every screen in the app is inventoried and wireframed.

**Actions:**
1. Write `docs/design/SCREENS.md` covering:
   - Authentication flow screens
   - Onboarding flow screens (Phase 2)
   - Primary tabs (Coach, Run, Dashboard, Plan)
   - Secondary screens (Activity Detail, Settings, Gear, Team, Coach Portal)
   - Modals/overlays (Workout Builder, Add Note, File Upload, etc.)
2. Each screen: purpose, user goal, components used, info hierarchy, interaction patterns, edge states, responsive behavior, ASCII wireframe

**Output:** SCREENS.md

---

### Phase 5: Data Visualization Playbook (30-45 min)
**Goal:** Define which chart type to use for which data pattern.

**Actions:**
1. Write `docs/design/DATA-VIZ-GUIDE.md` covering:
   - Chart type decisions (trend, distribution, comparison, relationship, geographic)
   - Defaults (axes, tooltips, legends, colors, empty states)
   - Animation rules
   - Training-specific viz patterns (HR zones, pace zones, training load, ACWR)

**Output:** DATA-VIZ-GUIDE.md

---

### Phase 6: Interactive Prototypes (90-120 min)
**Goal:** Five runnable HTML prototypes proving the design works.

**Actions:**
1. Build `docs/design/prototypes/coach-chat.html` — AI chat with realistic conversation, inline activity cards, streaming effect, proactive insights
2. Build `docs/design/prototypes/dashboard.html` — full widget grid with 6 months of mock data
3. Build `docs/design/prototypes/activity-detail.html` — map placeholder, streams chart, splits table, AI analysis, user notes
4. Build `docs/design/prototypes/training-plan.html` — week view with planned workouts, completed activities, deviation indicators
5. Build `docs/design/prototypes/onboarding.html` — data source choice + questionnaire chat

**Constraints:**
- Tailwind via CDN, no build step
- Lucide icons via CDN
- Charts via Recharts CDN or vanilla SVG
- Light/dark mode toggle on every prototype (light primary)
- Self-contained — open in browser and it works

**Output:** 5 HTML files

---

### Phase 7: Docs Updates (15 min)
**Goal:** Design docs discoverable from main docs index.

**Actions:**
1. Create `docs/design/README.md` — index of design docs
2. Update `docs/README.md` — add Design section linking to design docs

**Output:** Updated README files

---

## Execution Strategy

- Sequential phases — each builds on the last
- Research (Phase 1) blocks everything else — do it first
- Phases 2-5 can use parallel agents if context space tightens
- Phase 6 (prototypes) must be done carefully by the main agent for coherence
- Use TodoWrite for visible progress tracking
- Report back to Zach after Phase 6 with summary + items needing approval

---

## Report-Back Format

At completion:
- Summary of design principles chosen
- Chosen color palette (light + dark with hex values)
- Chosen typography stack
- Proposed product name + 2 alternatives
- List of 5 prototypes built
- Decisions needing Zach's approval
- Assumptions to sanity-check
