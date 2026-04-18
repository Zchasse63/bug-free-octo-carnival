# Screen Inventory & Wireframes

> Every screen in Stride AI with purpose, layout, components used, and edge states.

---

## Table of Contents

1. [Marketing Site](#1-marketing-site) (Phase 2+)
2. [Authentication Flow](#2-authentication-flow)
3. [Onboarding Flow](#3-onboarding-flow)
4. [Primary Tabs](#4-primary-tabs)
5. [Activity Detail](#5-activity-detail)
6. [Settings Flow](#6-settings-flow)
7. [Team & Coach Portal](#7-team--coach-portal) (Phase 3)
8. [Modals & Overlays](#8-modals--overlays)

---

## 0. Platform Differences: Web vs iOS

Stride AI is NOT identical across platforms. Each platform does what it's best at.

### Web-Only Screens (No iOS Equivalent Needed)
- **Activities browse/filter** — deep browsing is a desktop behavior
- **File upload with CSV AI mapping** — desktop file system, large files, complex mapping
- **Coach portal athletes list** — coaches use laptops
- **Team admin panel** — managing team settings/members
- **Deep analytics / time machine** — historical comparison, multi-select, wide charts
- **Settings management** — long forms, detailed config
- **Marketing landing page** — sign-up funnel, SEO

### iOS-Only Screens (No Web Equivalent Needed)
- **Live run screen** — GPS tracking during a run
- **Quick log / quick add** — fast mobile entry
- **Apple Watch companion app** — workout execution on wrist
- **Push notifications** — proactive coach messages, race reminders

### Shared Screens (Both Platforms)
- **Coach chat** — primary interaction, adapted for each platform
- **Dashboard** — optimized for each screen size
- **Training plan** — calendar view
- **Activity detail** — reading post-run analysis
- **Onboarding flow**
- **Auth flow**

### Tab Navigation Differs by Platform

**Web tabs:** `Coach` · `Activities` · `Dashboard` · `Plan` · (Settings in profile menu)

**iOS tabs:** `Coach` · `Run (live)` · `Dashboard` · `Plan` · (Settings in profile menu)

The Activities tab on web replaces the Run tab from iOS. On iOS, you browse activities via tapping them from the Coach tab (coach references) or the Dashboard "Recent runs" widget — you don't need a dedicated browse tab.

---

## 1. Marketing Site (Phase 2+)

### 1.1 Landing Page

**Purpose:** Convert visitors to sign-ups.

**URL:** `/`

**Layout (Kokonut UI hero sections appropriate here):**

```
┌────────────────────────────────────────────────────────┐
│  [Logo]                        [Sign in] [Get started] │
├────────────────────────────────────────────────────────┤
│                                                        │
│         Your AI coach that actually knows you.         │
│                                                        │
│    Training that adapts to YOU, grounded in every      │
│    run you've done. Not another static plan.           │
│                                                        │
│              [Connect your Strava]                     │
│                                                        │
│              [screenshot / hero image]                 │
│                                                        │
├────────────────────────────────────────────────────────┤
│            How Stride AI is different                  │
│                                                        │
│  [Feature card] [Feature card] [Feature card]          │
│   Adaptive plans    Free-form chat    Full history     │
│                                                        │
├────────────────────────────────────────────────────────┤
│           What runners are saying                      │
│  [Testimonials from Kokonut]                           │
├────────────────────────────────────────────────────────┤
│              Pricing [Kokonut pricing section]         │
├────────────────────────────────────────────────────────┤
│                     FAQ                                │
│  [Accordion FAQ from Kokonut]                          │
├────────────────────────────────────────────────────────┤
│                  Footer                                │
└────────────────────────────────────────────────────────┘
```

**Components used:** Kokonut Hero, Feature Cards, Testimonials, Pricing, FAQ, Footer
**Responsive:** Full responsive from 375px to 1920px+

---

## 2. Authentication Flow

### 2.1 Sign Up

**Purpose:** Create account.

**URL:** `/signup`

**Layout:** Two-column on desktop (form left, imagery right), single-column on mobile.

```
┌─────────────────────────┬──────────────────────────┐
│                         │                          │
│   Create your account   │                          │
│                         │   [Athletic imagery]     │
│   [Email field]         │                          │
│   [Password field]      │                          │
│                         │                          │
│   [Sign up with email]  │                          │
│                         │                          │
│   ─── or ───            │                          │
│                         │                          │
│   [Continue with Google]│                          │
│   [Continue with Apple] │                          │
│                         │                          │
│   Already have an       │                          │
│   account? Sign in      │                          │
│                         │                          │
└─────────────────────────┴──────────────────────────┘
```

**States:** Default, submitting, error (invalid email, weak password, email taken)
**Components:** Input, Button, Separator, Alert

---

### 2.2 Sign In

**URL:** `/login`

**Same structure as sign up**, with email + password + "forgot password" link.

---

### 2.3 OAuth Callback

**URL:** `/auth/callback`

**Purpose:** Handle the redirect from Supabase Auth or Strava OAuth.

**Layout:** Full-screen loading state with branded logo and progress message.

```
┌────────────────────────────────────────┐
│                                        │
│           [Logo]                       │
│                                        │
│    Setting up your account...          │
│    [Progress spinner]                  │
│                                        │
│    This should only take a moment      │
│                                        │
└────────────────────────────────────────┘
```

**States:** Loading, success (redirects immediately), error (shows message with retry option)

---

## 3. Onboarding Flow

### 3.1 Data Source Choice

**Purpose:** Choose how to get training data in.

**URL:** `/onboarding/data-source`

**Layout:** Three-up card grid on desktop, vertical stack on mobile.

```
┌────────────────────────────────────────────────────────┐
│  Step 1 of 4        ○ ● ○ ○                            │
├────────────────────────────────────────────────────────┤
│                                                        │
│         Let's get your training data in                │
│                                                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
│  │ [Icon]  │  │ [Icon]  │  │ [Icon]  │                 │
│  │         │  │         │  │         │                 │
│  │ Connect │  │ Upload  │  │  Start  │                 │
│  │  Strava │  │  Files  │  │  Fresh  │                 │
│  │         │  │         │  │         │                 │
│  │ Fastest │  │  Best   │  │ No data │                 │
│  │ to set  │  │ for non │  │   yet?  │                 │
│  │ up. Im- │  │ -Strava │  │  No     │                 │
│  │ port    │  │ users.  │  │ problem │                 │
│  │ all of  │  │ FIT,    │  │         │                 │
│  │ your    │  │ GPX,    │  │         │                 │
│  │ history │  │ TCX,    │  │         │                 │
│  │  in one │  │ or CSV  │  │         │                 │
│  │  click  │  │         │  │         │                 │
│  └─────────┘  └─────────┘  └─────────┘                 │
│                                                        │
│  You can add more sources anytime from settings.       │
└────────────────────────────────────────────────────────┘
```

**Components:** Progress indicator, 3× Card (interactive), Button

---

### 3.2 Strava OAuth Authorization

**Purpose:** Redirect to Strava's OAuth page. This screen is brief — just shows loading while the redirect happens.

---

### 3.3 File Upload (Alternative to Strava)

**Purpose:** Upload FIT/GPX/TCX/CSV files.

**Layout:**

```
┌────────────────────────────────────────────────────────┐
│  Step 2 of 4        ○ ○ ● ○                            │
├────────────────────────────────────────────────────────┤
│                                                        │
│        Upload your training data                       │
│                                                        │
│  ┌──────────────────────────────────────────────┐      │
│  │                                              │      │
│  │              [Upload icon]                   │      │
│  │                                              │      │
│  │     Drag and drop files here                 │      │
│  │     or click to browse                       │      │
│  │                                              │      │
│  │     FIT, GPX, TCX, CSV, or Excel             │      │
│  │     Up to 500 MB                             │      │
│  │                                              │      │
│  └──────────────────────────────────────────────┘      │
│                                                        │
│  [Files uploaded:]                                     │
│  ● activities.csv — 247 activities detected            │
│                                                        │
│  [Continue]                                            │
└────────────────────────────────────────────────────────┘
```

**States:** Empty (drop zone), dragging over, uploading, processing, mapping (CSV only), complete, error

---

### 3.4 CSV Column Mapping (if CSV upload)

**Purpose:** AI detected columns, user confirms mapping.

**Layout:**

```
┌────────────────────────────────────────────────────────┐
│  I found 247 activities. Here's how I mapped your      │
│  columns — does this look right?                       │
│                                                        │
│  Your column       →   Stride AI field                 │
│  ────────────────────────────────────                  │
│  "Date"            →   Activity date        [change]   │
│  "Distance (mi)"   →   Distance             [change]   │
│  "Time"            →   Moving time          [change]   │
│  "Avg Pace"        →   Pace                 [change]   │
│  "Avg HR"          →   Avg heart rate       [change]   │
│  "Notes"           →   Activity notes       [change]   │
│  "Calories"        →   Calories             [change]   │
│                                                        │
│  [Looks good]  [Cancel]                                │
└────────────────────────────────────────────────────────┘
```

**Components:** Table with inline editable cells, Button

---

### 3.5 Questionnaire (Chat-Based)

**Purpose:** Capture goals, experience, schedule, preferences.

**Layout:** Chat interface — the coach asks questions via chat, user answers via chat or quick-reply buttons.

```
┌────────────────────────────────────────────────────────┐
│  Setting up your coach          4 of 12 questions      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Coach] Hi Zach! I'll ask a few questions to          │
│          understand your running. First — how long     │
│          have you been running regularly?              │
│                                                        │
│          [< 6 months] [6-24 months] [2-5 years]        │
│          [5+ years]                                    │
│                                                        │
│                                     [User: 5+ years]   │
│                                                        │
│  [Coach] Great, that gives me good context. What       │
│          kind of running do you do most?               │
│                                                        │
│          [Road] [Trail] [Track] [Treadmill] [Mix]      │
│                                                        │
├────────────────────────────────────────────────────────┤
│  [🎤] [Type your answer...]                    [Send]  │
└────────────────────────────────────────────────────────┘
```

**Questions covered:**
1. Running experience (years)
2. Typical weekly mileage
3. Primary run type (road/trail/track/etc.)
4. Current goal (race / fitness / weight loss / general)
5. Goal race details (if applicable)
6. Available training days per week
7. Injury history
8. Preferred training style (if any)
9. Devices used
10. Measurement preference (metric/imperial)
11. Preferred run time of day
12. Anything else you want your coach to know

**Components:** MessageBubble, Button (quick-reply), Input/Textarea

---

### 3.6 Training Gap Analysis (if history imported)

**Purpose:** Ask about detected gaps in training history.

```
┌────────────────────────────────────────────────────────┐
│  [Coach] I see a gap in your training from February    │
│          to April 2025 — no activities in that         │
│          period. What happened?                        │
│                                                        │
│          [Injury] [Illness] [Life event] [Other app]   │
│          [Took a break] [Other]                        │
│                                                        │
│                                      [User: Injury]    │
│                                                        │
│  [Coach] Sorry to hear. What kind of injury?           │
│                                                        │
│          [Knee] [Shin] [Ankle] [Hip] [IT band]         │
│          [Calf/Achilles] [Other]                       │
└────────────────────────────────────────────────────────┘
```

---

### 3.7 Shoe Assignment (if gear imported)

**Purpose:** Assign roles to imported shoes.

```
┌────────────────────────────────────────────────────────┐
│  Quick question about your shoes. How do you use       │
│  each pair?                                            │
│                                                        │
│  ┌──────────────────────────────────────────┐          │
│  │ [Icon] Saucony Endorphin Pro 3           │          │
│  │        340 mi logged                     │          │
│  │        Roles: [ ] Race  [ ] Interval     │          │
│  │               [ ] Tempo [ ] Daily        │          │
│  │               [ ] Easy  [ ] Long run     │          │
│  └──────────────────────────────────────────┘          │
│                                                        │
│  [Save and continue]  [Skip for now]                   │
└────────────────────────────────────────────────────────┘
```

---

## 4. Primary Tabs

### 4.1 Coach Tab (Home / Default)

**Purpose:** Chat with the AI coach. Primary interaction point.

**URL:** `/coach`

**Layout:**

**Desktop:**
```
┌──────────┬─────────────────────────────────────────────┐
│          │  Today's session                 [Options]  │
│ [Logo]   ├─────────────────────────────────────────────┤
│          │                                             │
│ Chats    │  [Coach] Good morning! I saw you synced     │
│ • Today  │          your Tuesday morning run. Let's    │
│  Week 4  │          look at it together...             │
│  ...     │                                             │
│          │          [ActivityCard: Tuesday Run]        │
│ [Search] │                                             │
│          │          Your HR was elevated compared      │
│ [Menu]   │          to your typical tempo — 172avg     │
│          │          vs 168 last time at similar pace.  │
│ [Avatar] │          Anything going on?                 │
│          │                                             │
│ Coach    │                         [User: I slept bad] │
│ Run      │                                             │
│ Dash     │  [Coach] That'll do it. Let's keep today    │
│ Plan     │          easy...                            │
│          ├─────────────────────────────────────────────┤
│          │  [🎤] [Type your message...]        [Send]  │
└──────────┴─────────────────────────────────────────────┘
```

**Mobile:**
```
┌────────────────────────────────┐
│ [≡] Today's session    [⋯]    │
├────────────────────────────────┤
│                                │
│ [Coach] Good morning! ...      │
│         [ActivityCard]         │
│                                │
│              [User: I slept..] │
│                                │
│ [Coach] That'll do it...       │
│                                │
├────────────────────────────────┤
│ [🎤] [Message...]    [Send]    │
├────────────────────────────────┤
│ [C] [R] [D] [P]                │
└────────────────────────────────┘
```

**Components:** ChatLayout, MessageBubble, ActivityCard (embedded), Input (composer)

**Edge states:**
- **Empty (new user):** Coach greeting + onboarding prompt
- **Offline:** "Can't reach the coach right now. Your message will send when reconnected."
- **Rate limited:** "Taking a breather — try again in a moment"
- **Error mid-stream:** Partial message with retry button

---

### 4.2 Activities Tab (Web) / Live Run Tab (iOS)

**Platform note:** This tab is DIFFERENT between web and iOS.

#### Web: Activities Tab

**Purpose:** Browse, filter, and search all activities. The feed.

**URL:** `/activities`

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ Activities                           [Filters] [Sort]  │
├────────────────────────────────────────────────────────┤
│ [Search...]                                            │
│                                                        │
│ Filter: [All] [Runs] [Tempo] [Long] [Race] [Feel]      │
│ Date: [All time ▾]  Shoes: [All ▾]  Weather: [Any ▾]   │
│                                                        │
│ ┌──────────────────────────────────────────────┐       │
│ │ [ActivityCard — Tuesday Morning Run]         │       │
│ └──────────────────────────────────────────────┘       │
│                                                        │
│ ┌──────────────────────────────────────────────┐       │
│ │ [ActivityCard — Monday Easy Run]             │       │
│ └──────────────────────────────────────────────┘       │
│                                                        │
│ ┌──────────────────────────────────────────────┐       │
│ │ [ActivityCard — Sunday Long Run]             │       │
│ └──────────────────────────────────────────────┘       │
│                                                        │
│ [Load more] or infinite scroll                         │
└────────────────────────────────────────────────────────┘
```

**Components:** Input (search), filter dropdowns, ActivityCard list, pagination

**Why this exists on web and not iOS:** Deep browsing, filtering, and comparison is a desktop behavior. iOS users will tap an activity from the home/chat to see detail, not browse a list.

#### iOS: Live Run Tab (Phase 4)

**Purpose:** During an active run — real-time metrics.

**URL:** N/A (native screen)

**Layout:**
```
┌────────────────────────────────┐
│  [x]   Live run        [⚙]     │
├────────────────────────────────┤
│                                │
│        28:34                   │
│        moving time             │
│                                │
│        6.42 km                 │
│        distance                │
│                                │
│        6:28/mi                 │
│        current pace            │
│                                │
│   HR 168   Cadence 178         │
│                                │
├────────────────────────────────┤
│  Today's workout: Intervals    │
│  Lap 3 of 6 · 1:15 rest        │
├────────────────────────────────┤
│       [Pause]   [End]          │
└────────────────────────────────┘
```

**Naked run variant:** Hides pace/HR, shows only time and blur-obscured distance. "Feel mode — no metrics during run"

**Why this exists on iOS and not web:** You're not looking at a laptop while running. Live GPS, HR sensor integration, Apple Watch companion all require native.

---

### 4.3 Dashboard Tab

**Purpose:** Visual overview of training data.

**URL:** `/dashboard`

**Layout:**

```
┌────────────────────────────────────────────────────────┐
│  Dashboard                         [Week|Month|Year]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ┌─────────────────────┐  ┌─────────────────────────┐   │
│ │ This week           │  │ Readiness               │   │
│ │ 42.3 km             │  │ [GREEN] Fresh           │   │
│ │ ─── 8.2 vs last     │  │ TSB: +4                 │   │
│ └─────────────────────┘  └─────────────────────────┘   │
│                                                        │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Training Load — Fitness, Fatigue, Form          │    │
│ │ [TrainingLoadChart — 6 months]                  │    │
│ └─────────────────────────────────────────────────┘    │
│                                                        │
│ ┌─────────────────────┐  ┌─────────────────────────┐   │
│ │ Recent runs         │  │ Training distribution   │   │
│ │ [Activity list]     │  │ [Pie: E/T/I/L breakdown]│   │
│ └─────────────────────┘  └─────────────────────────┘   │
│                                                        │
│ ┌─────────────────────┐  ┌─────────────────────────┐   │
│ │ Best efforts        │  │ Gear & shoes            │   │
│ │ [PRProgressList]    │  │ [GearCard × 3]          │   │
│ └─────────────────────┘  └─────────────────────────┘   │
│                                                        │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Weekly mileage                                  │    │
│ │ [WeeklyVolumeChart — 12 weeks]                  │    │
│ └─────────────────────────────────────────────────┘    │
│                                                        │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Recent insights                                 │    │
│ │ [ProactiveInsightCard × 3]                      │    │
│ └─────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────┘
```

**Components:** DashboardGrid, multiple widget cards, all training-specific components

**Edge states:**
- **No data yet:** Show placeholder widgets with "Complete a run to see your stats"
- **Syncing:** Show skeletons with subtle pulse
- **Error on any widget:** Widget shows error state, others render normally

---

### 4.4 Plan Tab (Training Calendar)

**Purpose:** View and manage training plan.

**URL:** `/plan`

**Phase 1:** Simple list view of upcoming planned workouts (if any).
**Phase 2+:** Full calendar view.

**Phase 2+ Layout:**

```
┌────────────────────────────────────────────────────────┐
│ Training Plan                                          │
│ Marathon Build · Week 8 of 16        [Week | Month]    │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Mon 14   Tue 15   Wed 16   Thu 17  Fri 18  Sat 19  Sun │
│                                                        │
│ ┌────┐   ┌────┐   ┌────┐   ┌────┐  ┌────┐  ┌────┐      │
│ │Rest│   │8K  │   │10K │   │6K  │  │8K  │  │Long│      │
│ │    │   │Tmpo│   │MP  │   │Easy│  │Easy│  │22K │      │
│ │    │   │ ✓  │   │ ↑  │   │ ✓  │  │○   │  │ ○  │      │
│ └────┘   └────┘   └────┘   └────┘  └────┘  └────┘      │
│                                                        │
│ Planned: 60 km    Completed: 24 km (40%)               │
│                                                        │
│ ────────────────────────                               │
│ Upcoming:                                              │
│ Fri Apr 18: 8 km Easy at 7:30-8:00/mi pace             │
│ Sat Apr 19: 8 km Easy, optional strides                │
│ Sun Apr 20: 22 km Long Run (3:00-3:15 time)            │
└────────────────────────────────────────────────────────┘
```

**Components:** PlanCalendar, PlannedWorkoutPill, Badge (progress)

---

## 5. Activity Detail

**Purpose:** Deep dive into a single activity.

**URL:** `/activity/[id]`

**Layout:**

```
┌────────────────────────────────────────────────────────┐
│ [← Back]                                       [Edit]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Tuesday Morning Run                                   │
│  Apr 14, 2026 · 6:35 AM · Tampa, FL                    │
│                                                        │
│  ┌──────────────────────────────────────────────┐      │
│  │         [Interactive map with route]         │      │
│  └──────────────────────────────────────────────┘      │
│                                                        │
│  6.93 km    28:51    6:28/mi    172 avg HR   395W avg  │
│  ──────    ─────    ─────      ─────────   ─────────   │
│  distance  time     pace       heart rate  power       │
│                                                        │
│  [workout: interval]  [weather: 72°F]  [shoes: Pegasus]│
│                                                        │
│ ─────────────────────────────────────────────────────  │
│ [Overview] [Splits] [Laps] [Streams] [Notes]           │
│                                                        │
│ [Tab content changes based on selection]               │
│                                                        │
│ Coach's take:                                          │
│ ┌──────────────────────────────────────────────┐       │
│ │ [Coach avatar] Strong session. Your 800m     │       │
│ │ intervals averaged 3:05 — 4 seconds faster   │       │
│ │ than 2 weeks ago at similar HR. Recovery     │       │
│ │ jogs looked appropriately easy.              │       │
│ │                                              │       │
│ │ [Continue in chat]                           │       │
│ └──────────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────┘
```

**Tab contents:**

**Overview tab:** Key metrics large, HR zone distribution, notable moments

**Splits tab:** SplitsTable (mile or km toggle)

**Laps tab:** LapsTable with pace, HR, cadence per lap

**Streams tab:** StreamChart showing HR, pace, elevation, cadence over time. Toggleable overlays.

**Notes tab:** User's post-run note + parsed context factors. Edit capability.

**Components:** ActivityMap (interactive), metric row, Tabs, SplitsTable, LapsTable, StreamChart, MessageBubble (coach's take inline)

---

## 6. Settings Flow

### 6.1 Profile Settings

**URL:** `/settings/profile`

**Sections:**
- Avatar upload
- Name, location, bio
- Sex (for heart rate norms)
- Weight
- Date of birth (for age-predicted HR max)
- FTP (if using power)
- Measurement preference (metric/imperial)
- Account (email, password, delete)

---

### 6.2 Training Zones

**URL:** `/settings/zones`

**Sections:**
- HR zones (editable — MaxHR input, zone bounds, custom override)
- Pace zones (derived from current VDOT, read-only with explanation)
- Power zones (if FTP set)

---

### 6.3 Connected Data Sources

**URL:** `/settings/sources`

**Sections:**
- Strava (connected/disconnected, last sync, scope)
- File upload history (data_imports table)
- Manual entry log
- Future: Garmin, Apple Health, WHOOP

---

### 6.4 Gear Management

**URL:** `/settings/gear`

**Purpose:** Manage shoes and other equipment.

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ Gear                                    [+ Add shoe]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Active                                                │
│  ┌──────────────────────────────────────────────┐      │
│  │ [Icon] Nike Pegasus 40                       │      │
│  │        Roles: Easy, Daily                    │      │
│  │        ─────────────── 340/500 mi            │      │
│  │        [Edit] [Retire]                       │      │
│  └──────────────────────────────────────────────┘      │
│                                                        │
│  ┌──────────────────────────────────────────────┐      │
│  │ [Icon] Saucony Endorphin Pro 3               │      │
│  │        Roles: Race, Interval                 │      │
│  │        ─────────── 128/400 mi                │      │
│  │        [Edit] [Retire]                       │      │
│  └──────────────────────────────────────────────┘      │
│                                                        │
│  Retired (2)                              [Show]       │
└────────────────────────────────────────────────────────┘
```

---

### 6.5 AI Coach Settings

**URL:** `/settings/coach`

**Sections:**
- Coach tone preference (standard / concise / detailed)
- Proactive messages (on/off, frequency)
- Areas to focus on (checkboxes: form cues, recovery reminders, pace guidance, gear tips)
- Response language (English default)

---

### 6.6 Notifications

**URL:** `/settings/notifications`

**Sections:**
- Push notifications (Phase 2)
- Email notifications (weekly summary, race reminders)
- In-app badges
- Quiet hours

---

## 7. Team & Coach Portal (Phase 3)

### 7.1 Teams List

**URL:** `/teams`

Simple list of teams the user belongs to. "+ Create team" button.

### 7.2 Team Detail

**URL:** `/teams/[id]`

**Sections:**
- Team banner (name, member count)
- Members list (avatars)
- Team feed (activities + messages)
- Upcoming team events/workouts

### 7.3 Team Feed

Mix of team activities and team messages in chronological order.

### 7.4 Coach Portal — Athletes List

**URL:** `/coach`

Visible only to users with coach role. List of linked athletes with quick status indicators.

### 7.5 Coach Portal — Athlete View

**URL:** `/coach/athletes/[id]`

Same structure as Dashboard but viewing an athlete's data. Permissions determine what's visible.

---

## 8. Modals & Overlays

### 8.1 Workout Builder

**Trigger:** User asks coach "build me [workout description]" — coach shows a WorkoutBuilderCard in chat. Click "Edit" opens this modal.

**Layout:** Structured workout editor with drag-to-reorder steps.

### 8.2 Add Note to Activity

**Trigger:** User says in chat "add a note to today's run: [note]"

**Layout:** Simple textarea with the AI-parsed tags shown as chips below. User can add/remove tags.

### 8.3 Connect Data Source

**Trigger:** Settings → Add source

**Layout:** Dialog listing available sources with "Connect" buttons per source.

### 8.4 File Upload

**Trigger:** Settings → Upload activities, or chat "upload my data"

**Layout:** Drag-and-drop area like onboarding file upload.

### 8.5 Gap Explanation Dialog

**Trigger:** Coach detects a new gap during sync

**Layout:** Small dialog asking what happened during a specific date range.

### 8.6 Shoe Role Assignment

**Trigger:** First activity with a new shoe, or user taps "assign roles" on an unassigned shoe

**Layout:** Popover with role checkboxes

### 8.7 Race Prediction Dialog

**Trigger:** User says in chat "predict my [race]"

**Layout:** Form for race details (date, distance, course, weather) → results show as dialog + coach message

---

## 9. Screen-to-Component Map

For implementation planning:

| Screen | Core components |
|--------|---------|
| Landing | Hero, Feature Cards, Testimonials, Pricing, FAQ, Footer (Kokonut) |
| Sign up/in | Input, Button, Separator, Alert |
| OAuth callback | Spinner, logo |
| Data source choice | Card × 3, Button |
| Strava OAuth | (External) |
| File upload | Drop zone, file list, Button |
| CSV mapping | Table, Select, Button |
| Questionnaire | ChatLayout, MessageBubble, Button (quick-reply) |
| Gap analysis | MessageBubble, quick-reply Button |
| Coach tab | ChatLayout, MessageBubble, ActivityCard (embedded), Input |
| Run tab | Live metrics display (custom), WorkoutBuilderCard (if active) |
| Dashboard | DashboardGrid, TrainingLoadChart, PRProgressList, WeeklyVolumeChart, ProactiveInsightCard, readiness card |
| Plan | PlanCalendar, PlannedWorkoutPill, Badge |
| Activity detail | ActivityMap, metric row, Tabs, SplitsTable, LapsTable, StreamChart, MessageBubble |
| Settings | Forms with Input, Select, Switch, Button |
| Gear | GearCard (detailed) |
| Teams | Avatar, Card, feed components |
| Modals | Dialog + content-specific |

---

## 10. Responsive Strategy

### Breakpoint Strategy

- **Mobile (< 640px):** Single column, bottom tab bar, full-width cards, condensed text
- **Small tablet (640-768px):** Single column mostly, some 2-col grids
- **Tablet (768-1024px):** Sidebar appears, 2-col grids common
- **Desktop (1024px+):** Sidebar + 3-col grids, larger charts
- **Wide (1280px+):** Max-width containers, more breathing room

### Mobile-First Principles

1. Design 375px first, enhance larger
2. Tab bar on bottom for thumb reach
3. Chat composer stays fixed at bottom
4. Modals become full-screen sheets on mobile
5. Tables convert to stacked card view below 768px
6. Hover interactions have touch equivalents

---

## 11. Phase Mapping

| Screen | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|--------|---------|---------|---------|---------|
| Landing page | – | ✓ (marketing) | refined | refined |
| Sign up/in | ✓ (basic) | ✓ | ✓ | ✓ |
| Data source choice | – | ✓ | ✓ | ✓ |
| File upload | ✓ (basic) | ✓ (with AI mapping) | ✓ | ✓ |
| Questionnaire | – | ✓ | ✓ | ✓ |
| Gap analysis | – | ✓ | ✓ | ✓ |
| Coach chat | ✓ | ✓ | ✓ | ✓ (voice) |
| Run tab | – | – | ✓ | ✓ (native) |
| Dashboard | ✓ (basic) | ✓ (full) | ✓ | ✓ |
| Plan | – | ✓ | ✓ | ✓ |
| Activity detail | ✓ | ✓ | ✓ | ✓ |
| Settings | ✓ (basic) | ✓ | ✓ | ✓ |
| Gear | ✓ | ✓ | ✓ | ✓ |
| Teams | – | – | ✓ | ✓ |
| Coach portal | – | – | ✓ | ✓ |
