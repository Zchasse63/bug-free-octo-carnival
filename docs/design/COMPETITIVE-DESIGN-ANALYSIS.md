# Competitive Design Analysis

> What we learn from studying the best (and worst) UIs in athletic training and AI chat interfaces.
> Research date: 2026-04-17
> Sources scraped: Strava, Runna, Whoop, Oura, TrainingPeaks, Intervals.icu, Garmin Connect, Claude.ai, Perplexity, Linear, Vercel, Superhuman, shadcn/ui, Recharts

---

## Key Findings by Category

### Athletic Dashboards

#### Strava (web)
**Strengths:**
- Activity feed is the primary information architecture — users open the app to see "what happened"
- Clean activity cards with polyline maps, key metrics (pace, distance, time, HR, elevation)
- Social proof (kudos, comments) integrated directly into the feed
- Iconic orange (#FC5200) used sparingly but recognizably

**Weaknesses:**
- Dashboard is really just a feed — doesn't help you understand training
- No clear call-to-action for insights or coaching
- Data-rich but context-poor — shows numbers without meaning
- Mobile experience better than web (web feels secondary)

**What to steal:** Activity card format, polyline integration, clean typography
**What to avoid:** Feed-first architecture, meaning-free data display

---

#### Runna (now Strava-owned)
**Strengths:**
- Beautifully designed onboarding and plan generation
- Clear plan calendar with color-coded workout types
- High-quality mobile-first design (4.9 App Store rating)
- Workout cards show structure clearly (warmup → intervals → cooldown)

**Weaknesses:**
- Static plans — no real-time adaptation
- Feedback is sycophantic ("Great job!") without depth
- Strength/yoga/mobility feels bolted on
- Limited to plan-following; no free-form interaction

**What to steal:** Plan calendar design, structured workout cards, onboarding flow polish
**What to avoid:** Sycophantic feedback, static plan mentality, form-heavy input

---

#### Whoop
**Strengths:**
- Strong focus on RECOVERY and READINESS (not just training)
- Circular/orb visualizations for scores (Strain, Recovery, Sleep)
- Clean, editorial feel — almost magazine-like
- Cohesive dark-mode-leaning aesthetic
- Color-coded status system (green = recovered, yellow = caution, red = overtraining)

**Weaknesses:**
- Overly clinical at times — reads like a lab report
- Subscription-gated — users feel they're constantly upsold
- Data can feel abstract without context ("Recovery: 67%" — so what?)

**What to steal:** Circular score visualizations, color-coded readiness, editorial typography
**What to avoid:** Clinical tone, abstract metrics without actionable context

---

#### Oura (web dashboard)
**Strengths:**
- Beautiful circular visualizations for Sleep, Activity, Readiness scores
- Warm color palette (purples, oranges, deep blues) — distinctive
- Clean typography
- Focus on "how you feel" not just "what you did"
- Visual hierarchy: one hero metric per screen, details below

**Weaknesses:**
- Dark mode heavy — can feel sleep-apnea-clinic-y
- Activity tracking is secondary to sleep/recovery
- Limited training-specific features (aimed at general wellness, not athletes)

**What to steal:** Circular visualizations, hero-metric-per-screen pattern, warm/editorial feel
**What to avoid:** Too much dark, wellness-focused language for athletic audience

---

#### TrainingPeaks
**Strengths:**
- The gold standard for structured training data
- Performance Management Chart (PMC) — THE standard visualization for CTL/ATL/TSB
- Calendar is dense but scannable
- Colors map to training zones consistently

**Weaknesses:**
- Feels like 2015 software — heavy chrome, small text, dense
- Information overload for new users
- Workout creation is form-heavy and technical
- Mobile experience is poor

**What to steal:** PMC chart pattern, calendar density, zone color consistency
**What to avoid:** Chrome-heavy UI, form overload, desktop-only mentality

---

#### Intervals.icu
**Strengths:**
- Power-user favorite (cyclists/runners who want deep data)
- Every feature is data-rich (power curves, decoupling, fitness charts)
- Free (loved by users)
- Free-form chart configuration
- Deep customization for zones and metrics

**Weaknesses:**
- Looks like a 2010-era web app (function over form)
- Overwhelming for new users
- No coaching or interpretation — just data
- Chat and social features feel bolted on

**What to steal:** Depth of data analysis, zone configuration flexibility, decoupling/drift charts
**What to avoid:** Dated UI, no interpretation layer, feature-list-as-homepage

---

#### Garmin Connect (web)
**Strengths:**
- Comprehensive — nearly every metric from Garmin devices
- Activity detail is detailed (map, splits, HR chart, power chart)
- Training Status framework (Productive, Maintaining, Overreaching, etc.)

**Weaknesses:**
- UI feels designed-by-committee
- Insights are generic and often ignored by users
- Navigation is confusing
- Updates rarely improve UX

**What to steal:** Training Status framework (readiness categories), activity detail depth
**What to avoid:** Generic coaching insights, confused nav

---

### AI Chat Interfaces

#### Claude.ai
**Strengths:**
- Clean, minimal chat interface — the conversation IS the product
- Great use of whitespace
- Artifact previews render inline (images, code, charts)
- Streaming text with a smooth cursor
- Sidebar with conversation history, searchable

**Weaknesses:**
- Could use richer embedded content options
- Mobile web experience is ok but not great

**What to steal:** Conversation-as-hero design, inline rich content, sidebar history, streaming polish
**What to avoid:** Nothing major

---

#### ChatGPT
**Strengths:**
- Familiar chat pattern (bubbles, sidebar, streaming)
- Custom GPTs pattern for specialized modes
- Wide adoption means users know how to interact

**Weaknesses:**
- Dense conversation history can become overwhelming
- No structured data rendering beyond basic markdown
- Chat sprawl — hard to find past conversations

**What to steal:** Familiar patterns (users know how to chat), markdown rendering
**What to avoid:** Chat sprawl, weak conversation organization

---

#### Perplexity
**Strengths:**
- Tool-call visualization is excellent (shows WHAT sources were used)
- Citations inline with answer text
- "Thinking" state is visible (shows work in progress)

**Weaknesses:**
- Can feel like search results more than a conversation
- Follow-up suggestions sometimes feel forced

**What to steal:** Tool-call transparency, inline citations, "thinking" state visibility
**What to avoid:** Forcing follow-ups, search-result-y feel

---

#### Linear (general product, not chat)
**Strengths:**
- Gold standard for dense-but-clean UI
- Keyboard-first (every action has a shortcut)
- Subtle color palette with strategic accent color use
- Typography hierarchy is pristine
- Fast — feels native despite being web

**Weaknesses:**
- Learning curve for keyboard shortcuts
- Can feel overwhelming for casual users

**What to steal:** Typography, information density done right, keyboard shortcuts, speed
**What to avoid:** Require keyboard shortcuts (make them optional)

---

### Design System References

#### shadcn/ui Dashboard Examples
**Strengths:**
- Clean, modern aesthetic with great defaults
- Copy-paste components (not a framework lock-in)
- Excellent dark mode support
- Strong typography defaults

**What to steal:** Most components as base, dark mode conventions, typography defaults

---

#### Recharts
**Strengths:**
- Sensible chart defaults
- Works well with Tailwind/shadcn
- Responsive out of the box
- Good tooltip patterns

**What to steal:** Chart defaults, tooltip pattern

---

## Synthesis: Design Principles for Stride AI

Based on the research, here are the design principles that should guide Stride AI:

### 1. Conversation First, Data Second
Like Claude.ai and Perplexity, the chat IS the product. Unlike Strava (feed-first) or TrainingPeaks (chart-first), we lead with conversation and let data support it.

### 2. Interpretation Over Raw Data
Every number should have context. Unlike Strava ("you ran 10K") and Intervals.icu ("here's your power curve"), we say WHY it matters. "Your easy run HR was 8bpm higher than last week — let's see why."

### 3. Warm Editorial Feel
Lean toward Oura's warm palette and editorial feel, not Whoop's clinical lab-report aesthetic. We're a coach, not a diagnostic tool.

### 4. Numerical Typography Done Right
Like Linear and shadcn/ui, use tabular figures for paces, times, HR values. Running data is constantly-changing numbers — they must not cause layout shift.

### 5. Color Coding for Zones
Like TrainingPeaks, use consistent zone colors throughout. HR zones should be the same color wherever they appear (in charts, bars, activity cards, chat messages).

### 6. Dense But Scannable
Like Linear, pack information but keep it scannable. Not Strava-sparse, not TrainingPeaks-overwhelming. Information density with clear hierarchy.

### 7. Readiness Framework
Like Whoop and Garmin's Training Status, have a clear readiness indicator. Green/yellow/orange/red. Not a score in isolation — a recommendation.

### 8. Light Mode Primary, Dark Mode Quality
Unlike Whoop/Oura (dark heavy), default to light mode but have a dark mode that's genuinely well-designed, not an inverted afterthought.

### 9. Structured Workout Visualization
Like Runna and Intervals.icu, show structured workouts as cards with visual structure (warmup → intervals → cooldown). Not as blocks of text.

### 10. AI Transparency
Like Perplexity, show when the AI is thinking, what tools it used, what sources informed the answer. Builds trust.

---

## Color Palette Observations

### What Works for Athletic Apps
- **Strava**: Orange (#FC5200) — iconic, energetic, used sparingly
- **Whoop**: Light gray / white / black with teal accents — clinical, pro
- **Oura**: Purples + oranges + warm deeps — editorial, distinctive
- **TrainingPeaks**: Red, blue, yellow, green zones — functional but dated
- **Runna**: Teal + orange + clean whites — friendly, modern

### Our Direction (tentative)
- **Primary accent**: A warm running-associated color (NOT Strava orange to avoid similarity) — propose a deep coral/red-orange like #E94E1B or a focused amber like #F59E0B
- **Supporting palette**: Warm grays for backgrounds (not cold gray), with deep navy for text (not pure black)
- **Zone colors**: Consistent across the app using a perceptually-uniform scale
- **Semantic colors**: Green for positive, amber for caution, red for warning (standard)

---

## Typography Observations

### What Works
- **Linear/Vercel**: Inter or Geist — clean, neutral, authoritative
- **Claude.ai**: System fonts with intentional line height
- **Oura**: Warm serif for display + clean sans for UI
- **TrainingPeaks**: Too many font sizes, inconsistent hierarchy

### Our Direction (tentative)
- **UI font**: Inter (widely supported, great for data) OR Geist Sans (modern, newer)
- **Monospace**: JetBrains Mono or Geist Mono for times/paces
- **Optional display font**: Consider a subtle serif or distinctive sans for hero numbers (race times, big stats)
- **Tabular figures**: MUST use tabular-nums for all numeric displays

---

## Information Architecture Observations

### What Works
- **Claude.ai**: Chat as hero, history in sidebar, that's it
- **Linear**: Issues + Projects + Cycles + Settings — minimal nav
- **Oura**: Sleep + Activity + Readiness — three hero concepts

### What Doesn't
- **TrainingPeaks**: 15 nav items, tabs within tabs, lost in the UI
- **Strava**: Feed is front and center but coaching is buried
- **Intervals.icu**: Every feature exposed at the nav level

### Our Direction (confirmed)
4 tabs: **Coach** (chat, hero), **Run** (live workout), **Dashboard** (data viz), **Plan** (training calendar)
Settings via profile menu, not a tab. Activity detail accessed by tapping, not in nav.

---

## Motion Observations

### What Works
- **Linear**: Micro-animations are fast (150-200ms), smooth easing
- **Claude.ai**: Streaming text cursor blinks naturally, no distracting motion
- **Vercel**: Page transitions are near-instant

### What Doesn't
- **Whoop**: Too much motion on load, feels stagey
- **Runna**: Onboarding has lots of delight animations — charming first time, annoying repeatedly

### Our Direction
- Fast (150-250ms) for interactions
- No decorative animation on data-loaded screens (data is the star)
- Motion has purpose (confirm action, show state change) — never decorative
- Respect `prefers-reduced-motion`

---

## Chat UI Patterns (Critical — This is Our Hero)

### Must Have
- User messages right-aligned, coach messages left-aligned
- Streaming text with blinking cursor during generation
- Markdown rendering (bold, lists, code blocks)
- Inline rich content cards (activity cards embedded in coach responses)
- Conversation history in collapsible sidebar
- Search across all conversations
- Timestamp on message hover (not always visible)
- Coach avatar for visual anchor

### Nice to Have
- Voice input button (Phase 3)
- Tool-call visibility ("Looking at your recent runs...")
- Suggested follow-up questions (context-aware)
- Copy message / share message
- Bookmark important coach messages

---

---

## Reference Apps Zach Loves (Primary Inspiration)

### Bevel (bevel.health)
**What it is:** All-in-one health app covering recovery, fitness, nutrition, sleep.

**Strengths:**
- Warm, editorial hero photography (person on a hillside, not gym selfies)
- Simple, human headings: "Smarter Recovery", "Fuel That Moves You Forward", "Dial In Your Sleep", "Push With Purpose"
- Percentage-based stats (Recovery 73%, Sleep 75%) — scannable at a glance
- AI chat integration for workout generation feels natural, not bolted on
- Clean metric cards with icons and clear labels
- Green accents (natural, life-affirming) without being overtly eco/wellness-coded
- Dynamic Island integration shown in marketing — platform-native feel

**Key lesson:**
Health data CAN feel warm, not clinical. The hero photography sets emotional tone before data loads.

**What to steal:**
- Editorial hero photography approach
- Simple, human headings (no "Analytics Dashboard" — say "Your Week")
- Percentage-scored summaries with semantic coloring
- AI chat integrated as a feature, not a sidebar afterthought
- Native platform integrations (show we belong on iOS)

---

### MacroFactor (macrofactor.com)
**What it is:** Nutrition tracker with adaptive AI coaching. "Smart Macro Tracker & Diet Coach."

**Strengths:**
- Core positioning is the EXACT parallel to our product: "Coaching calibrated to your metabolism" → "Coaching calibrated to your training response"
- "Custom diet plan for crushing your goal" — simple, benefit-driven
- "Smart insights on bodyweight trends" — not just raw data, interpreted trends
- Adaptive: "Get a dynamic nutrition plan that adjusts your diet to fit your metabolism"
- Progress photos + body metrics — multi-modal tracking (matches our notes + context factors approach)
- Strong icon system — each feature has a distinct, clean icon
- AI calorie tracking via photo (frictionless input)

**Key lesson:**
The adaptive coaching story works. Users want a plan that adjusts to their actual biology, not a static program. Our "plan that adapts to actual execution" is the same pattern in running.

**What to steal:**
- "Coaching calibrated to your [X]" framing
- Feature cards with distinct icon per feature
- Emphasis on adaptation as the hero differentiator
- Frictionless input methods (photo for MacroFactor = voice for us)
- Smart trend insights (not just raw data)

---

### Alma (alma.food)
**What it is:** Nutrition companion app. Branding by Smith & Diction.

**Strengths:**
- **Philosophy-first branding** — explicitly rejects the "gym rat robot" aesthetic of other tracking apps
- Quote: "Alma is building a nutrition companion that meets you where you are and tracks actual imperfect human activity, not the gym rat robot that these other apps seem to assume their users are. You contain multitudes, and cheese."
- Warm, artful visual identity — soulful, not sterile
- Cultural awareness (Indian food, Ethiopian food get first-class support)
- "It's much easier to stand out in a sea of bland with a really good brand"
- Companion framing — not a tracker, a companion

**Key lesson — THIS is the most important insight from all research:**
> The fitness/training space is full of bland, soulless, gym-rat-robot apps. Standing out requires genuine personality, warmth, and respect for users as whole humans who run sometimes and also eat cheese and skip workouts and feel emotions.

**What to steal:**
- **Philosophy of design** — we are a running COMPANION, not a training tracker
- Editorial feel over clinical
- Brand personality as competitive moat (Runna/Strava can't easily copy warmth)
- Respect for imperfect human behavior (missed workouts, feel-based running, gaps, bad days)
- "Meets you where you are" framing for onboarding

---

## Updated Design Principles (After Bevel/Alma/MacroFactor Research)

The three apps above push our design direction in a specific way. Updating the principles:

### 11. Companion, Not Tracker
We don't just record what you did — we notice it, understand it, and discuss it. The language is "companion" or "coach" or "training partner" — never "tracker" or "analytics platform."

### 12. Soul Over Steel
Reject the gym-rat-robot aesthetic. No hex grids of data, no neon energy bars, no "CRUSH IT" copy. Warm, human, occasionally imperfect. Bevel's hillside photos, not TrainingPeaks' gauge clusters.

### 13. Adaptive Coaching as Hero
Take the MacroFactor framing seriously: the adaptation IS the product. Not data display, not workout logging — the coaching that bends to your reality. This should be the first thing a new visitor learns about us.

### 14. Honor Imperfect Humans
Running plans fail. People miss workouts. People take a month off because their cat died. People try new shoes that hurt. The app should meet users in that reality — not shame them for it. This is Alma's principle applied to running.

---

## Key Competitive Gaps (Our Opportunity)

1. **No app connects training data to AI coaching in real-time** — Strava has data but no coaching, Runna has plans but no adaptation
2. **No app lets you describe a workout in natural language** — all use form-based builders
3. **No app surfaces insights without requiring the user to hunt** — all make you dig
4. **No app has proper post-run feedback integration** — Strava comments don't feed back into coaching, Runna ratings are shallow
5. **No app does shoe intelligence properly** — Runna tracks mileage but doesn't correlate with pace
6. **No app handles training gaps gracefully** — they just have holes in your history
7. **No app handles cross-training impact well** — weights, HIIT, cycling don't factor into running coaching
