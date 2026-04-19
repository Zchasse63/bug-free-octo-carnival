# Cadence QA Verify — 2026-04-19

Companion to `docs/QA-REPORT-2026-04-19.md`. Every finding from the
original report has been addressed and re-verified against the live
Netlify deploy.

## Summary

- Deploy URL: `https://cadence-running-coach.netlify.app` (GitHub Actions →
  Netlify prod, latest commit `acfadd9`)
- Routes walked: 20 / 20
- API endpoints tested: **29 / 29 passing** (`scripts/qa-api.ts`)
- Blocker count: **0**
- High count: **0**
- Medium count: **0**
- Low count: **0**
- Console output on `/dashboard`: **0 errors, 0 warnings**

All 17 findings resolved. Commit trail on `main`: `3ac5bcf` (17 fixes
bundle), `e014e36` (dynamic coach-portal redirect), `037cc27` (first
Recharts attempt), `7cb7736` (revert mount-gate), `acfadd9` (final
debounce-based Recharts fix).

---

## Per-finding verification

### [BLOCKER] Mobile nav — ✅ Fixed
- 390 × 844 viewport now shows a top bar with hamburger (`Menu` icon),
  Cadence wordmark, and theme toggle.
- Tapping the hamburger slides in a drawer with full nav (Coach ·
  Activities · Dashboard · Plan · Insights · Teams) plus the user menu
  chip (Zach Chasse · Tampa).
- Backdrop click, ESC, X button, and route-change all close it.
- `aria-modal="true"`, `aria-expanded`, `aria-controls`, `role="dialog"`
  wired.
- Verified on `/dashboard`, `/activities`, `/coach`.
- Where: [app-shell.tsx:121](app/components/app-shell.tsx:121)

### [BLOCKER] /plan/build meter rendering — ✅ Fixed
- Live result for "Build me a tempo workout" (imperial mode, VDOT 51.2):
  - Warm-up: **1.50mi 15:00 @ 8:21/mi** (was `3219m 18:00 @ 11:13/mi`)
  - Tempo: **4.00mi 26:45 @ 6:41/mi** (was `6437m @ 8:41/mi`)
  - Cool-down: **1.50mi 9:00 @ 8:21/mi** (was `1609m @ 11:13/mi`)
- Where: [workout-builder-form.tsx:21](app/components/workout-builder-form.tsx:21) + [plan/build/page.tsx](app/app/plan/build/page.tsx)

### [BLOCKER] /plan/race-sim hardcoded °C/m — ✅ Fixed
- Labels now read `Temp (°F)` · `Humidity (%)` · `Elev gain (ft)` with
  defaults `64` / `60` / `328`.
- Client converts °F→°C and ft→m at submit; backend contract unchanged.
- Where: [race-sim-form.tsx:43](app/components/race-sim-form.tsx:43) + [plan/race-sim/page.tsx](app/app/plan/race-sim/page.tsx)

### [HIGH] Workout-builder paces off from VDOT — ✅ Fixed
- `pacesFromVdot` replaced with a Jack Daniels v4 anchor table (VDOT
  30–85, 5-step rows) + linear interpolation.
- Live builder + live coach chat both now quote **6:41/mi** for
  threshold at VDOT 51.2 (table anchor: VDOT 50 T=254s/km, VDOT 55
  T=233s/km → 51.2 T=249.96s/km = 6:41/mi).
- Propagates to coach chat, plan generator, goal analyzer, and race sim
  via `lib/ai/cohesive-context.ts`.
- Where: [vdot.ts:81](app/lib/analytics/vdot.ts:81)

### [HIGH] Weekly-volume tooltip km-in-imperial — ✅ Fixed
- Dashboard chart now takes `useMetric` prop; axis, values, and tooltip
  all convert km → mi when imperial.
- Where: [weekly-volume-chart.tsx](app/components/charts/weekly-volume-chart.tsx) +
  [dashboard/page.tsx:248](app/app/dashboard/page.tsx:248)

### [HIGH] /settings/profile weight unit — ✅ Fixed
- Imperial athletes see `WEIGHT (LBS)`; metric see `(kg)`. DB still
  stores canonical kg, UI converts lbs↔kg at read and at save.
- Where: [profile-form.tsx](app/components/settings/profile-form.tsx) +
  [settings/profile/page.tsx](app/app/settings/profile/page.tsx)

### [HIGH] /activities mobile overflow — ✅ Fixed
- Below `md`: dedicated card list with name, date, sport, pace, HR,
  load, distance, time — all readable, nothing clipped.
- At `md+`: full table with Pace and HR columns.
- Verified at 390px.
- Where: [activities/page.tsx:119](app/app/activities/page.tsx:119)

### [HIGH] /plan/build prompt chips half-metric — ✅ Fixed
- Imperial chips now read: "6×1mi at threshold…", "10 mile long run…",
  "Fartlek: 8×…", "45 min recovery run…". Metric chips remain the old
  "6×1km…" set.
- Placeholder switches with unit.
- Where: [workout-builder-form.tsx:8](app/components/workout-builder-form.tsx:8)

### [MEDIUM] Coach echoes incorrect VDOT paces — ✅ Fixed (via the VDOT
table). Coach now replies: *"Based on your current VDOT of 51.2,
threshold pace sits at **6:41/mi**"* — exact match with the builder.

### [MEDIUM] Dashboard "6 runs" hero copy — ✅ Verified not-a-bug
- Re-read `rollupWeeklySummaries()`: `run_count` counts rows with
  `sport_type='Run' || 'TrailRun'` only ([training-load.ts:194](app/lib/analytics/training-load.ts:194)).
- The recent-activities feed shows last 6 *activities* (any type), which
  happens to include weight-training sessions. Both surfaces are
  correct; copy needed no change. Original finding was a false positive.

### [MEDIUM] /insights time-machine walking paces — ✅ Fixed
- Rows where aggregate pace > 10:00/km (≈16:06/mi) now render `—`
  instead of misleading running-pace numbers like 41:41/mi. 2024/2023/
  2022/2021 columns now show `—` for pace; distance/load/HR still show.
- Where: [insights/page.tsx:44](app/app/insights/page.tsx:44)

### [MEDIUM] Redirects double-hop RSC — ✅ Fixed
- Legacy-route redirects (`/goal`, `/community`, `/coach-portal` (+ the
  dynamic `:athleteId` variant), `/routes`, `/tools`, `/race-sim`,
  `/workout-builder`) moved from per-page `redirect()` calls to
  `next.config.ts → redirects()`. Single 308 at the Netlify edge, no
  React round-trip.
- All 7 still pass in `qa-api.ts` (`scripts/qa-api.ts` 29/29).
- Where: [next.config.ts:3](app/next.config.ts:3)

### [MEDIUM] Profile form a11y — ✅ Fixed
- Every input now has `id`, `name`, and a paired `<label htmlFor>`.
  Screen readers + autofill behave correctly.
- Where: [profile-form.tsx:137](app/components/settings/profile-form.tsx:137)

### [LOW] qa-api stale assertion — ✅ Fixed
- Dashboard check now looks for `Today&#x27;s read` (the HTML-encoded
  form that Next.js emits) and passes live.

### [LOW] relativeDate 24h vs calendar — ✅ Fixed
- `relativeDate()` now compares calendar days via `startOfDay`, so
  "Yesterday" only means the previous calendar date.
- Where: [format.ts:35](app/lib/format.ts:35)

### [LOW] Community percentile em-dash — ✅ Fixed
- When `peer_sample_size === 0`, the card shows the athlete's own
  4-week-avg next to the em-dash and a clearer "need more athletes to
  compare" line in the footer.
- Where: [insights/community/page.tsx:37](app/app/insights/community/page.tsx:37)

### [LOW] Recharts width(-1) warnings — ✅ Fixed
- `ResponsiveContainer` now uses `height={224}` (fixed px to match
  `h-56`) plus `debounce={1}`. First measurement lands after layout
  settles, so Recharts' SSR-hydration race no longer fires the warning.
- Applied to training-load, weekly-volume, and streams charts.
- Live `/dashboard` console: `0 errors, 0 warnings`.

---

## How verification was done

1. `cd app && node ./node_modules/tsx/dist/cli.mjs scripts/qa-api.ts \
    https://cadence-running-coach.netlify.app` → **29/29 passed, 0 failed**
2. Playwright MCP walked desktop 1280×800: `/dashboard`, `/activities`,
   `/activities/18159314938`, `/coach`, `/plan/build`, `/plan/race-sim`,
   `/insights`, `/insights/community`, `/settings/profile`,
   `/settings/preferences`, `/settings/data`.
3. Playwright MCP walked mobile 390×844: `/dashboard`, `/activities`,
   `/coach` — hamburger open/close/navigate confirmed on each.
4. Interactive:
   - `/settings/profile`: `City=Tampa` saved + reload persists.
   - `/settings/preferences`: imperial↔metric flip reflected on
     `/activities`, `/dashboard`, `/plan/build`, `/plan/race-sim`.
   - `/settings/data` → "Recompute VDOT" → POST `/api/settings/data/
     recompute-vdot` returns 200 in <3s.
5. Cohesion:
   - Coach: *"What is my threshold pace right now?"* → *"Based on your
     current VDOT of 51.2, threshold pace sits at 6:41/mi"*.
   - Builder: *"Build me a tempo workout"* → steps in miles, threshold
     segment @ 6:41/mi, warm-up/cool-down @ 8:21/mi.
   - Both read the same unified athlete context
     (`lib/ai/cohesive-context.ts`).

---

## What remains open

Nothing from the original report. A few low-impact observations worth
a **future** session (not tracked here):

- Dynamic `coach-portal/:athleteId` redirect was reinstated via
  `next.config.ts`, but the qa-api suite doesn't exercise it; worth
  a test.
- GitHub Actions workflow warns about Node.js 20 deprecation
  (`actions/checkout@v4`, `actions/setup-node@v4`). Safe until
  June 2026.
- Strava detail sync still on daily rate-limit cap; orthogonal to QA.
