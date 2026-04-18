# Data Visualization Playbook

> Which chart type to use for which data pattern. Defaults, colors, animation, empty states, performance rules.
> Chart library: **Recharts** (primary) with custom SVG/Canvas where needed.

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [Chart Type Decision Matrix](#2-chart-type-decision-matrix)
3. [Chart-by-Chart Reference](#3-chart-by-chart-reference)
4. [Colors & Themes](#4-colors--themes)
5. [Axes, Tooltips, Legends](#5-axes-tooltips-legends)
6. [Empty & Loading States](#6-empty--loading-states)
7. [Animation Rules](#7-animation-rules)
8. [Performance](#8-performance)
9. [Accessibility](#9-accessibility)

---

## 1. Philosophy

### Visualization Principles

1. **The chart IS a sentence** — Every chart answers a question. If you can't state the question in one line, don't build the chart.
2. **Show the answer first** — Hero metric + trend indicator, chart below if detail needed. Don't make users interpret a chart for something a sentence could say.
3. **Context before values** — Label axes, show units, include targets/benchmarks where useful.
4. **Zone color consistency** — HR zones, pace zones, workout types use the SAME colors from DESIGN-GUIDE.md. Always.
5. **No 3D charts. Ever.** — 3D distorts comparison. Flat, honest, useful.
6. **Small multiples over dashboard sprawl** — A grid of consistent small charts reads faster than many unique layouts.

### What Data Viz Is NOT For

- Vanity metrics with no action ("Total lifetime steps: 8,432,107")
- Data that's better as a sentence ("You ran 42 km this week, 8 more than last week")
- Marketing-grade fluff (no glowing animated gauges that don't communicate)

---

## 2. Chart Type Decision Matrix

| Question | Chart Type |
|----------|-----------|
| "How has X trended over time?" | **Line chart** |
| "How has X per [week/month/year] compared?" | **Bar chart** |
| "What's the breakdown of X across categories?" | **Pie/donut** (2-6 categories) or **Horizontal bars** (7+) |
| "How do X and Y relate?" | **Scatter plot** |
| "Where did X happen geographically?" | **Map** |
| "What's the value of X right now?" | **Big number** + sparkline + trend arrow |
| "Am I on track toward goal X?" | **Progress bar** or **Gauge** |
| "How did X vary within a single activity?" | **Area chart** (for stream data) |
| "How did several things vary over the same timeline?" | **Multi-line chart** |
| "How does [workout type / zone / time period] break down?" | **Stacked bar** or **100% stacked bar** |
| "What's the distribution of X values?" | **Histogram** (rare use) |

---

## 3. Chart-by-Chart Reference

### 3.1 Training Load Chart (Performance Management Chart)

**Question answered:** "Where am I in my fitness-fatigue cycle?"

**Chart type:** Multi-line chart
**Lines:**
- CTL (Chronic Training Load / Fitness) — thick, blue
- ATL (Acute Training Load / Fatigue) — medium, red
- TSB (Training Stress Balance / Form) — dashed, green

**X-axis:** Time (6 months default, range selector for 1M / 3M / 6M / 1Y / All)
**Y-axis:** Load value (0-100 typical)
**Interactions:**
- Hover shows date + all three values
- Today is highlighted with a vertical line
- Race days / goal events are labeled with small markers

**Additional features:**
- Shaded TSB band background (green tint when positive, red when negative)
- Legend always visible

**Recharts implementation:**
```tsx
<LineChart data={trainingLoadData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="ctl" stroke="#3B82F6" strokeWidth={2.5} dot={false} />
  <Line type="monotone" dataKey="atl" stroke="#EF4444" strokeWidth={2} dot={false} />
  <Line type="monotone" dataKey="tsb" stroke="#16A34A" strokeDasharray="5 5" dot={false} />
</LineChart>
```

---

### 3.2 Stream Chart (Activity-Level Time Series)

**Question answered:** "How did my HR/pace/elevation/power vary during this run?"

**Chart type:** Area chart (primary) or Line chart (for multi-series overlay)
**Data:** Per-second stream data from `activity_streams`

**Variants:**
- **Single stream** (e.g., just HR): Area chart with zone color bands in background
- **Multi-stream overlay** (HR + pace): Two lines, dual Y-axis
- **Stream + elevation**: Line for primary stream, subtle area chart for elevation

**Features:**
- Downsample to ~200 points for rendering (performance) — keep raw for tooltip
- Zone color bands in background (subtle, 10% opacity)
- Lap markers (vertical dashed lines) if structured workout
- Brush/zoom for selection
- Tooltip shows exact value at cursor position

**Performance rule:** For activities > 30 minutes, downsample. For < 30 minutes, render all points.

---

### 3.3 HR Zone Distribution

**Question answered:** "How much time did I spend in each HR zone?"

**Chart type:** Horizontal stacked bar (100%) or Vertical bar chart

**For single activity:** Stacked horizontal bar
```
Z1 [██         ] 12%
Z2 [    ████   ] 28%
Z3 [        █████ ] 40%
Z4 [             ██ ] 15%
Z5 [               █] 5%
```

**For weekly/monthly aggregate:** Bar chart by zone

**Colors:** Zone colors from design guide (always)
**Interactivity:** Hover shows duration + percentage

---

### 3.4 Weekly Volume Chart

**Question answered:** "How has my weekly mileage changed?"

**Chart type:** Bar chart
**X-axis:** Week (labeled by week start date or week number)
**Y-axis:** Distance (km or mi per user preference)

**Features:**
- Bars colored by actual vs target:
  - Green tint: hit or slightly exceeded target
  - Neutral: in target range
  - Amber tint: below target
- Target line overlay (from training plan, dashed)
- Hover: breakdown by sport type (stacked)
- 12 weeks default, expandable to 52 weeks

---

### 3.5 Training Distribution (Donut)

**Question answered:** "What's my training mix?"

**Chart type:** Donut (pie with inner hole)
**Segments:** Workout types (Easy, Tempo, Interval, Long, Race, Cross-train, Rest)
**Colors:** Workout type colors from design guide

**Features:**
- Center label: Total count OR total distance (toggleable)
- Hover on segment: exact count + percentage + distance
- Legend on right (desktop) or bottom (mobile)
- 2-8 segments max (combine smaller into "Other" beyond that)

---

### 3.6 Best Efforts Progression

**Question answered:** "Is my X distance time improving?"

**Chart type:** Line chart per distance
**X-axis:** Date
**Y-axis:** Time (in seconds, formatted as MM:SS)

**Variants:**
- **Single distance:** Line with scattered dots for individual efforts, highlighted line for PR trajectory
- **Multiple distances:** Small multiples (one chart per distance, same layout)

**Features:**
- Current PR shown as a horizontal reference line
- Race efforts marked with star icon
- Hover shows activity name + exact time + pace

---

### 3.7 Pace:HR Ratio Over Time

**Question answered:** "Is my aerobic fitness improving?"

**Chart type:** Line chart
**X-axis:** Time (weeks)
**Y-axis:** Pace at target HR (e.g., pace at 150 bpm)

**Rationale:** Lower pace at same HR = fitter. This is the decoupling / aerobic efficiency metric.

**Features:**
- Multiple HR targets as separate lines (pace at 140, 150, 160 bpm)
- Trend indicator (improving / stable / declining)

---

### 3.8 Running Route Map

**Question answered:** "Where did I run?"

**Library:** Mapbox GL JS or MapLibre GL JS (open source alternative)

**Variants:**
- **Activity detail map:** Full interactive with pan/zoom
- **Thumbnail:** 120x80 static polyline
- **Heatmap:** Frequently-run routes aggregated across activities

**Features:**
- Route polyline (brand color)
- Start marker (green circle)
- End marker (red circle)
- Mile/km markers every 1 unit
- Elevation color encoding (optional)
- Fullscreen mode

**Performance:** Use `map.polyline` (summary) for thumbnails, full stream only for interactive

---

### 3.9 Calendar Heatmap (Activity Density)

**Question answered:** "How consistent have I been?"

**Chart type:** Calendar heatmap (GitHub contributions style)
**X-axis:** Week columns
**Y-axis:** Day-of-week rows

**Colors:** Single hue ramp (neutral-200 to ember-500) based on activity count or distance

**Use case:** Annual view of consistency, streak detection

---

### 3.10 ACWR Gauge

**Question answered:** "Am I in the training sweet spot or risk zone?"

**Chart type:** Half-circle gauge
**Range:** 0.0 to 2.0
**Zones:**
- 0.0-0.8: Undertraining (blue)
- 0.8-1.3: Sweet spot (green)
- 1.3-1.5: Elevated (amber)
- 1.5+: High risk (red)

**Features:**
- Needle at current value
- Value number displayed below gauge
- Caption explains the current state ("Sweet spot — productive training")

---

### 3.11 Sparklines

**Purpose:** Tiny inline chart showing recent trend, next to a big number.

**When to use:** Hero metric cards on dashboard
**Height:** 24-40px
**Width:** Fills available space
**Lines:** Single line, no axes, no labels
**Optional:** First/last dot marker, min/max marker

```
VDOT
52.4  ↗  [sparkline showing upward trend]
```

---

### 3.12 Pacing Strategy Viz (Race Simulator)

**Question answered:** "How should I pace this race?"

**Chart type:** Line chart with course profile overlay
**X-axis:** Distance into race
**Y-axis (left):** Recommended pace
**Y-axis (right):** Course elevation
**Features:**
- Overlay recommended pace line and target-HR line
- Annotate aid stations / mile markers
- Show heat adjustment as pace variability band

---

## 4. Colors & Themes

### 4.1 Chart Color Rules

1. **Zone colors always match design system** — see DESIGN-GUIDE.md section 3.5
2. **Workout type colors always match design system** — see DESIGN-GUIDE.md section 3.5
3. **Brand color (Ember) used for user's primary series** — e.g., "your pace" or "your fitness"
4. **Neutrals for supporting data** — baselines, targets, peer comparisons
5. **Never use red for "bad"** alone — pair with shape/label for CVD

### 4.2 Multi-Series Palette (Non-Zone Data)

When you need distinct colors for multiple series that don't map to zones:

```
Series 1: #3B82F6 (blue)      — primary
Series 2: #10B981 (emerald)   — secondary
Series 3: #F59E0B (amber)     — tertiary
Series 4: #A855F7 (violet)    — quaternary
Series 5: #EC4899 (pink)      — fifth
Series 6: #14B8A6 (teal)      — sixth
```

These are perceptually distinct and colorblind-safe.

### 4.3 Dark Mode Chart Colors

All chart colors have dark mode variants in the design tokens. Charts respect the active theme — lines get brighter, backgrounds get darker, grid lines get dimmer.

### 4.4 Grid Lines & Backgrounds

- **Grid lines:** `--neutral-200` (light) / `--neutral-300` (dark), 1px solid, or dashed if dense
- **Chart background:** Same as card background (no separate color)
- **Axis lines:** `--neutral-300` (light) / `--neutral-400` (dark)

---

## 5. Axes, Tooltips, Legends

### 5.1 Axes

**Labels:**
- Always include units (km, mi, bpm, W, min/mi)
- Uppercase eyebrow style (tracking wide, small size): "DISTANCE (KM)"
- Axis title on the primary axis when needed

**Ticks:**
- Sensible defaults — no 7.3285 values, round to meaningful numbers
- Time axes: date format depends on range (Jan 15 / Week 12 / 2025)

**Gridlines:**
- Horizontal only (help read values)
- Vertical gridlines only when categorical data

### 5.2 Tooltips

**Appearance:**
- Card background with subtle shadow
- Rounded 6-8px corners
- 12px padding
- Small arrow pointing to data point

**Content:**
- Date/time (if time series)
- Value(s) with units
- Additional context (zone name, workout type) if meaningful

**Behavior:**
- Appear on hover with 50ms delay
- Follow cursor OR snap to nearest data point
- Dismiss on leave

**Example:**
```
Apr 14, 2026
HR: 168 bpm (Zone 3)
Pace: 6:28/mi
Lap: 3 of 6
```

### 5.3 Legends

**Position:**
- Right side on desktop (vertical list)
- Bottom on mobile (horizontal wrapping)

**Style:**
- Small color swatch (12px circle or square) + label
- Label matches series name exactly
- Value next to label where useful ("CTL (Fitness): 68")

**Interactive:**
- Click to toggle series visibility
- Hover to highlight series in chart (others fade to 40% opacity)

---

## 6. Empty & Loading States

### 6.1 Empty Chart

When no data available:
```
┌──────────────────────────────────────┐
│                                      │
│         [Icon: chart silhouette]     │
│                                      │
│     Complete a run to see this       │
│                                      │
└──────────────────────────────────────┘
```

Minimum: icon + one-line message.
Better: actionable CTA ("Log your first activity")

### 6.2 Loading Chart

Skeleton matching the final chart shape:
- Line chart: horizontal line skeleton with "ghost" data shape
- Bar chart: bars at varying heights, all gray
- Pie chart: gray circle placeholder with pulse

Pulse animation at 2s interval. Never show a spinner for a chart.

### 6.3 Error State

If the query or chart rendering fails:
```
┌──────────────────────────────────────┐
│  Couldn't load this chart            │
│  [Try again]                         │
└──────────────────────────────────────┘
```

---

## 7. Animation Rules

### 7.1 On Initial Render

**Allowed:**
- Lines "draw in" from left (300-500ms, ease-out)
- Bars "grow" from bottom (300-500ms, staggered 50ms per bar)
- Pie segments "sweep in" clockwise (300-500ms)

**Once, on load only.** Never re-animate on data updates.

### 7.2 On Data Update

**Allowed:**
- Values transition smoothly (200-300ms, ease-in-out)
- Line adjusts to new data with tween

**Not allowed:**
- Re-running the intro animation
- Flashing/bouncing indicators

### 7.3 On User Interaction

**Hover:**
- Series highlight: 150ms
- Tooltip appear/dismiss: 100ms
- Zoom/brush: 200ms

**Click:**
- Toggle series: 150ms fade

### 7.4 Reduced Motion

If user has `prefers-reduced-motion: reduce`:
- No intro animations
- No tween on data updates (snap to new values)
- Hover highlights still work (they're informational)

---

## 8. Performance

### 8.1 Data Point Limits

| Chart type | Max points before downsampling |
|-----------|--------------------------------|
| Line chart | 500 |
| Bar chart | 200 |
| Scatter plot | 1000 |
| Stream chart | 200 (raw kept for tooltips) |

### 8.2 Downsampling Strategy

**For time series (stream data):**
- Largest Triangle Three Buckets (LTTB) algorithm
- Preserves visual shape while reducing point count
- Keep raw data accessible for tooltip lookups

**For categorical data:**
- Aggregate smaller categories into "Other"
- Sort by value descending, show top N

### 8.3 Virtualization

For tables (splits, laps, activities list) with 100+ rows:
- Use virtualization (react-window or react-virtual)
- Only render visible rows

### 8.4 Lazy Loading

Charts below the fold should lazy-load:
- Use Intersection Observer
- Show skeleton until visible
- Start fetching data when 200px from viewport

---

## 9. Accessibility

### 9.1 Color Independence

Every chart must be usable WITHOUT color:
- **Lines:** Vary stroke patterns (solid, dashed, dotted) AND color
- **Bars:** Label each bar with its value; don't rely on color alone for category
- **Pie:** Always show percentage labels; never just colored slices

### 9.2 Text Alternatives

Every chart includes:
- **`aria-label`** describing the chart purpose
- **`role="img"`** or proper chart semantic element
- **Hidden data table** for screen readers (`aria-describedby` pointing to table)

Example:
```tsx
<div role="img" aria-label="Training load over last 6 months. Fitness trending upward, fatigue stable, form positive.">
  <Chart />
  <table className="sr-only" id="chart-data">
    {/* Data as table */}
  </table>
</div>
```

### 9.3 Keyboard Interaction

- Focusable chart container (tab to focus)
- Arrow keys navigate data points
- Enter/Space to activate selected point (show details)
- Escape to close tooltip
- Focus indicator on active point (2px ring, brand color)

### 9.4 Color Contrast for Chart Elements

- Line strokes: minimum 3:1 against background
- Text labels: minimum 4.5:1 against background
- Grid lines: minimum 2:1 (lower OK since grid is decorative)
- Interactive elements (dots, bars): minimum 3:1

### 9.5 Colorblind Testing

Every palette tested against:
- Protanopia (red-weak)
- Deuteranopia (green-weak)
- Tritanopia (blue-weak)

Tools: Stark (Figma plugin), Colorblinding (browser extension)

---

## 10. Chart Defaults (Recharts Config)

Canonical Recharts config to copy:

```tsx
// Shared defaults
const chartDefaults = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  strokeWidth: 2,
  fontSize: 12,
  fontFamily: 'Inter, sans-serif',
  gridColor: 'var(--neutral-200)',
  axisColor: 'var(--neutral-400)',
  textColor: 'var(--neutral-600)',
  tooltipBg: 'var(--neutral-0)',
  tooltipBorder: 'var(--neutral-200)',
  tooltipShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
};

// Tooltip styling
const tooltipStyle = {
  backgroundColor: chartDefaults.tooltipBg,
  border: `1px solid ${chartDefaults.tooltipBorder}`,
  borderRadius: 6,
  boxShadow: chartDefaults.tooltipShadow,
  padding: '8px 12px',
  fontSize: 12,
};
```

---

## 11. Chart Priority by Phase

| Chart | Phase 1 | Phase 2 | Phase 3 |
|-------|---------|---------|---------|
| Stream chart (single) | ✓ | | |
| Stream chart (multi) | | ✓ | |
| Weekly volume chart | ✓ | | |
| HR zone distribution | ✓ | | |
| Training distribution (donut) | ✓ | | |
| Best efforts progression | ✓ | | |
| Route map (thumbnail + interactive) | ✓ | | |
| Training load chart (CTL/ATL/TSB) | | ✓ | |
| ACWR gauge | | ✓ | |
| Pace:HR ratio chart | | ✓ | |
| Calendar heatmap | | | ✓ |
| Race pacing strategy viz | | | ✓ |
| Sparklines (everywhere) | ✓ | | |
