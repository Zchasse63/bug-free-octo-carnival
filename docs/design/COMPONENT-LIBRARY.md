# Component Library

> Every UI component in Stride AI cataloged with purpose, variants, states, and data sources.
> Built on shadcn/ui as the base — extended with training-specific components.

---

## Component Source Strategy

Stride AI uses a **three-tier component strategy**:

### Tier 1: shadcn/ui (Foundation)
The base for all primitives (Button, Input, Dialog, Card, etc.). Copy-paste, fully owned, easily customized. Covers 90% of what we need for the app itself.

### Tier 2: Kokonut UI Pro (Selective Use)
We have a Kokonut UI Pro subscription. Use for:
- **Landing page / marketing site** (Phase 2+) — heroes, pricing sections, testimonials, FAQ, footers, feature showcases
- **Onboarding flow polish** — sign-up/sign-in page designs, welcome screens
- **Selective app accents** — specific polished pieces like glass effect cards, animated loading indicators where they elevate beyond vanilla shadcn/ui

**Do NOT use Kokonut for:**
- Core app primitives (shadcn/ui is the foundation)
- Training-specific domain components (we build custom)
- Data visualization (Recharts is the choice)

Rule of thumb: If we're building something users will interact with daily during training, it's custom. If it's a marketing moment or a polished one-off screen, Kokonut is on the table.

### Tier 3: Custom (Training-Specific)
Built by us. Domain components that no generic library provides:
- ActivityCard, StreamChart, HRZoneBar
- TrainingLoadChart, ACWRGauge
- WorkoutBuilderCard, PlannedWorkoutPill
- ShoeRecommendationCard, GearCard
- And ~20 more (see Section 2)

These encode our specific domain knowledge. They're what makes Stride AI different from every other shadcn/ui-based app.

---

## How to Use This Document

For each component:
- **Purpose** — what problem it solves
- **Variants** — what flavors exist
- **States** — default, hover, active, disabled, loading, error, empty
- **Props** — key properties (not exhaustive, just the important ones)
- **Accessibility** — keyboard, screen reader, contrast
- **Data source** — which database tables/queries it reads from (for custom components)

---

## 1. Primitives (shadcn/ui base + extensions)

### 1.1 Button

**Purpose:** Trigger an action.

**Variants:**
- `primary` — Brand color (Ember), the main CTA. One per screen.
- `secondary` — Neutral background with border. Default action.
- `ghost` — No background, appears on hover. Low-emphasis actions.
- `destructive` — Red/danger variant for delete, cancel, etc.
- `link` — Styled as link text but is semantically a button.

**Sizes:**
- `sm` — 32px tall, 12px padding horizontal
- `md` (default) — 40px tall, 16px padding horizontal
- `lg` — 48px tall, 20px padding horizontal
- `icon` — Square, icon only

**States:** default, hover, active (pressed), focus-visible, disabled, loading (shows spinner, text hidden)

**Accessibility:** Proper button semantics, `aria-label` for icon-only, visible focus ring, disabled attribute sets aria-disabled

---

### 1.2 Input (Text Field)

**Purpose:** Single-line text entry.

**Variants:** text, email, password, number, search, url

**States:** default, focus, hover, disabled, error, success

**Props:** label, placeholder, helper text, error message, leading icon, trailing icon/button

**Accessibility:** Label always present (visible or floating), error message tied via `aria-describedby`

---

### 1.3 Textarea

**Purpose:** Multi-line text entry.

**Variants:** auto-resize, fixed-height

**States:** default, focus, disabled, error

**Props:** min rows, max rows, character count

**Used for:** Chat message composer, activity notes, workout descriptions

---

### 1.4 Select / Combobox

**Purpose:** Choose from a list of options.

**Variants:**
- `select` — Native-style dropdown
- `combobox` — Searchable, filterable dropdown
- `multi-select` — Select multiple values (chips-in-input)

**States:** default, open, disabled, error

**Used for:** Sport type picker, shoe assignment, unit system choice

---

### 1.5 Switch (Toggle)

**Purpose:** Binary on/off control.

**States:** off, on, disabled, focus

**Used for:** Settings toggles (dark mode, notifications, metric vs imperial)

---

### 1.6 Checkbox & Radio

**Purpose:** Multiple-choice (checkbox) or single-choice (radio) from a set.

**States:** unchecked, checked, indeterminate (checkbox only), disabled, focus

---

### 1.7 Dialog (Modal)

**Purpose:** Interrupt the user for focused input or confirmation.

**Variants:**
- `default` — Centered modal with title, content, actions
- `confirm` — Small modal for confirm/cancel actions
- `full-screen` — Takes over the full viewport (mobile-heavy modals)

**States:** closed, opening, open, closing

**Props:** title, description, children, onOpenChange, size

**Accessibility:** Focus trap, escape closes, click outside closes, `role="dialog"`, `aria-labelledby`, `aria-describedby`

---

### 1.8 Sheet (Side Panel)

**Purpose:** Slide-in overlay from an edge for secondary content.

**Variants:** left, right, top, bottom

**Used for:** Filter panel on dashboard, activity edit form, settings on mobile

---

### 1.9 Popover

**Purpose:** Floating content anchored to a trigger.

**Variants:** standard, compact, interactive (with form elements)

**Used for:** Info tooltips with more detail, date pickers, shoe role editor

---

### 1.10 Dropdown Menu

**Purpose:** List of actions or options anchored to a trigger.

**Variants:**
- `standard` — Actions list
- `with submenu` — Nested options
- `with keyboard shortcuts` — Shows hotkeys next to items

**Used for:** Profile menu, more-actions menu on cards

---

### 1.11 Tooltip

**Purpose:** Brief contextual info on hover/focus.

**States:** hidden, visible

**Rules:** Only for supplementary info (never critical info). Max 1 sentence. 500ms delay before showing.

---

### 1.12 Tabs

**Purpose:** Switch between related views.

**Variants:**
- `underline` — Line beneath the active tab (default)
- `pills` — Filled background on active
- `segmented` — Tab control look (iOS-style)

**Used for:** Activity detail tabs (Overview, Splits, Laps, Streams, Notes)

---

### 1.13 Accordion

**Purpose:** Collapsible sections for long content.

**Variants:** single (one open at a time), multi (multiple can be open)

**Used for:** FAQ on marketing, expanded plan details, optional fields in forms

---

### 1.14 Avatar

**Purpose:** Represent a person (athlete, coach, teammate).

**Variants:**
- `image` — Photo
- `initials` — Fallback with letters
- `icon` — Generic person icon (last-resort fallback)
- With status indicator (dot in corner)

**Sizes:** xs (20px), sm (28px), md (36px), lg (48px), xl (72px), 2xl (96px)

---

### 1.15 Badge

**Purpose:** Small status label or count.

**Variants:**
- `default` — Neutral
- `primary` — Brand color
- `success`, `warning`, `danger`, `info` — Semantic
- `zone-*` — Zone colors (recovery, aerobic, tempo, threshold, vo2max)
- `workout-*` — Workout type colors

**Used for:** Activity type labels, zone indicators, count pills, PR badges

---

### 1.16 Card

**Purpose:** Contained unit of content.

**Variants:**
- `default` — Subtle border, no shadow
- `elevated` — Subtle shadow, hover lifts
- `interactive` — Clickable, cursor pointer, slight hover effect
- `outlined` — No background fill, border only

**Anatomy:** header, body, footer (all optional)

---

### 1.17 Separator

**Purpose:** Visual divider between sections.

**Variants:** horizontal, vertical, with label ("OR", "2024", etc.)

---

### 1.18 Toast

**Purpose:** Brief non-blocking notification.

**Variants:**
- `default` — Neutral
- `success` — Green
- `warning` — Amber
- `danger` — Red
- `info` — Blue

**Behavior:**
- Appears bottom-right (desktop) or top (mobile)
- Auto-dismiss after 5s (8s for errors, never for persistent)
- Stack max 3, older ones fade out
- Action button optional (e.g., "Undo")

---

### 1.19 Alert (Inline Banner)

**Purpose:** Important inline message (not dismissible like toast).

**Variants:** info, success, warning, danger

**Used for:** Rate limit warnings, sync errors, important coach messages that need user action

---

### 1.20 Skeleton

**Purpose:** Loading placeholder showing content structure.

**Variants:** text, circle, rectangle

**Rules:** Match the shape/size of the eventual content. Pulse animation at 2s duration.

---

### 1.21 Spinner

**Purpose:** Indicate loading with no known progress.

**Sizes:** sm (16px), md (24px), lg (32px)

**Rules:** Only when load time is unknown. For known progress, use progress bar.

---

### 1.22 Progress Bar

**Purpose:** Show progress toward completion.

**Variants:**
- `linear` — Horizontal bar
- `circular` — Radial (for score-style displays)

**States:** indeterminate (animating stripes), determinate (fixed %), complete (full, may animate to green)

**Used for:** Sync progress, plan progress, week completion

---

### 1.23 Table

**Purpose:** Tabular data display.

**Variants:**
- `default` — Clean rows with separator
- `striped` — Alternating row colors
- `dense` — Compact vertical padding
- `sortable` — Column headers clickable to sort

**Accessibility:** Proper `th`, `scope`, caption, `aria-sort` on sortable columns

**Used for:** Splits, laps, best efforts, PR tables, gear list

---

## 2. Training-Specific Components

These are custom components built on primitives, specific to our domain.

### 2.1 ActivityCard

**Purpose:** Compact summary of a single activity for feeds, lists, chat.

**Variants:**
- `feed` — Full width, map + metrics + name
- `compact` — Text-only for chat messages
- `hero` — Featured/expanded for dashboard top slot

**Anatomy:**
- Polyline map thumbnail (left or top)
- Activity name + date/time
- Sport type badge
- Key metrics: distance, moving time, pace, HR
- Workout classification badge (Easy, Tempo, Long Run, etc.)
- Kudos/comment counts (optional)
- Weather badge (optional)

**States:** default, hover (slight lift), loading (skeleton), missing map (gray placeholder), indoor activity (no map, icon instead)

**Data source:** `activities` table + `activity_weather` (optional)

**Layout:**
```
┌─────────────────────────────────────────────┐
│ [Map]   Tuesday Morning Run                 │
│         Apr 14, 2026 · 6:36 AM              │
│                                             │
│         6.93 km  ·  28:51  ·  6:28/mi       │
│         172 avg HR  ·  395W  ·  tempo       │
│                                             │
│         [workout:interval] [kudos: 12]      │
└─────────────────────────────────────────────┘
```

---

### 2.2 ActivityMap

**Purpose:** Render the GPS track for an activity.

**Variants:**
- `thumbnail` — 120x80px static polyline (card previews)
- `interactive` — Full map with pan/zoom, Mapbox or MapLibre
- `stripped-down` — Just the polyline shape, no basemap (for performance)

**Features:**
- Start marker (green circle)
- End marker (red circle)
- Split markers (small dots, optional)
- Elevation color encoding (optional)

**Accessibility:** Textual alternative showing summary stats, keyboard pan/zoom, `aria-label` describing the route

**Data source:** `activities.map_polyline` or `activity_streams.latlng_data`

---

### 2.3 PaceBadge

**Purpose:** Display a pace value with zone color coding.

**Anatomy:**
```
7:12/mi
```
With background color matching the corresponding pace zone.

**Variants:**
- `inline` — Within body text
- `pill` — Standalone with rounded background
- `large` — Hero display size

**Accessibility:** Includes zone name in `aria-label` ("7:12/mi, threshold pace")

---

### 2.4 HRZoneBar

**Purpose:** Horizontal stacked bar showing time in each HR zone.

**Anatomy:**
```
┌────────────────────────────────┐
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░ │ Z1 12%
│ ░░░░████████░░░░░░░░░░░░░░░░░░ │ Z2 28%
│ ░░░░░░░░░░░░██████████████░░░░ │ Z3 40%
│ ░░░░░░░░░░░░░░░░░░░░░░░░██████ │ Z4 15%
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ Z5 5%
└────────────────────────────────┘
```

**Variants:**
- `stacked` — One row, all zones stacked
- `segmented` — Multiple rows, one per zone (shown above)
- `compact` — Inline in activity cards

**Data source:** Derived from `activity_streams.heartrate_data` + `athlete_zones.hr_zones`

---

### 2.5 StreamChart

**Purpose:** Line chart of a stream value (HR, pace, elevation, power) over time or distance.

**Variants:**
- `single` — One stream only (e.g., just HR)
- `multi` — Multiple streams overlaid (HR + pace, HR + elevation)
- `with-laps` — Vertical lines at lap boundaries

**Features:**
- Hover tooltip with values at point
- Brush selection to zoom
- Zone color bands in background (optional)
- Smoothing toggle

**Performance:** For 1800+ data points, downsample to ~200 points for display, keep raw for tooltip queries

**Data source:** `activity_streams` table

---

### 2.6 SplitsTable

**Purpose:** Per-mile or per-km split breakdown.

**Columns:** Split #, Distance, Time, Pace, GAP, Avg HR, Elevation Δ

**Features:**
- Pace color-coded by zone
- Fastest split highlighted (subtle)
- Slowest split highlighted if significantly slower (HR drift indicator)
- Toggle between km and mi

**Data source:** `activity_splits`

---

### 2.7 LapsTable

**Purpose:** Lap-by-lap breakdown for structured workouts.

**Columns:** Lap #, Distance, Time, Pace, Avg HR, Max HR, Avg Cadence

**Features:**
- Work/rest lap distinction (different row styling)
- "Interval" sets identified if pattern detected

**Data source:** `activity_laps`

---

### 2.8 TrainingLoadChart

**Purpose:** Display CTL (fitness), ATL (fatigue), TSB (form) over time — the "Performance Management Chart."

**Anatomy:**
- X-axis: Time (weeks/months)
- Y-axis: Load value
- Three lines: CTL (blue, thick), ATL (red, thin), TSB (green, dashed)
- Today marker (vertical line)
- Annotations for events (races, injuries, key workouts)

**Features:**
- Hover shows date + all three values
- Range selector (1M / 3M / 6M / 1Y / All)
- Shaded TSB background (positive = green tint, negative = red tint)

**Data source:** Computed from `weekly_summaries` + `activities.training_load`

---

### 2.9 ACWRGauge

**Purpose:** Display acute:chronic workload ratio as a gauge with sweet-spot indicator.

**Anatomy:**
- Semi-circular gauge from 0 to 2.0
- Sweet spot band (0.8 - 1.3) in green
- Caution zone (1.3 - 1.5) in amber
- Danger zone (>1.5) in red
- Current value as needle + number display

**Data source:** `weekly_summaries.acwr`

---

### 2.10 VDOTIndicator

**Purpose:** Display current VDOT with trend arrow.

**Anatomy:**
```
VDOT
52.4  ↗ +1.2 this month
```

**Variants:**
- `compact` — Inline
- `featured` — Dashboard hero card with sparkline

**Data source:** `athlete_zones.estimated_vdot` (most recent)

---

### 2.11 PRProgressList

**Purpose:** List of best efforts with recent trend.

**Rows:**
| Distance | Current PR | Date | Trend (6mo) |
|----------|-----------|------|-------------|
| 400m | 1:23 | Apr 14 | ↘ Improving |
| 1 mile | 6:22 | Apr 14 | ↘ Improving |
| 5K | 20:30 | Apr 14 | → Stable |
| 10K | 43:12 | Nov 22 | ↗ Slower |

**Data source:** `best_efforts` with `pr_rank = 1`, compared against historical data

---

### 2.12 WorkoutDistributionChart

**Purpose:** Pie/donut chart showing proportion of workout types over a period.

**Features:**
- Workout type colors match everywhere else
- Center label shows total count or total distance
- Hover shows exact values
- Toggleable: count vs distance vs time

**Data source:** Derived from `activities.workout_classification`

---

### 2.13 WeeklyVolumeChart

**Purpose:** Bar chart of weekly distance over time, with optional target line.

**Features:**
- One bar per week
- Target line overlay (from training plan)
- Bars colored by actual vs target (on-track vs over/under)
- Hover shows breakdown by sport type

**Data source:** `weekly_summaries.run_distance_meters` + `training_plans.plan_config`

---

### 2.14 BestEffortsTable

**Purpose:** Table of current PRs + recent best times for standard distances.

**Columns:** Distance, Current PR, Date, Last 5 efforts (sparkline)

**Data source:** `best_efforts`

---

### 2.15 GearCard

**Purpose:** Display a shoe or piece of equipment.

**Anatomy:**
- Shoe icon or photo
- Name (Brand + Model)
- Distance logged
- Mileage bar (visual progress against expected lifespan)
- Roles (chips: Easy, Long, Tempo, Race)
- Status: Active / Retired / Worn (based on pace drift detection)

**Variants:**
- `compact` — Used inline in activity cards
- `detailed` — Used in gear list

**Data source:** `gear` table

---

### 2.16 WeatherBadge

**Purpose:** Display weather conditions at run time.

**Anatomy:**
```
[icon] 72°F · 68% humidity · light breeze
```

**Variants:**
- `inline` — Single line
- `detailed` — Multi-line with icon + conditions
- `heat-warning` — Emphasized if high heat/humidity impacted performance

**Data source:** `activity_weather`

---

### 2.17 ShoeRecommendationCard

**Purpose:** "For today's run, wear these" recommendation.

**Anatomy:**
- Shoe name + photo/icon
- Confidence indicator ("Strong match" / "Good match" / "Available")
- Rationale text: "Your easy runs are 15s/mi slower in these than the Pegasus — great for today's easy pace."

**States:** recommendation ready, no clear match, no shoes tracked yet

**Data source:** `gear` + `activities` (correlation query)

---

### 2.18 InjuryRiskIndicator

**Purpose:** Traffic-light style indicator of current injury risk.

**Anatomy:**
```
● Low Risk    (green)
● Moderate    (amber)
● High        (red, with "Let's dial back" CTA)
```

**Factors surfaced on hover/click:** ACWR, recent volume ramp, sleep trend, consecutive hard days

**Data source:** `weekly_summaries.injury_risk_level` + factors

---

### 2.19 RaceCountdown

**Purpose:** Days-to-goal-race display with fitness trajectory.

**Anatomy:**
```
Tampa Bay Marathon
23 days away

Fitness: 68 (CTL)    ↗ On track
Target: 72           Taper begins in 5 days
```

**States:** far out (>60 days), building (30-60), taper window (10-30), race week (<10)

**Data source:** `training_plans.goal_race_date` + `monthly_summaries.fitness_score`

---

### 2.20 MessageBubble

**Purpose:** Single chat message display.

**Variants:**
- `user` — Right-aligned, subtle background
- `coach` — Left-aligned with avatar
- `system` — Centered, small text (e.g., "Synced 3 new activities")
- `proactive` — Coach message with special icon/treatment (AI-initiated)

**Features:**
- Markdown rendering
- Embedded rich content (activity cards, workout proposals, charts)
- Hover shows timestamp
- Long-press/right-click menu (copy, bookmark, share)
- Coach messages stream (typing cursor)

**Data source:** `messages` table

---

### 2.21 ProactiveInsightCard

**Purpose:** AI-generated insight delivered as a card (not a chat message).

**Variants:**
- `achievement` — Positive (PR, streak milestone)
- `observation` — Neutral (pattern detected)
- `warning` — Caution (rising load, overtraining signal)
- `recommendation` — Suggestion (try a feel run, swap shoes)

**Anatomy:**
- Icon (matching severity)
- Title (single line)
- Body (2-3 sentences)
- Actions (dismiss, bookmark, discuss with coach)

**Data source:** `ai_insights`

---

### 2.22 WorkoutBuilderCard

**Purpose:** Preview a structured workout (from NL builder or plan).

**Anatomy:**
```
┌─ Workout: Threshold Intervals ──────┐
│ Total: 10 km · 50 min (estimated)   │
├─────────────────────────────────────┤
│ 1.5 km Easy warmup                  │
│ 4 × [1.5 km @ T pace, 90s jog]      │
│ 1.5 km Easy cooldown                │
├─────────────────────────────────────┤
│ [Save to Plan]  [Edit]  [Cancel]    │
└─────────────────────────────────────┘
```

**Variants:**
- `preview` — In chat response
- `detail` — Standalone workout view
- `executing` — During-run mode (future)

**Data source:** `planned_workouts.structure` (JSONB)

---

### 2.23 PlannedWorkoutPill

**Purpose:** Compact representation of a planned workout in calendar view.

**Anatomy:**
```
[T] 10K @ 7:30  ✓
[E] 6K easy     ✓
[I] Track work  ↑
[L] 22K long    ○
```

Letter prefix = workout type. Status indicator on right: ✓ completed as planned, ↑ harder, ↓ easier, ○ upcoming, ✕ missed.

**Data source:** `planned_workouts` + matched `activities`

---

### 2.24 TeamMemberActivity

**Purpose:** Activity from a teammate in the team feed.

**Anatomy:**
- Avatar + name
- Activity summary (condensed ActivityCard)
- Reactions (clap, fire emoji, etc.)
- Comment button

**Data source:** `activities` via team visibility + `team_messages`

---

### 2.25 NakedRunBanner

**Purpose:** Indicator that an activity was an intentional feel run (no metrics watched during).

**Anatomy:**
```
[icon: eye-off] Feel run — no metrics tracked during
```

**Treatment:** Muted color scheme, no pace/HR emphasis in card. Coach messages treat this as INTENTIONAL, not incomplete.

**Data source:** `activities.workout_classification = 'feel_run'`

---

### 2.26 ContextFactorChip

**Purpose:** Tag showing a contextual factor from the run (shoe, weather, sleep, gear, emotion, etc.).

**Variants:**
- By category (gear, clothing, pre_run, during_run, post_run, custom)
- Each category has a distinct subtle color

**Anatomy:**
```
[icon] Low sleep (4.5hrs)
[icon] New shoes (Endorphin Pro)
[icon] Ran with podcast
```

**Data source:** `activity_context_factors`

---

## 3. Layout Components

### 3.1 AppShell

**Purpose:** The overall app frame — header, tab nav, main content area.

**Platform note:** Tab nav differs — web uses `Coach · Activities · Dashboard · Plan`; iOS uses `Coach · Run · Dashboard · Plan`. See `SCREENS.md` section 0 for platform differences.

**Anatomy (mobile):**
```
┌──────────────────────┐
│    [Logo]  [Menu]    │ ← Header (56px)
├──────────────────────┤
│                      │
│    Main content      │
│                      │
├──────────────────────┤
│ [C] [R] [D] [P]      │ ← Tab bar (64px)
└──────────────────────┘
```

**Anatomy (desktop):**
```
┌──────────┬───────────────────────────┐
│          │  [Logo]             [Menu]│
│ Sidebar  ├───────────────────────────┤
│          │                           │
│ Coach    │     Main content          │
│ Run      │                           │
│ Dash     │                           │
│ Plan     │                           │
│          │                           │
└──────────┴───────────────────────────┘
```

---

### 3.2 ChatLayout

**Purpose:** Chat interface container with history + composer.

**Anatomy:**
```
┌──────────────────────────────────┐
│  Conversation title    [Options] │
├──────────────────────────────────┤
│                                  │
│  [Message]                       │
│                                  │
│                       [Message]  │
│                                  │
│  [Activity card]                 │
│                                  │
│  [Message streaming...]          │
│                                  │
├──────────────────────────────────┤
│  [🎤] [Input field...]    [Send] │
└──────────────────────────────────┘
```

---

### 3.3 DashboardGrid

**Purpose:** Responsive widget grid for dashboard.

**Behavior:**
- Desktop: 3-column grid, widgets span 1-3 cols
- Tablet: 2-column grid
- Mobile: Single column, stacked

Widgets are self-contained cards that know their own minimum and preferred dimensions.

---

### 3.4 ActivityDetailLayout

**Purpose:** Structure for the activity detail page.

**Anatomy:**
- Hero section (map + key metrics)
- Tabs (Overview, Splits, Laps, Streams, Notes)
- AI analysis section (coach message)
- Comments / social section (later)

---

### 3.5 PlanCalendar

**Purpose:** Calendar grid for training plan.

**Variants:**
- `week` — 7 days across (default on mobile)
- `month` — Traditional calendar grid
- `list` — Linear list of upcoming workouts (accessibility fallback)

**Features:**
- Planned workout pills in each day
- Today highlighted
- Drag-and-drop to reschedule (desktop)
- Click to see workout detail

---

## 4. State Patterns

### 4.1 Empty States

**Rule:** Never show a blank screen. Every "nothing yet" state has:
- Icon or subtle illustration
- Headline (one sentence)
- Body text (two sentences max)
- Primary CTA if user can do something

**Examples:**
- Empty activity feed: "No runs yet. Connect Strava or upload a file to get started."
- Empty training plan: "Let's build your plan. Tell me about your goal race."
- Empty conversations: "This is your coach. Say hi or ask about your training."

### 4.2 Loading States

**Rule:** Use skeletons when you know the content shape. Use spinners when you don't.

**Page load:** Skeleton matching final layout
**Data refresh within page:** Subtle loading indicator, don't block the UI
**Chat message streaming:** Typing cursor
**Chart loading:** Skeleton with axis labels visible

### 4.3 Error States

**Types:**
- **Network error** — "Can't reach the server. Retry?" with retry button
- **Data error** — "Something went wrong loading this. [Reload]"
- **Permission error** — "You don't have access to this." with contact link
- **Partial error** — Show what loaded, indicate what failed inline

**Rule:** Always offer a path forward (retry, go back, contact support).

---

## 5. Component Priority for Phase 1

### Build First (Phase 1 MVP)
- All primitives except multi-select, combobox (can use select)
- MessageBubble, ActivityCard, ActivityMap (thumbnail only), PaceBadge
- HRZoneBar, StreamChart (single), SplitsTable, LapsTable
- WeeklyVolumeChart, PRProgressList, VDOTIndicator
- AppShell, ChatLayout, ActivityDetailLayout
- All state patterns (empty, loading, error)

### Build Later (Phase 2+)
- TrainingLoadChart, ACWRGauge, InjuryRiskIndicator
- WorkoutBuilderCard, PlannedWorkoutPill, PlanCalendar
- ShoeRecommendationCard, GearCard (detailed)
- ProactiveInsightCard
- BestEffortsTable, WorkoutDistributionChart

### Build Phase 3
- TeamMemberActivity
- NakedRunBanner
- ContextFactorChip
- DashboardGrid (full version)

---

## 6. Component Checklist (For Each)

Before considering a component "done":
- [ ] All variants documented
- [ ] All states designed and implemented
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Works in light AND dark mode
- [ ] Reduced motion respected
- [ ] Responsive (mobile to desktop)
- [ ] Storybook entry (when Storybook is added)
- [ ] Unit tests for interactive behavior
