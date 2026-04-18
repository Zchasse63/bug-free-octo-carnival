# Design Documentation

Index of all design artifacts for Cadence (working name).

**Status as of 2026-04-18:** Palette locked (Ink + Saffron). Widget treatment locked (Gradient Glow). Chat aesthetic locked (book variant). Dashboard rebuilt. Orange fully purged. Ready for production port in Phase 1 Week 3+.

---

## Design Plan
- [DESIGN-PLAN.md](DESIGN-PLAN.md) — Phased execution plan for the design system build

## Foundation Docs
- [DESIGN-GUIDE.md](DESIGN-GUIDE.md) — **Canonical design system.** Colors, typography, spacing, motion, accessibility. Section 3 (Color) rewritten for Ink + Saffron on 2026-04-18.
- [COMPONENT-LIBRARY.md](COMPONENT-LIBRARY.md) — Every UI component cataloged (primitives, training-specific, layout)
- [SCREENS.md](SCREENS.md) — Screen inventory with wireframes and platform differences
- [DATA-VIZ-GUIDE.md](DATA-VIZ-GUIDE.md) — Chart type playbook and visualization defaults

## Research
- [COMPETITIVE-DESIGN-ANALYSIS.md](COMPETITIVE-DESIGN-ANALYSIS.md) — Strava, Runna, Whoop, Oura, Linear, etc.
- [ALMA-UI-STUDY.md](ALMA-UI-STUDY.md) — Primary aesthetic inspiration

## Historical (kept for reference; decisions are locked)
- [COLOR-PALETTE-EXPLORATION.md](COLOR-PALETTE-EXPLORATION.md) — Written palette analysis (palette is now locked)
- [prototypes/palette-preview.html](prototypes/palette-preview.html) — Visual palette exploration (palette is now locked)
- [prototypes/bento-preview.html](prototypes/bento-preview.html) — Original 3-treatment comparison (Row 2 Gradient Glow picked)

## Branding (Deferred to Pre-Launch)
- [NAME-AND-MASCOT.md](NAME-AND-MASCOT.md) — Name exploration. Working title "Cadence".

---

## Interactive Prototypes

Open any HTML file in a browser — they render directly with CDN dependencies, no build step.

### Canonical (port these to production)

| Prototype | Purpose |
|-----------|---------|
| [prototypes/dashboard.html](prototypes/dashboard.html) | **Dashboard (canonical).** Ink + Saffron palette, Gradient Glow bento widgets, sidebar nav, hero metrics, insights moved up, training load chart, recent activities. Light + dark. |
| [prototypes/coach-chat-book.html](prototypes/coach-chat-book.html) | **Chat (canonical).** Book/journal aesthetic, Shantell Sans with BNCE axis, paper `#EEE9DC`, JetBrains Mono user messages on paper-note bg. |
| [prototypes/bento-glow.html](prototypes/bento-glow.html) | **Widget treatment reference.** 5 Gradient Glow tiles in asymmetric 12-col grid. Use as the spec when porting `<GlowTile>` to production. |
| [prototypes/activity-detail.html](prototypes/activity-detail.html) | Activity deep-dive: map, streams, splits, zones, context, notes |
| [prototypes/training-plan.html](prototypes/training-plan.html) | Adaptive plan with week calendar |
| [prototypes/onboarding.html](prototypes/onboarding.html) | First-time setup + conversational questionnaire |

### Backups / variants

| Prototype | Notes |
|-----------|-------|
| [prototypes/coach-chat.html](prototypes/coach-chat.html) | Clean/Claude-style chat variant. Orange removed. Kept for reference. |
| [prototypes/coach-chat-journal.html](prototypes/coach-chat-journal.html) | Legal-pad variant. Orange removed. Kept for reference. |
| [prototypes/dashboard-v2.html](prototypes/dashboard-v2.html) | Previous dashboard iteration (pre-Ink-+-Saffron rebuild). |

---

## How to Navigate This Folder

**If you're new to the project, read in this order:**
1. [DESIGN-PLAN.md](DESIGN-PLAN.md) — Why this exists
2. [COMPETITIVE-DESIGN-ANALYSIS.md](COMPETITIVE-DESIGN-ANALYSIS.md) + [ALMA-UI-STUDY.md](ALMA-UI-STUDY.md) — Research context
3. [DESIGN-GUIDE.md](DESIGN-GUIDE.md) — The canonical design system
4. [COMPONENT-LIBRARY.md](COMPONENT-LIBRARY.md) — What components exist
5. [SCREENS.md](SCREENS.md) — Where components live
6. Open the canonical prototypes: onboarding → coach-chat-book → activity-detail → training-plan → dashboard

**If you're implementing a prototype in production code:**
- HTML prototypes use Tailwind CDN for simplicity — production uses Tailwind + shadcn/ui
- Colors are CSS variables — port to `tailwind.config.ts` theme extension
- Fonts: Inter + JetBrains Mono + Shantell Sans (chat only)
- Every component needs light + dark variants

---

## Decisions Locked (Do Not Re-Litigate)

- **Palette:** Ink + Saffron (`#C48A2A` accent, warm ink neutrals, no orange)
- **Widget treatment:** Gradient Glow (3-stop gradients, specular highlight, shimmer sweep, colored glow shadow, hover lift)
- **Chat aesthetic:** Book/journal for chat surfaces only; data screens stay clean SaaS
- **Nav:** Sidebar (not top-bar)
- **Light + dark both first-class** — never design only one
- **shadcn/ui** for primitives, **Kokonut UI Pro** for marketing, **custom** for training-specific components
- **Fonts:** Inter + JetBrains Mono + Shantell Sans (chat only)

## Open (Deferred)

- Final product name (Cadence is temporary)
- Mascot direction
- Logo / wordmark design
- Landing / marketing site design (Phase 2+)
