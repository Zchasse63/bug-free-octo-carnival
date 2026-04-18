# Stride AI Design Guide

> The complete design system for Stride AI. Every principle, color, font, size, and interaction documented with rationale.
> Version: 1.0 | 2026-04-17

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Brand Identity](#2-brand-identity)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Iconography](#6-iconography)
7. [Motion & Interaction](#7-motion--interaction)
8. [Accessibility](#8-accessibility)
9. [Design Tokens](#9-design-tokens-tailwind-config)
10. [Journal Aesthetic (Chat Surfaces)](#10-journal-aesthetic-chat-surfaces)
7. [Motion & Interaction](#7-motion--interaction)
8. [Accessibility](#8-accessibility)
9. [Design Tokens (Tailwind Config)](#9-design-tokens-tailwind-config)

---

## 1. Design Principles

These twelve principles guide every design decision in Stride AI. When in doubt, return to these.

### 1.1 Companion, Not Tracker
We are a running companion — not a tracking platform, not an analytics dashboard, not a logbook. The language throughout is "coach," "companion," "training partner." Never "user," "engagement," or "session." Inspired by Alma's philosophy: meet people where they are, honor their imperfect humanity.

### 1.2 Conversation First
The chat is the hero interface. The dashboard, plan, and activity screens exist to support conversations with the coach. Every feature should be accessible via chat.

### 1.3 Interpretation Over Raw Data
Numbers without meaning are noise. Every data point should answer "so what?". A pace of 7:12/mi means nothing without context — "your easy pace is 15s faster than last month at the same HR" means everything.

### 1.4 Soul Over Steel
Reject the gym-rat-robot aesthetic common to fitness apps (Whoop clinical, TrainingPeaks dense-grid, Garmin Connect designed-by-committee). Warm hero imagery, human headings, editorial feel. Bevel's hillside photos, not TrainingPeaks' gauge clusters.

### 1.5 Adaptive Coaching Is the Product
The adaptation IS the feature. Like MacroFactor's "coaching calibrated to your metabolism," our positioning is "coaching calibrated to your training response." Lead with this in marketing, onboarding, and UI affordances.

### 1.6 Honor Imperfect Humans
Runners miss workouts. Take months off. Try new shoes that hurt. Feel-run when stressed. Cancel plans last minute. The app should meet users in that reality, never shame them for it. No guilt-driven streaks, no "you're falling behind!" patterns. See training gaps as context, not failures.

### 1.7 Warm Editorial, Not Clinical Lab
Stride AI is a coach, not a diagnostic tool. The visual language should feel like reading a thoughtful coaching email — warm, grounded, human — not a medical report.

### 1.8 Numerical Honesty
Running data is primarily numbers: paces, times, heart rates, distances. Numbers must be immediately legible, use tabular figures (no layout shift), and have consistent units.

### 1.9 Dense But Scannable
Pack real information into every screen, but with clear visual hierarchy. Not Strava-sparse (one activity per screen). Not TrainingPeaks-overwhelming (every metric at once). Think Linear.

### 1.10 Light First, Dark Mode Done Right
Default to light mode — clean, approachable, legible outside in the sun before a run. Dark mode is fully supported and must be properly designed (not inverted), not an afterthought.

### 1.11 Zone Color Consistency
HR zones, pace zones, effort levels, workout types — each has a color. That color NEVER changes. If zone 3 is amber in a chart, it's amber in a badge, it's amber in a lap row.

### 1.12 Motion With Purpose
Animation confirms state changes and guides attention. Never decoration. Never delight for delight's sake. Always respect `prefers-reduced-motion`.

---

## 2. Brand Identity

### Product Name

**Working title: Stride AI**

Alternatives to consider:
- **Cadence** — musical, rhythmic, implies consistency. Strong runner resonance.
- **Tempo** — running-native term, dynamic, implies pace awareness.
- **Pace** — universal, simple, memorable. SEO risk (common word).
- **Split** — evokes splits in running, has dual meaning (separate/divide).
- **Meter** — metric, measurement, poetic (meter as in verse). Short and brandable.
- **Stride Labs** — keeps "Stride" but more research-y, less athlete-y.

**Recommendation:** Keep "Stride AI" as the working title. It's clear, memorable, running-specific, and the "AI" suffix signals the differentiator. Revisit if a better option emerges through user testing.

### Tagline

**"Your AI coach that actually knows you."**

Alternative taglines:
- "Training that adapts to you, not the plan."
- "Running coached by your data."
- "Every run, understood."

### Brand Voice

**Who we sound like:**
- A sharp friend who happens to have a PhD in exercise physiology
- A coach who explains, not a coach who barks
- Grounded, warm, direct, occasionally witty

**Who we DON'T sound like:**
- Hype ("CRUSH YOUR PR!")
- Academic ("Research indicates that elevated lactate thresholds...")
- Cutesy ("You did it! 🎉 Amazing!")
- Drill sergeant ("NO EXCUSES. RUN.")

### Logo Direction (to design later)

**Concept:** A simple, confident mark. Ideas to explore:
- A stylized stride path (footprints or path suggesting forward motion)
- A single stride-shaped letterform (the S, bent into motion)
- A minimalist heartbeat line that resolves into the word
- A clean wordmark with a subtle running-related mark in the "i" of Stride

**Constraints:**
- Works at 16px (favicon)
- Works monochrome
- No running-person silhouette (overdone, dates the brand)
- No orange (conflict with Strava's identity)
- No generic "swoosh" or arrow

---

## 3. Color System — Ink + Saffron (Locked 2026-04-18)

### 3.1 Color Philosophy

Cadence's color system is **Ink + Saffron**: warm ink neutrals carry the shell, a muted saffron accent carries brand expression, and a rich widget palette gives bento tiles their character. The product IS the data — the shell stays quiet, the data gets the color.

Three roles:
1. **Shell / Chrome** — warm ink neutrals. Quiet, warm, never cold gray.
2. **Primary accent** — saffron. CTAs, active states, key expressions. Used sparingly (≤ 10% of any screen).
3. **Widget palette** — jewel-plus-earth gradients for bento tiles. Each metric gets its own distinct color identity.

All color pairings meet WCAG 2.1 AA minimum.

### 3.2 Primary Accent — Saffron

Muted ochre / saffron. Warm gold with earthen weight. Treasured, not branded.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--saffron-50` | `#FDF7EB` | `#25200F` | Softest tint, bg washes |
| `--saffron-100` | `#F9EBCE` | `#332B15` | Hover states, subtle bg |
| `--saffron-200` | `#F2D89C` | `#4C3E1C` | Borders on tinted surfaces |
| `--saffron-300` | `#E6BE6A` | `#75601C` | Disabled primary |
| `--saffron-400` | `#D99E3E` | `#9E8023` | Lighter emphasis |
| `--saffron-500` | `#C48A2A` | `#D99E3E` | **Primary brand color** |
| `--saffron-600` | `#A6731F` | `#E5AE55` | Hover on primary |
| `--saffron-700` | `#8A6118` | `#EEC376` | Active/pressed primary |
| `--saffron-800` | `#6D4D13` | `#F2D89C` | Rarely used |
| `--saffron-900` | `#523A0E` | `#F9EBCE` | Rarely used |

**Primary brand color (`--saffron-500`): `#C48A2A`**

A muted ochre with earthen weight. Reads as a treasured color, not a brand color. Used for primary CTAs, active tabs, focus rings, selected states, logo accent.

### 3.3 Warm Ink Neutrals (Shell)

Our neutrals are warm ink — slight brown tint in the deep end, warm cream in the light end. No cold grays.

#### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--ink-0` | `#FFFFFF` | Pure white — cards, modals |
| `--ink-50` | `#FAF7EF` | Page background |
| `--ink-100` | `#F2EDE1` | Elevated surface, secondary bg |
| `--ink-200` | `#E5DCCA` | Borders, dividers |
| `--ink-300` | `#D9D0B6` | Strong borders, disabled |
| `--ink-400` | `#A89E86` | Muted text, placeholders |
| `--ink-500` | `#78756F` | Secondary text |
| `--ink-600` | `#5C554A` | Body text |
| `--ink-700` | `#4C4536` | Strong body text, headings |
| `--ink-800` | `#25201A` | Primary headings |
| `--ink-900` | `#100E08` | Near-black (warmest) |
| `--ink-950` | `#08060A` | Deepest ink, rarely used |

#### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--ink-0` | `#000000` | Rarely used |
| `--ink-50` | `#0A0806` | Page background (warm near-black) |
| `--ink-100` | `#15110A` | Elevated surface |
| `--ink-200` | `#25201A` | Cards, tiles |
| `--ink-300` | `#362E22` | Borders, dividers |
| `--ink-400` | `#554A36` | Strong borders |
| `--ink-500` | `#78705D` | Muted text |
| `--ink-600` | `#9A8F7A` | Secondary text |
| `--ink-700` | `#BDB197` | Body text |
| `--ink-800` | `#D9D0B6` | Strong body text |
| `--ink-900` | `#F2EDE1` | Headings / primary text |
| `--ink-950` | `#FAF7EF` | Near-white, rarely used |

### 3.4 Semantic Colors

| Purpose | Light | Dark | Usage |
|---------|-------|------|-------|
| **Success** | `#3F6B4A` | `#6B9B78` | Positive state, PRs, "on track" |
| **Warning** | `#C48A2A` | `#D99E3E` | Caution — note: uses Saffron (brand = warning). Pair with icon to distinguish from CTAs. |
| **Danger** | `#7E2E2E` | `#A15555` | Overtraining, injury risk, errors |
| **Info** | `#1F4A6B` | `#4A7A9C` | Neutral info, tips |

**Note:** Warning uses Saffron intentionally — attention color and brand color are the same family because both communicate "consider this." Disambiguate via icon + context, not color alone.

### 3.5 Training Zone Colors (Universal — Do Not Change)

Zone colors are science-tied and MUST stay consistent across the product. They're independent of the Saffron palette because they represent physiological reality.

#### Heart Rate Zones (5-zone system)

| Zone | Name | Light | Dark | % Max HR |
|------|------|-------|------|----------|
| Z1 | Recovery | `#94A3B8` | `#CBD5E1` | 50-60% |
| Z2 | Aerobic | `#3B82F6` | `#60A5FA` | 60-70% |
| Z3 | Tempo | `#10B981` | `#34D399` | 70-80% |
| Z4 | Threshold | `#F59E0B` | `#FBBF24` | 80-90% |
| Z5 | VO2max | `#EF4444` | `#F87171` | 90-100% |

Rationale: cool (recovery) → warm (maximal). Colorblind-safe via brightness variation.

#### Pace Zones (Daniels system)

| Zone | Name | Color |
|------|------|-------|
| E | Easy | `#94A3B8` |
| M | Marathon | `#3B82F6` |
| T | Threshold | `#10B981` |
| I | Interval | `#F59E0B` |
| R | Repetition | `#A855F7` |

#### Workout Type Colors

| Type | Color | Notes |
|------|-------|-------|
| Easy | `#94A3B8` | Slate |
| Long | `#3B82F6` | Blue |
| Tempo | `#10B981` | Emerald |
| Interval | `#F59E0B` | Amber |
| **Race** | **`#C48A2A`** | **Saffron (brand color — races are the moment)** |
| Fartlek | `#8B5CF6` | Violet |
| Rest | `#D9D0B6` | Neutral warm |
| Cross-train | `#06B6D4` | Cyan |
| Feel run | `#EC4899` | Pink |

### 3.6 Readiness Colors

| Status | Light | Dark | Meaning |
|--------|-------|------|---------|
| **Fresh** | `#3F6B4A` | `#6B9B78` | Ready, TSB positive |
| **Normal** | `#1F4A6B` | `#4A7A9C` | Normal training zone |
| **Tired** | `#C48A2A` | `#D99E3E` | Productively fatigued (Saffron) |
| **Strained** | `#7E2E2E` | `#A15555` | Needs recovery |

### 3.7 Widget Palette (Gradient Glow bento tiles)

Each bento widget gets its own gradient identity. Gradients use a 3-stop structure (light → mid → deep) for the refined Gradient Glow treatment. See [prototypes/bento-glow.html](./prototypes/bento-glow.html) for rendered reference.

#### Light Mode — 3-stop gradients

| Widget | Light → Mid → Deep | Text |
|--------|-------------------|------|
| Training Load | `#F4ECFD` → `#D9C6F6` → `#A487E0` | `#1B0940` |
| Weekly Volume | `#E4F8ED` → `#A8E0C3` → `#4FA580` | `#052618` |
| PR Progress | `#FCE3ED` → `#F3A8C1` → `#CE5886` | `#2C091C` |
| HR Zones / alt | `#FEF1DB` → `#F6CE8A` → `#DB923A` | `#3E2708` |
| Long Runs / Cool | `#E0F4F9` → `#A2D9E4` → `#459CB3` | `#03202C` |
| Recovery | `#F2EDE1` → `#D9D0B6` → `#8F826B` | `#100E08` |
| Gear | `#F6EACF` → `#E0C48A` → `#9C7340` | `#25201A` |

#### Dark Mode — 3-stop gradients (deeper, richer)

| Widget | Stops |
|--------|-------|
| Training Load | `#3E2A6B` → `#2F1F55` → `#1C113A` |
| Weekly Volume | `#0D4A32` → `#0B3A27` → `#07261A` |
| PR Progress | `#5A1634` → `#45112B` → `#2C091C` |
| HR Zones / alt | `#5E3C0D` → `#4A2D09` → `#2F1B05` |
| Long Runs / Cool | `#0A4659` → `#07384A` → `#03202C` |
| Recovery | `#3E3728` → `#2E2920` → `#1C1A14` |
| Gear | `#5C4620` → `#452F12` → `#2B1C08` |

### 3.8 Color Usage Rules

1. **Saffron stays sparse** — primary CTAs, active tabs, selection states, logo only. Never more than ~10% of any screen.
2. **Ink does the shell work** — bg, text, borders, chrome, surfaces.
3. **Widget palette is for widgets** — tile gradients, chart accents, bento fills. Never use a widget color as a CTA or body text.
4. **Zone colors are sacred** — never use Z3 emerald for a non-Z3 element. Never modify zone hex values.
5. **Never rely on color alone** — zones always pair with label + color, readiness with icon + color.
6. **Contrast minimum** — WCAG 2.1 AA (4.5:1 body, 3:1 large text + UI).

### 3.9 Gradients (Gradient Glow Canonical)

Bento widget tiles use the **Gradient Glow** treatment — see [prototypes/bento-glow.html](./prototypes/bento-glow.html). Canonical structure:

```css
/* Example: Training Load tile */
background:
  linear-gradient(135deg, #F4ECFD 0%, #D9C6F6 45%, #A487E0 100%);
box-shadow:
  0 10px 30px -10px rgba(23, 21, 17, 0.12),
  0 4px 12px -4px rgba(23, 21, 17, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.25),
  inset 0 0 0 1px rgba(255, 255, 255, 0.12);

/* Specular highlight (::before) */
/* Hover shimmer sweep (::after) */
/* Hover lift: translateY(-3px) + colored glow shadow */
```

**Primary CTA gradient (for Saffron CTAs, optional):**
```css
linear-gradient(135deg, var(--saffron-500), var(--saffron-600))
```

Used only on hero CTAs. Standard buttons use solid `--saffron-500` in light mode, `--saffron-500` / `--ink-900` in dark mode.

**No rainbow gradients. No bro-y multi-stop brand gradients. No neon.**

---

## 4. Typography

### 4.1 Font Stack

**UI & Body:**
```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", 
             Roboto, "Helvetica Neue", Arial, sans-serif;
```
Inter is a superb UI font — wide language support, excellent readability, great at small sizes, tabular figures support.

**Numerical / Monospace:**
```css
font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
```
Used for paces (7:12/mi), times (1:23:45), HR values where consistent width matters.

**Display (optional, for hero stats):**
```css
font-family: "Instrument Serif", Georgia, "Times New Roman", serif;
```
Reserved for big hero numbers ("42:03" race time, "5K PR: 19:42"). Use sparingly.

### 4.2 Type Scale

Based on a 1.25 (major third) ratio, 16px base.

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-xs` | 12px / 0.75rem | 1.5 (18px) | 400, 500 | Captions, labels |
| `text-sm` | 14px / 0.875rem | 1.5 (21px) | 400, 500 | Secondary text, table data |
| `text-base` | 16px / 1rem | 1.5 (24px) | 400, 500 | Body text |
| `text-lg` | 18px / 1.125rem | 1.5 (27px) | 400, 500 | Emphasized body |
| `text-xl` | 20px / 1.25rem | 1.4 (28px) | 500, 600 | Card titles |
| `text-2xl` | 24px / 1.5rem | 1.3 (31px) | 600 | Section headings |
| `text-3xl` | 30px / 1.875rem | 1.25 (38px) | 600, 700 | Page titles |
| `text-4xl` | 36px / 2.25rem | 1.2 (43px) | 700 | Dashboard hero stats |
| `text-5xl` | 48px / 3rem | 1.1 (53px) | 700 | Race time displays |
| `text-6xl` | 60px / 3.75rem | 1 (60px) | 700 | Landing page hero |

### 4.3 Font Weights

- **400** Regular — body text, table data
- **500** Medium — emphasis, labels, secondary buttons
- **600** Semibold — headings, primary buttons, links
- **700** Bold — big display numbers, page titles
- **300** Light — reserved for large display text only (60px+)

### 4.4 Numerical Typography Rules (CRITICAL)

**All numeric displays MUST use tabular figures:**

```css
.tabular {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
```

Apply to:
- Pace displays (7:12/mi, 4:32/km)
- Time displays (1:23:45, 42:03)
- HR values (142 bpm)
- Distance (10.2 km, 6.35 mi)
- Power (285 W)
- Cadence (180 spm)
- ACWR values (1.23)
- Training load (TSS, CTL, ATL)

**Colons in times must not shift** — `1:23:45` and `1:23:46` must have identical widths.

### 4.5 Letter Spacing

- **Body text**: 0 (default)
- **Small caps / eyebrow labels**: +0.05em, uppercase
- **Display text (60px+)**: -0.02em (tighter)
- **Monospace / numeric**: 0 (default)

### 4.6 Line Heights

- **Headings (2xl+)**: 1.1–1.3 (tighter for impact)
- **Body text**: 1.5 (readability)
- **Dense tables / data rows**: 1.4
- **Chat messages**: 1.55 (extra for scanability)

### 4.7 Typography Usage Examples

**Page title with subtitle:**
```
"Today's Run" — text-3xl font-semibold
"6.9 km at 6:28/mi pace" — text-lg text-neutral-600
```

**Dashboard metric:**
```
"42.3 km" — text-4xl font-bold tabular
"This week" — text-sm text-neutral-500 uppercase tracking-wide
"+8.2 km vs last week" — text-sm text-success
```

**Chat coach message:**
```
text-base (16px) leading-relaxed (1.625) text-neutral-700
```

**Activity card:**
```
Name: text-base font-medium
Pace: text-sm font-mono tabular
Metrics row: text-sm text-neutral-500
```

---

## 5. Spacing & Layout

### 5.1 Base Unit

**4px** base unit. All spacing is a multiple of 4.

### 5.2 Spacing Scale

Matches Tailwind's default spacing scale:

| Token | Value | Usage |
|-------|-------|-------|
| `space-0.5` | 2px | Hairline separation (rare) |
| `space-1` | 4px | Icon + label gap, tight clusters |
| `space-2` | 8px | Within components (label + input) |
| `space-3` | 12px | Button padding vertical |
| `space-4` | 16px | Card padding, form field gaps |
| `space-6` | 24px | Between cards in a grid |
| `space-8` | 32px | Section spacing |
| `space-12` | 48px | Major section breaks |
| `space-16` | 64px | Page-level section breaks |
| `space-24` | 96px | Hero area spacing |

### 5.3 Layout Grid

**Desktop:** 12-column grid, max-width 1280px, 24px gutter
**Tablet:** 8-column grid, 20px gutter
**Mobile:** 4-column grid, 16px gutter

### 5.4 Breakpoints

Mobile-first, Tailwind defaults:

| Token | Min Width | Usage |
|-------|-----------|-------|
| (default) | 0 | Mobile |
| `sm` | 640px | Large phone / small tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Wide desktop |

### 5.5 Container Widths

- **Chat container max-width:** 768px (optimal reading length)
- **Dashboard container max-width:** 1280px
- **Activity detail max-width:** 1024px
- **Onboarding / settings max-width:** 640px
- **Landing page sections:** varies, typically 1280px

### 5.6 Card & Surface Elevation

Subtle, not heavy. Use shadow and border together.

```css
/* Resting surface */
.card {
  background: var(--neutral-0); /* or neutral-100 in dark */
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
}

/* Elevated (hover, dropdown) */
.card-elevated {
  background: var(--neutral-0);
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05),
              0 1px 2px rgba(0, 0, 0, 0.03);
}

/* Modal / popover */
.card-floating {
  background: var(--neutral-0);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08),
              0 4px 10px rgba(0, 0, 0, 0.04);
}
```

### 5.7 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-none` | 0 | Never, except maybe tables |
| `rounded-sm` | 2px | Tiny elements (chips) |
| `rounded` | 4px | Small UI (badges, small inputs) |
| `rounded-md` | 6px | Buttons, inputs |
| `rounded-lg` | 8px | Cards |
| `rounded-xl` | 12px | Modals, hero cards |
| `rounded-2xl` | 16px | Splash/marketing cards |
| `rounded-full` | 9999px | Pills, avatars, circular buttons |

### 5.8 Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `z-0` | 0 | Default |
| `z-10` | 10 | Dropdowns, popovers |
| `z-20` | 20 | Sticky headers |
| `z-30` | 30 | Toast notifications |
| `z-40` | 40 | Modals / dialogs |
| `z-50` | 50 | Tooltips, topmost |

---

## 6. Iconography

### 6.1 Icon Library

**Lucide Icons** is the base. Open source, clean, comprehensive, tree-shakeable.

### 6.2 Icon Sizes

| Token | Size | Usage |
|-------|------|-------|
| `icon-xs` | 12px | Inside small badges |
| `icon-sm` | 16px | Most inline icons, buttons |
| `icon-md` | 20px | Tab bar, nav icons |
| `icon-lg` | 24px | Card headers, emphasized |
| `icon-xl` | 32px | Empty states, feature icons |
| `icon-2xl` | 48px | Hero / onboarding |

### 6.3 Icon Stroke

Lucide default: **1.5px stroke**. Do not override.

### 6.4 Icon + Label Pairings

Icons paired with labels: 8px gap (Tailwind `gap-2`). Icons without labels need `aria-label`.

### 6.5 Key Icons (Lucide)

Tab bar (web):
- **Coach:** `MessageCircle` or `MessagesSquare`
- **Activities:** `List` or `Activity`
- **Dashboard:** `LayoutDashboard`
- **Plan:** `CalendarDays`

Tab bar (iOS, Phase 4):
- **Coach:** `MessageCircle`
- **Run:** `Play` (live workout)
- **Dashboard:** `LayoutDashboard`
- **Plan:** `CalendarDays`

Actions:
- **Add:** `Plus`
- **More:** `MoreHorizontal`
- **Close:** `X`
- **Back:** `ChevronLeft` or `ArrowLeft`
- **Forward:** `ChevronRight` or `ArrowRight`
- **Search:** `Search`
- **Filter:** `SlidersHorizontal`
- **Sort:** `ArrowUpDown`
- **Settings:** `Settings` or `Settings2`
- **Edit:** `Pencil`
- **Delete:** `Trash2`
- **Download:** `Download`
- **Upload:** `Upload`
- **Share:** `Share`
- **Copy:** `Copy`
- **Check:** `Check`

Training-specific (from Lucide):
- **Activity/run:** `Activity`, `Footprints`
- **Heart rate:** `Heart`, `HeartPulse`
- **Route / map:** `Map`, `MapPin`, `Route`
- **Distance:** `Ruler`, `ArrowRight` (between points)
- **Elevation:** `Mountain`
- **Timer:** `Timer`, `Stopwatch`
- **Training load:** `Flame`, `TrendingUp`
- **Power:** `Zap`
- **Weather:** `Sun`, `Cloud`, `CloudRain`, `Wind`, `Thermometer`
- **Gear:** `Shirt`, `Package` (Lucide lacks a shoe icon — custom needed)

### 6.6 Custom Icons Needed

Lucide lacks some training-specific icons. To design/commission later:
- **Shoe** (running shoe, side profile)
- **Track** (stadium / oval)
- **Interval** (repeating pulse waveform)
- **Fartlek** (playful wavy line)
- **Stride / footprint** (distinct from `Footprints`)
- **Recovery / rest** (crescent moon with subtle energy)
- **Cadence** (metronome)
- **VDOT** (custom mark for the concept)
- **Personal record (PR)** (ribbon or badge)

Until custom icons exist, substitute with close Lucide matches and add a `title` attribute.

### 6.7 Icon Color

- Default icons: `currentColor` (inherit from text)
- Tab bar active: brand color (`--ember-500`)
- Tab bar inactive: `--neutral-500` light / `--neutral-600` dark
- Status icons: match semantic color (success green, warning amber, etc.)

---

## 7. Motion & Interaction

### 7.1 Motion Philosophy

Motion confirms state changes. Never decoration. Never delight for delight's sake.

### 7.2 Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `duration-75` | 75ms | Instant feedback (button press) |
| `duration-150` | 150ms | Default — hover, color change |
| `duration-200` | 200ms | Small movement (popover appear) |
| `duration-300` | 300ms | Medium (slide-in, fade-in) |
| `duration-500` | 500ms | Large (page-level transitions, rare) |
| `duration-700` | 700ms | Reserved for emphasis moments |
| `duration-1000` | 1000ms | Reserved for data-loaded chart reveals |

Default: **150ms**. Go slower only when meaningful.

### 7.3 Easing

```css
/* Standard (most interactions) */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Snappy (clicks, presses) */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Emphasis (rare — big reveals) */
--ease-emphasis: cubic-bezier(0.2, 0, 0, 1);
```

**Never use linear easing.** Motion should feel physical.

### 7.4 When to Animate

**Always animate:**
- Button hover → active state
- Modal / sheet open + close
- Popover / dropdown open + close
- Tab switch (content fade-cross)
- Toast appear + dismiss
- Chat message appear (fade + slight slide-up)
- Streaming text cursor blink

**Sometimes animate:**
- Chart reveals on scroll (once, then static)
- Number count-up for hero stats (once, on page load)
- Skeleton to content transition

**Never animate:**
- Scroll position (decorative scroll-jacking)
- Entry-on-scroll on every item (performance killer)
- Loading spinners that never stop
- Marquee text
- Page-element background gradients

### 7.5 Reduced Motion

Respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Alternative: Use simpler motion (fade only, no transform) instead of disabling entirely.

### 7.6 Key Interaction Patterns

**Button press:**
- Hover: slight brightness change (`brightness-95` in dark mode, `brightness-90` in light), 150ms
- Active: scale 0.98, 75ms
- Focus: 2px ring in brand color

**Input focus:**
- Border color shifts to brand color
- 2px focus ring
- 200ms ease-out

**Toast notification:**
- Appears: slide up from bottom-right, 300ms ease-out
- Dismisses: slide right + fade, 200ms
- Auto-dismiss: 5 seconds default, 8 for errors

**Modal / Sheet:**
- Backdrop fade: 200ms
- Content: scale-in from 0.95 + fade, 250ms
- Dismiss: reverse, faster (200ms)

**Chat streaming:**
- New message: fade + 4px slide-up, 300ms
- Typing cursor: `|` blink every 600ms
- Message complete: cursor removes with fade

---

## 8. Accessibility

### 8.1 Baseline

**WCAG 2.1 AA** is the minimum. Strive for AAA where practical.

### 8.2 Color Contrast

Check every color pair. Tools: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

| Content | Min Contrast |
|---------|-------------|
| Body text (< 18pt) | 4.5:1 |
| Large text (18pt+ or 14pt+ bold) | 3:1 |
| UI components (buttons, borders) | 3:1 |
| Icons conveying meaning | 3:1 |

### 8.3 Keyboard Navigation

- Every interactive element keyboard-accessible
- Visible focus indicator on all focusable elements (2px ring, brand color)
- Logical tab order (top-to-bottom, left-to-right)
- Skip-to-content link on pages
- Escape closes modals/popovers
- Enter activates focused buttons/links

### 8.4 Screen Reader Support

- Semantic HTML (button, a, h1-h6, nav, main, aside)
- `aria-label` for icon-only buttons
- `aria-live` regions for dynamic content (chat messages, toasts)
- Form labels properly associated
- `alt` text on meaningful images, empty `alt=""` for decorative
- `role="status"` for inline loading/success indicators

### 8.5 Data Visualization Accessibility

- **Never rely on color alone** — charts always have labels, legends, or patterns
- **Colorblind-safe palettes** — use tools like Viz Palette, check with simulators
- **Text alternatives** — summary stats next to charts
- **Interactive charts keyboard-accessible** — arrow keys to navigate points, Enter to focus

### 8.6 Forms

- Labels always visible (or floating labels that move on focus)
- Error messages tied to fields via `aria-describedby`
- Required fields marked clearly (not color alone — "Required" label)
- Success/validation feedback near the field

### 8.7 Chat Interface

- Messages in a live region (`aria-live="polite"`)
- Streaming messages announced on completion, not on every token
- Keyboard shortcut to focus input (e.g., `/` or `Cmd+K`)
- History navigable with arrow keys

---

## 9. Design Tokens (Tailwind Config)

This is the canonical Tailwind config for Stride AI:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ember: {
          50:  'oklch(0.97 0.04 55)',   // #FFF7ED
          100: 'oklch(0.94 0.07 55)',   // #FFEDD5
          200: 'oklch(0.87 0.13 55)',   // #FED7AA
          300: 'oklch(0.80 0.17 50)',   // #FDBA74
          400: 'oklch(0.72 0.19 45)',   // #FB923C
          500: 'oklch(0.62 0.21 35)',   // #E94E1B (brand)
          600: 'oklch(0.54 0.21 30)',   // #D4400F
          700: 'oklch(0.46 0.19 28)',   // #B23307
          800: 'oklch(0.38 0.16 27)',   // #8F2906
          900: 'oklch(0.31 0.13 27)',   // #6E2005
        },
        neutral: {
          // Warm gray palette — slight yellow tint
          0:   '#FFFFFF',
          50:  '#FAFAF7',
          100: '#F5F5F0',
          200: '#E7E5DF',
          300: '#D4D2CB',
          400: '#A8A6A0',
          500: '#78756F',
          600: '#57554F',
          700: '#3E3C37',
          800: '#26241F',
          900: '#171511',
          950: '#0B0A08',
        },
        zone: {
          recovery:  '#94A3B8',  // HR Z1, Easy
          aerobic:   '#3B82F6',  // HR Z2, Marathon
          tempo:     '#10B981',  // HR Z3, Threshold
          threshold: '#F59E0B',  // HR Z4, Interval
          vo2max:    '#EF4444',  // HR Z5
          rep:       '#A855F7',  // R-pace
        },
        workout: {
          easy:       '#94A3B8',
          long:       '#3B82F6',
          tempo:      '#10B981',
          interval:   '#F59E0B',
          race:       '#E94E1B',
          fartlek:    '#8B5CF6',
          rest:       '#D4D2CB',
          crosstrain: '#06B6D4',
          feel:       '#EC4899',
        },
        readiness: {
          fresh:    '#16A34A',
          normal:   '#3B82F6',
          tired:    '#F59E0B',
          strained: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
      fontFeatureSettings: {
        tabular: '"tnum" 1',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'emphasis': 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config;
```

### CSS Variables for Runtime Theme Switching

```css
:root {
  /* Light mode (default) */
  --bg: var(--neutral-50);
  --bg-elevated: var(--neutral-0);
  --border: var(--neutral-200);
  --text: var(--neutral-900);
  --text-muted: var(--neutral-500);
  --primary: var(--ember-500);
  --primary-hover: var(--ember-600);
}

.dark {
  --bg: var(--neutral-50);      /* dark neutral-50 = near black */
  --bg-elevated: var(--neutral-100);
  --border: var(--neutral-300);
  --text: var(--neutral-900);   /* dark neutral-900 = near white */
  --text-muted: var(--neutral-600);
  --primary: var(--ember-500);
  --primary-hover: var(--ember-400);  /* Lighter in dark mode */
}
```

---

## Open Design Decisions (Need Zach's Input)

1. **Product name** — See NAME-AND-MASCOT.md. Top pick: **Finn** (with fox mascot). Alternatives: Ember, Rory.
2. **Brand color** — "Ember" `#E94E1B` proposed and locked pending name.
3. **Typography** — Inter + JetBrains Mono + Caveat (handwriting for journal surfaces). Accepted.
4. **Display font** — Instrument Serif for hero numbers — TBD, revisit post-prototype.
5. **Logo direction** — Fox mascot + wordmark (if Finn), flame glyph (if Ember), or fox mid-stride (if Rory).

---

## 10. Journal Aesthetic (Chat Surfaces)

The chat interface is the emotional center of the product. Unlike the dashboard (which is clean, data-dense, and efficient), the chat is warm and personal — it's a training journal you're keeping with your coach. This section defines the journal aesthetic used for chat surfaces specifically.

### 10.1 Where the Journal Aesthetic Applies

**Apply journal treatment:**
- Coach chat screen
- Activity notes view (when reading past notes)
- Weekly narrative report cards
- Daily check-in prompts
- Post-run feedback screen
- Coach's proactive insights when viewed individually

**Do NOT apply journal treatment:**
- Dashboard (clean data surface)
- Activity detail data tabs (splits, laps, streams — data-dense)
- Plan calendar (information-dense grid)
- Settings screens (functional forms)
- Landing / marketing pages (different aesthetic — magazine editorial with Kokonut components)
- Onboarding forms (clean interactive forms)

### 10.2 Paper Background

**Light mode:**
- Base color: `#FBF6EC` (warm cream / parchment)
- Subtle noise via SVG filter (opacity 0.04) — nearly invisible, adds life
- Faint ruled lines every 32px using `var(--rule-line: rgba(139, 115, 85, 0.18))`
- Texture is BELOW text — never obscures readability

**Dark mode:**
- Base color: `#1A1612` (warm deep brown, NOT cool gray or black)
- Same noise + ruled line treatment with appropriate contrast
- Feels like a journal under a lamp at night, not a terminal

**Implementation (CSS):**
```css
.paper-bg {
  background-color: var(--paper);
  background-image:
    url("data:image/svg+xml,...noise filter..."),
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 31px,
      var(--rule-line) 31px,
      var(--rule-line) 32px
    );
  background-attachment: local;
}
```

### 10.3 Handwriting Typography

**Current pick (book variant): Shantell Sans** (Google Fonts, variable)
- Variable font with weight axis (300-800) AND bounce axis (BNCE: 0-1000) AND informality axis (INFM: 0-100)
- The bounce axis is the key innovation — dials in the exact amount of "alive" vs "flat" we want
- Previous iteration used Patrick Hand — too flat, read as "lazy"
- Previous iteration before that used Caveat — too loose/cursive
- Shantell Sans at `"wght" 460, "BNCE" 500, "INFM" 20` hits the sweet spot: legible body text with rhythm and life

**Variation settings per class:**
| Class | weight | BNCE | INFM | Size | Usage |
|-------|--------|------|------|------|-------|
| `handwriting` | 460 | 500 | 20 | 19px | Coach message body |
| `handwriting-sm` | 450 | 500 | 20 | 17px | Marginalia, captions |
| `handwriting-lg` | 600 | 450 | 20 | 24px | Callouts, emphasis |
| `signature` | 700 | 350 | 10 | 16px, uppercase, tracked | Coach signature stamp |
| `date-header` | 650 | 400 | 15 | 20px, uppercase | Chapter / date markers |

**Why the bounce-axis varies by class:** Body text needs rhythm (500) to feel alive. Signatures need firmness (350) because they're a stamp, not a stroke. Display text sits in between.

**Variants that exist for reference:**
- `coach-chat-journal.html` — Caveat + ruled lines + notebook embellishments (the "legal pad")
- `coach-chat-book.html` — Shantell Sans + cream paper + clean book aesthetic (current direction)

**Where handwriting is used:**
- Coach message body text (the coach's "voice" is hand-written)
- Section labels and date headers
- Coach signature/name marker ("— Finn")
- Sticky-note style inline suggestions
- Quick-reply labels

**Where handwriting is NEVER used:**
- User message text (user "types")
- Data values (pace, HR, times — need tabular-figures monospace)
- UI chrome (buttons, inputs, nav, tabs)
- Navigation labels
- Form inputs
- Table headers
- Microcopy in interactive components (use Inter)
- Anything that must render at small sizes (< 14px)

**Size scale for handwriting:**
| Token | Size | Use |
|-------|------|-----|
| `handwriting-sm` | 18px | Sticky notes, secondary captions |
| `handwriting` | 22px | Primary coach message body |
| `handwriting-lg` | 28px | Date headers, section breaks |

Body-size handwriting is larger than Inter body (22px vs 16px) to compensate for handwriting's looser letterforms and maintain legibility.

### 10.4 Ink Colors

Handwriting uses warm dark "ink" colors. No orange. No accent brand color in ink — the ink IS the voice.

**Light mode:**
- Primary ink: `#2D1F14` (warm dark brown — like a brown fountain pen on parchment)
- Light ink: `#4A3628` (for secondary/de-emphasized handwriting, signatures, date headers)
- Muted ink: `#8B7355` (dates, captions, timestamps)

**Dark mode:**
- Primary ink: `#F0E6D2` (warm cream — the handwriting is what's illuminated)
- Light ink: `#D4C4A3`
- Muted ink: `#9A8869`

**No brand accent in ink.** Previously the coach signature used Ember orange; that's retired. Signatures, date headers, and hand-drawn underlines all use the warm ink color system — no outside color. The page and the pen ARE the brand.

### 10.4.1 Paper Colors

Book-variant paper is warm light notebook gray — between cream and full gray. Tuned through multiple iterations to feel like actual paper, not peach, not yellow parchment, not flat gray.

**Light mode (current as of 2026-04-18):**
- Base paper: `#EEE9DC` — warm light notebook gray
- Alt / note paper (user messages): `#F4EFE3` — slightly lighter sheet, "paper on paper"
- Darker paper (card interiors, stamps): `#E1DBC9`
- Paper edge (borders, scrollbar thumbs): `#CEC5B1`

**Dark mode:**
- Base paper: `#1A1612` — warm deep brown (lamp-lit book at night)
- Alt / note paper: `#27211A`
- Darker: `#221C16`

**History:**
| Iteration | Hex | Verdict |
|----|----|----|
| v1 | `#F7EEE7` | too peach |
| v2 | `#F2EDE2` | too cream / too soft |
| v3 | `#EAE5D8` | too dark / too gray |
| v4 (current) | `#EEE9DC` | warm light notebook — dialed in |

### 10.4.2 User Message Treatment ("Paper Note on the Page")

User messages previously used a white card + Inter — read as a form field dropped into the journal. Now they're designed as typewritten notes pasted onto the page:

- Background: `--paper-note` (slightly lighter than the page cream)
- Typography: **JetBrains Mono** at 13.5px, `--ink-light` color — the user "types" while the coach "writes"
- Shadow: layered `0 1px 2px rgba(74,54,40,0.06), 0 8px 16px rgba(74,54,40,0.04)` — genuine paper-on-paper depth
- Border: `1px solid rgba(74,54,40,0.14)` — whisper-soft
- Corner radius: 11px (slightly less than coach's visual rhythm)
- Rotation: `-0.4deg` on desktop only — "placed by hand" feel
- Top-right avatar + name + timestamp as a header row with dashed separator
- Max-width 85% of column, right-aligned

The typewriter / handwritten pairing is intentional — it reads as coherent journal materials (typed note on handwritten page), not as mismatched UI.

### 10.5 Decorative Elements

**Hand-drawn separator:**
- Wavy horizontal line in muted ink, opacity 0.4
- Implemented as SVG background
- Used between different days' entries or between major conversation sections

**Hand-drawn underline:**
- Dashed underline effect using linear-gradient on background
- Used to emphasize key phrases ("Pattern worth looking at")
- Color: brand Ember

**Marker highlight:**
- Pale yellow highlight effect (`rgba(249, 191, 48, 0.35)` light / `rgba(249, 191, 48, 0.2)` dark)
- Applied with CSS linear-gradient on 50% bottom
- Used for emphasis like highlighting text with a highlighter pen
- Sparingly — 1-2 highlights per coach entry max

**Sticky notes:**
- Warm yellow (`#FFF3B8` light / `#3A3520` dark)
- Slight rotation (1.5deg)
- Subtle drop shadow
- Used for coach suggestions that feel like a "quick note added in the margin"

### 10.6 Embedded Cards as "Clippings"

Activity cards and workout proposals embedded in chat feel like pieces of printed data pasted into the journal:

- White card background (distinct from parchment)
- Subtle double shadow (paper stacking effect)
- Slight rotation on some (-0.3deg) — feels hand-placed, not rigid-aligned
- Clean Inter typography inside (they're "printouts," not handwritten)

**Optional decorative detail: "tape" accent**
- A small orange translucent strip at top of certain clippings
- Suggests washi tape holding the clipping to the journal
- Used sparingly — adds character without being kitschy

### 10.7 Coach Signature

Every coach message is signed:
- Fox icon badge (warm Ember circle with small fox silhouette)
- "— Finn" or "— [coach name]" in handwriting font, Ember color
- Timestamp in small Inter text below

Feels like a journal entry with the coach's signature at the top.

### 10.8 User Messages

User messages stay in clean Inter — the user "types" while the coach "writes."

- White card background (like a typed note inserted into the journal)
- Subtle border
- 14-15px Inter body text
- User avatar on the right

This contrast (user typed / coach handwritten) reinforces the companion relationship without forcing a role on the user.

### 10.9 Accessibility Considerations for Handwriting

**Readability:**
- Minimum 22px size for handwriting body text (larger than normal body)
- Minimum contrast 4.5:1 against parchment bg
- Caveat at weight 500+ (not 400) for better stroke definition

**For users who find handwriting difficult:**
- Provide a "Reading mode" toggle in Settings that swaps all handwriting to Inter
- Document this option prominently in help
- Screen readers ignore font-family — they read text content, unaffected

**Reduced motion respected:**
- All fade-in animations on new entries disabled if `prefers-reduced-motion: reduce`
- Cursor-pen streaming animation still works (it's informational, not decorative)

### 10.10 When to Break the Journal Aesthetic

Sometimes clarity trumps aesthetic. Break the journal treatment when:
- Displaying critical data (pace, HR, power values) — always Inter/JetBrains Mono
- Showing a chart — charts have their own clean visual language
- Presenting a workout structure — use clipping cards with Inter
- Errors and warnings — use clean Inter with semantic colors for scanability
- Numeric tables — always clean, never handwritten

### 10.11 Chat Screen Component Inventory

Components that use the journal aesthetic:
- `CoachMessage` — handwritten body, signature, timestamp
- `UserMessage` — clean Inter card
- `DateHeader` — large Ember handwriting
- `HandSeparator` — SVG wavy line
- `StickyNote` — warm yellow inline suggestion
- `ClippingCard` — embedded activity/workout with subtle rotation
- `MarkerHighlight` — text highlight span
- `HandUnderline` — underline emphasis span
- `CoachSignature` — fox badge + "— Name" signature block

All defined in COMPONENT-LIBRARY.md.

### 10.12 Light vs Dark Mode — Both Feel Like Journals

**Light mode:** Morning training journal. Cream parchment under soft light. Brown ink. Warm, readable, encouraging.

**Dark mode:** Late-night training journal under a lamp. Deep warm brown paper. Cream ink. Intimate, focused, quiet.

Both feel like the SAME physical journal, just in different lighting. Neither feels like a "dark theme inverted from light" — they're designed as paired environments.

### 10.13 Reference Prototype

See: `docs/design/prototypes/coach-chat-journal.html`

Renders in browser with no build step. Both light and dark mode toggle via theme button (top-right of sidebar).
