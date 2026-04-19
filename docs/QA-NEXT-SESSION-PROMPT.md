# Copy-paste prompt for fresh QA session

Paste everything between the horizontal rules into a new Claude Code session
(working directory: `/Users/zach/Desktop/Strava` or any worktree). The prompt
is self-contained — it tells the new agent what to read, what to test, and
what to report.

---

## Goal

Run a full UI/UX + API QA pipeline against the latest Cadence deploy and
report every regression or rough edge as a tight punch-list. No speculation.
No redesigns. Only things that are measurably wrong.

## Context

Cadence is a Next.js 15 + Supabase running-coach app. Prior sessions shipped:
- a unified athlete context (`app/lib/ai/cohesive-context.ts`) consumed by
  coach chat, plan generator, and workout builder
- a new `/settings` section (overview, profile, preferences, data & sync)
  with API routes at `/api/settings/*`
- frontend-design polish: Instrument Serif display font, warm radial-gradient
  page atmosphere, `.reveal` staggered page-load animation, `.card-hover`
  interaction, saffron focus rings, a serif-led "Today's read" dashboard hero
- `UserMenu` (clickable sidebar chip → Settings / theme / sign out)
- `EmptyState` component used on Dashboard sections

Latest deploy URL is logged in `docs/AUTOPILOT-RESUME.md` or the most recent
Netlify deploy command output. Check `git log --oneline -10 main` for the last
committed state; the most recent commit should be the "unified athlete context
+ settings section + frontend-design polish pass" commit.

## Task

1. Read `docs/AUTOPILOT-RESUME.md` and the last 10 commits on `main` for
   a full picture of what's already done.
2. Find the current Netlify draft URL (grep `docs/` for the most recent
   `cadence-running-coach.netlify.app` URL, or deploy a fresh one from
   `/app` with `NETLIFY_AUTH_TOKEN=$NETLIFY_AUTH_TOKEN npx netlify-cli deploy --build`).
3. Use the Playwright MCP (`mcp__plugin_playwright_playwright__*`) to walk
   every primary route. For each page: navigate, screenshot, inspect the
   a11y snapshot, note defects. Routes to visit:
   - `/` (should redirect to `/dashboard`)
   - `/dashboard`
   - `/activities`
   - `/activities/routes`
   - `/activities/18159314938` (a real activity)
   - `/coach`
   - `/plan`, `/plan/build`, `/plan/goal`, `/plan/race-sim`
   - `/insights`, `/insights/community`
   - `/teams`, `/teams/coach-portal`
   - `/breathing`
   - `/onboarding`
   - `/settings`, `/settings/profile`, `/settings/preferences`, `/settings/data`
   - Redirects: `/goal` → `/plan/goal`, `/community` → `/insights/community`,
     `/coach-portal` → `/teams/coach-portal`, `/routes` → `/activities/routes`,
     `/workout-builder` → `/plan/build`, `/tools` → `/dashboard`,
     `/race-sim` → `/plan/race-sim`
4. Run `app/scripts/qa-api.ts` against the deploy URL:
   `cd app && node ./node_modules/tsx/dist/cli.mjs scripts/qa-api.ts <deploy-url>`.
   Must be 29/29 passing.
5. Open the sidebar user menu on any page, verify Settings link works,
   verify theme toggle switches light/dark and persists via next-themes.
6. Submit a profile save on `/settings/profile` (change city, save, reload,
   confirm it sticks). Same for preferences (flip units, reload, confirm
   distance columns change).
7. Click a "Run" button on `/settings/data` (the cheap one: Recompute VDOT).
   Confirm the response returns within 30s and doesn't 500.
8. On `/dashboard`, confirm:
   - Hero shows "Today's read" + serif verdict + TSB number
   - Shoes section renders gear OR a proper EmptyState with a CTA
   - Page has reveal animation on first load (brief fade-up stagger)
   - User menu at bottom of sidebar is clickable
9. Cross-tool cohesion spot-check: ask the coach "What's my plan this week?"
   — the response must reference the active plan name, goal, and phase if
   one exists. Ask the workout builder "Build me a tempo workout" — the
   returned structure should use paces derived from the athlete's VDOT.
10. Report back.

## Constraints

- Do not fix anything. Only report. The user will triage.
- Hit the real deploy URL, not localhost.
- Use the Playwright MCP for UI testing; use `fetch` or `qa-api.ts` for
  API testing. No mocks.
- Keep the final report under 1,200 words. Severity tag every finding
  (BLOCKER / HIGH / MEDIUM / LOW). Group by page/area.
- Ignore the favicon 404 (known).
- Ignore that the Strava sync loop is paused on daily read cap — the data
  may be partial. Focus on whether what IS rendered renders correctly.

## Think about

- Double-rendered layouts (e.g. nested AppShells)
- Units regressions (Fahrenheit/miles should be everywhere for Zach)
- Units on charts, splits, weather, plan workouts — the easy miss
- Pace rounding (no "7:60/mi")
- Empty-state dead ends (any page where a lack of data just shows nothing)
- Focus/keyboard a11y (can you Tab through the dashboard cleanly?)
- Mobile: resize browser to 390px and walk three pages — anything broken?
- Dark-mode parity (especially the gradient-glow tiles and the new hero)
- Typography: serif H1s should be on every page, not just dashboard

## Deliverable

A single markdown file at `docs/QA-REPORT-<YYYY-MM-DD>.md` with:

```
# Cadence QA — <date>

## Summary
- Deploy URL: ...
- Routes walked: X / X
- API endpoints tested: X / X
- Blocker count: N
- High count: N
- Medium count: N
- Low count: N

## Findings
### [BLOCKER] Page: /settings/profile — Save returns 500
- Steps: change firstname, click Save
- Expected: 200 + toast
- Actual: 500 `{"error":"..."}`
- Where: `app/api/settings/profile/route.ts`

### [HIGH] Page: /activities/[id] — temp displays in °C
...
```

## Report back with

Paste the file path to the generated report and a one-line summary
("3 blockers, 5 highs, 4 mediums — most severe is X"). Do not paste the
report itself.
