# UX Rebrand — 2026-04-20

Plain-English labels for the five jargon metrics + a new History page.

## Why

An experienced runner (20 years in fitness, ex-competitive) bounced off
the dashboard because every headline number — CTL, ATL, TSB, VDOT,
ACWR — was opaque. The raw values compounded the problem: `51.2` has
no scale; `-18` has no sign convention; `1.08` has no anchor. The fix
was two-fold: rename every jargon token, and replace raw numbers with
**labels, trends, and verdicts** that parse in under a second.

## Renaming (UI only — DB columns, types, API contracts untouched)

| Was (technical) | Now (user-facing) | Representation |
|---|---|---|
| CTL  | **Fitness**        | Band label (Beginner / Recreational / Trained / Advanced / Highly trained) + `↑ +X.X vs 4 weeks` trend. Raw number demoted to subtitle. |
| ATL  | **Fatigue**        | Level label (Low / Moderate / High), computed relative to Fitness. Raw number hidden by default. |
| TSB  | **Freshness**      | Verdict phrase (Overreaching / Productively tired / Holding steady / Race-ready / Very fresh) + horizontal scale bar with athlete's dot. Raw `-18` shown as small "balance" subtitle. |
| VDOT | **Running score**  | Band label (Beginner / Recreational / Competitive / Advanced / Elite) + predicted 5K time. Raw number shown as small subtitle. |
| ACWR | **Injury risk**    | Existing colored pill (optimal / elevated / high). Raw 1.08 hidden. |

### Bands

**Running score (VDOT):**
- `< 35` Beginner
- `35-45` Recreational
- `45-55` Competitive
- `55-65` Advanced
- `65+` Elite

**Fitness (CTL):**
- `< 30` Beginner
- `30-50` Recreational
- `50-70` Trained
- `70-90` Advanced
- `90+` Highly trained

**Fatigue (ATL), relative to Fitness:**
- `ATL < CTL × 0.8` Low
- `ATL > CTL × 1.2` High
- else Moderate

**Freshness (TSB):**
- `<= -30` Overreaching
- `-30 to -10` Productively tired
- `-10 to +10` Holding steady
- `+10 to +25` Race-ready
- `> +25` Very fresh

## Surfaces touched

1. **Dashboard hero + tiles** (`app/dashboard/page.tsx`) — plain-English
   copy, label-first metric row, Freshness tile with scale bar.
2. **Training-load chart** (`components/charts/training-load-chart.tsx`)
   — legend + data keys renamed Fitness / Fatigue / Freshness.
3. **Community percentile card** (`app/insights/community/page.tsx`) —
   "Your VDOT" → "Your running score".
4. **Goal analyzer** (`components/goal-analyzer.tsx`) — "Target VDOT" +
   "Target paces at VDOT X" → "Target running score" + "Target paces at
   running score X".
5. **Plan subroute subtitles** (`app/plan/goal/page.tsx`,
   `app/plan/race-sim/page.tsx`) — descriptions rewritten.
6. **Settings / maintenance** (`components/settings/data-actions.tsx`) —
   "Recompute VDOT" → "Recompute running score"; "Recompute training
   load" → "Recompute fitness & weekly totals".
7. **Coach chat LLM snapshot** (`lib/ai/cohesive-context.ts`) — `#
   CURRENT STATE` block uses new vocabulary (technical abbreviations
   kept in parens as grounding for the model); added a `VOCABULARY:`
   directive so Claude replies in plain English.

### New components

- `components/freshness-scale.tsx` — horizontal gradient bar
  (red → amber → gray → emerald → green) with saffron dot plotted at
  the athlete's TSB-derived position.
- `lib/analytics/labels.ts` — band/level functions + race-time
  predictions + trend helpers.

### Removed

- Legacy route folders that regenerated under the worktree
  (`app/goal`, `app/race-sim`, `app/community`, `app/coach-portal`,
  `app/routes`, `app/tools`, `app/workout-builder`). All redirects are
  centralized in `next.config.ts`.

## New page: `/insights/history`

Added as a third tab in the Insights section (Analysis · History ·
Community).

### Sections

1. **Career overview** — runs, total distance, moving time, elevation,
   runs longer than marathon distance, years active. Derived from a
   paginated scan of `activities`.
2. **Fitness over time** — weekly Fitness curve across the athlete's
   full history, re-derived as a 6-week EMA over `weekly_summaries.
   total_training_load`.
3. **Monthly running distance** — last 36 months, bar chart.
4. **Pace progression** — fastest per-quarter pace at 5K / 10K / HM,
   pulled from `best_efforts`. Multi-line chart with reversed Y axis
   (lower line = faster).
5. **Aerobic efficiency** — avg HR on easy runs (3 km+, pace between
   300-600 s/km, excluding race/tempo/threshold/interval classifications),
   by month. Single red line; pace shown in tooltip.
6. **Personal records** — best time at 1 mi / 5K / 10K / HM / Marathon
   from `best_efforts`, linked to source activity.
7. **When you run best** — time-of-day buckets (Early morning / Morning
   / Midday / Afternoon / Evening), avg pace + HR + run count. Leads
   with a one-line verdict ("You run fastest in the evening…").
8. **Favorite routes** — top 5 clusters by start-coordinate rounding,
   same approach as `/activities/routes`.
9. **Milestones** — first run, first 10K / HM / Marathon distance,
   longest run, biggest training week. Timeline with saffron dots.

### Implementation

- `lib/analytics/history.ts` — nine read-only aggregation queries, all
  paginate through Supabase's 1000-row cap.
- `components/charts/history-charts.tsx` — FitnessCurveChart (Area),
  MonthlyVolumeChart (Bar), PaceProgressionChart (multi-Line with
  reversed pace Y axis), HrEfficiencyChart (single Line).
- All four charts use the `height={224} debounce={1}` pattern from the
  earlier Recharts fix. Zero console warnings.
- Honors `measurement_preference` for distance + elevation across the
  whole page.

## Verification

- `qa-api.ts`: **29/29 passing** against live.
- Dashboard console: **0 errors, 0 warnings**.
- Grep for any of `CTL|ATL|TSB|VDOT|ACWR` in the rendered HTML of
  `/dashboard`, `/activities`, `/insights`, `/insights/community`,
  `/insights/history`, `/plan/race-sim`, `/plan/goal`, `/settings/data`:
  **none** on any route.
- Playwright walk: hero reads "Productively tired · fitness is advanced ·
  injury risk optimal · 28.9 mi across 6 runs"; metric row shows
  `Advanced · 77 · ↑ +1.4 vs 4 wk`, `Productively Tired · -18 balance`,
  `Competitive · 51.2 · 5K 19:10`, `Optimal`. History page renders all
  9 sections; milestones and favorite routes correctly formatted in
  miles for imperial-preferred athletes.
- Coach chat system prompt now instructs the model to use plain English
  by default.

## Commit trail on `main`

- `040a156` — Phase 1: labels + representation overhaul (dashboard,
  chart, community, goal, race-sim, settings, coach snapshot).
- `2e84e68` — Phase 2: /insights/history page + history queries +
  history charts + tab.
- `419b829` — History fix-ups: milestones unit, HR efficiency chart
  simplified to single-axis.
