# Alma UI Study

> Deep research on Alma (alma.food) — the nutrition companion app whose design philosophy most closely matches what we want for Stride AI.
> Researched: 2026-04-17
> Designer of record: Smith & Diction

---

## Why Alma Is Our #1 Inspiration

Of every app studied in competitive research, Alma is the closest philosophical match for Stride AI. Both products:
- Explicitly reject the "gym-rat-robot" aesthetic of fitness apps
- Use "companion" framing (not tracker, not app, not coach-as-authority)
- Treat users as imperfect, whole humans — not optimization targets
- Emphasize celebration and curiosity over shame and discipline
- Combine AI with warm, editorial, soulful branding

Smith & Diction's branding case study on Alma reads like a philosophical manifesto for the space we want to occupy. Quote:

> "Alma is building a nutrition companion that meets you where you are and tracks actual imperfect human activity, not the gym rat robot that these other apps seem to assume their users are. You contain multitudes, and cheese."

Replace "nutrition" with "running" and "cheese" with "missed workouts and feel runs" — this is Stride AI's exact positioning.

---

## Key UI/Brand Observations

### Typography
- **Sans serif wordmark** — friendly, rounded, not corporate
- Body text is clean sans (likely Inter or similar)
- **Editorial tone** — headlines in confident sizes with breathing room
- Not trying to look "tech" — looks like a lifestyle brand with tech inside

### Color Palette
- **Cream / off-white backgrounds** (not pure white) — warm, paper-like
- **Green as primary accent** — vegetal, fresh, natural (for nutrition)
- Muted, desaturated palette overall — nothing neon, nothing harsh
- Warm neutrals (beige, soft grays) for supporting elements

### Visual Treatment: Collage + Photography
- **Collage aesthetic** — layered cut-paper feel, hand-arranged compositions
- Real food photography (mint, grapefruit, walnuts on homepage) used as standalone elements
- Photos of real people (users) — not stock athletes, not models
- Feels closer to a magazine spread than an app landing page
- Tag on Brand New review: "collage, green, icon, meal planning, sans serif, wordmark"

### Tone & Copy
Opening lines from their website:
- "The first nutrition coach that fits in your pocket."
- "Set goals that matter to you and get coached to reach them."
- "How are you feeling after a week of working on your new goal?"
- "Let's review your targets for the week to keep you on track."

Notice:
- First-person plural ("let's") — companionable, not commanding
- Feelings-first ("how are you feeling") — warmth before metrics
- Goal-setting from the user's perspective ("goals that matter to you")
- Never "you should" or "you must"

### Gamification (Done Right)
- Daily check-ins framed as conversational moments ("Today — check-in — how are you feeling...")
- Weekly reviews framed as collaborative planning ("Let's review your targets")
- Emoji accents to add warmth without being childish (🤧 for immune, ⚖️ for weight goals)
- Small visual delight, not overdone

### Natural Language Input (Same as Our Voice Pattern)
- "chickpea pasta with a drizzle of olive oil and marinara sauce" — natural speech, not form fields
- Voice, text, photo, barcode all accepted — they parse, not force structure
- 95% of nutrition app users abandon — Alma's research. Simpler input is the answer.
- **Direct parallel for us:** voice/text-first for workout feedback, workout building, general chat.

### Scientific Credibility (Without Clinical Aesthetic)
- Backed by Menlo Ventures
- Harvard T.H. Chan School of Public Health nutrition data
- Dr. Eric Rimm on Scientific Advisory Board
- But the UI never feels like a lab — warmth dominates the experience
- **Lesson:** Credibility lives in the copy and sourcing, not in making the UI look clinical

---

## What We Should Steal

### 1. The Word "Companion" Everywhere
Replace every instance of "tracker," "app," "platform," "coach" (where it sounds authoritative), and "user" with "companion" / "runner" / "athlete" wherever possible.

Examples:
- ❌ "Your training tracker"
- ✅ "Your running companion"
- ❌ "Users report..."
- ✅ "Runners tell us..."

### 2. Cream/Parchment Backgrounds
We already have `--neutral-50: #FAFAF7` for light mode page background. Good. But push further on chat / notes surfaces — go warmer (closer to `#FBF6EC` parchment) for the journal aesthetic.

### 3. Collage-Style Imagery
When we add photography or illustration (landing page, marketing, empty states):
- Cut-paper feel (layered compositions, subtle shadows)
- Real running scenes — real people, real trails, real sweat
- Avoid stock "athlete triumphantly raising fists at sunset" imagery
- Avoid technical gear close-ups (too clinical)
- Lean toward lifestyle (person lacing shoes at dawn, empty track at sunrise, trail through morning fog)

### 4. Conversational Microcopy Everywhere
Every piece of UI copy should sound like a friendly coach, not a system.

Examples:
- ❌ "Activity saved."
- ✅ "Got it — logged."
- ❌ "Error: unable to sync."
- ✅ "Hmm, can't reach Strava right now. I'll try again in a minute."
- ❌ "You have reached your weekly goal."
- ✅ "That's 42K this week — you hit your target. Nice work."

### 5. "Let's" Framing for Coach Actions
When the coach suggests, recommends, or guides: use "Let's [do the thing]" rather than "You should" or "Do this."

- ❌ "You should take today easy."
- ✅ "Let's keep today easy."

### 6. Feelings Before Metrics
Like Alma's "how are you feeling after a week of working on your new goal?" — our post-run prompts start with feel, not numbers.

- ❌ "Rate this workout 1-10."
- ✅ "How did that feel?"

### 7. Science Without the Lab Coat
Credibility comes from:
- Training philosophy research doc we built
- Citation to Daniels, Lydiard, Canova, etc. in context
- Showing the AI's reasoning transparently

NOT from:
- Medical iconography
- Clinical color palettes (cold blues, grays)
- Graphs as the dominant visual element
- Jargon as a flex

### 8. Warm Emoji Accents (Sparingly)
Not constant emoji — deliberate accents where they add warmth:
- In proactive coach messages: maybe a ☀️ for "good morning"
- In achievement insights: 🎉 once in a while (not every time)
- NEVER in data displays, NEVER in navigation
- Easy to overdo — rule: one per conversation at most

### 9. Editorial Composition
On the marketing site and certain hero screens:
- Large breathing-room compositions
- Typography as a design element (not just a reading tool)
- Asymmetric layouts OK (magazines do this)
- Layered, not flat

---

## What's Specific to Alma (Don't Copy)

### Green as Primary Color
Alma's green works for food/nutrition. For running, green is muddled (trail running, environmental, but not distinctive). Our `#E94E1B` Ember orange is right for us.

### Food Photography / Fruit Imagery
Beautiful mint/grapefruit/walnuts on Alma's homepage is domain-specific. Our equivalent:
- Morning light on empty track
- Close-up of worn shoes with grass/trail dust
- A runner's feet mid-stride
- Notebook with handwritten splits
- A water bottle next to a pair of shoes at sunrise

### Collage-Heavy Layouts on Every Screen
Alma pushes collage on the marketing site. We should use it more sparingly — the app itself is data-heavy and collage doesn't scale to dashboards. Reserve for marketing, onboarding, and specific hero moments.

### Nutrition-Specific Features
Meal logging, macro targets, barcode scanning, recipe discovery — all domain-specific to Alma. Not applicable to our UI/UX language.

---

## Direct Visual References

For future design sessions, these URLs contain the key Alma imagery:

- **alma.food homepage** — warm cream bg, cut-out fruit imagery, gamified cards
- **Smith & Diction Medium case study** — full branding logic, rationale, before/after
- **Brand New (UnderConsideration)** — editorial review (paywalled but tags confirm: collage, green, sans serif, wordmark)
- **60fps.design/apps/alma** — UI motion / interaction patterns (hold-to-commit button, etc.)
- **App Store listing** — screenshot gallery (10+ screens)
- **Instagram @almaknowsfood** — lifestyle imagery, brand voice in social copy
- **Alma press release on Fitt Insider** — positioning language, scientific credibility

---

## Applying This to Stride AI: Concrete Moves

### Immediate (in current design work)
1. **Chat screen** → Journal aesthetic with cream bg + handwriting for coach voice (this is where Alma's warmth translates most directly)
2. **Microcopy audit** → Replace clinical phrasing with "let's," "how did that feel," etc.
3. **Empty states** → Warm conversational prompts, not system messages
4. **Post-run feedback** → Feelings first, numbers second

### Medium-term (before launch)
1. **Lifestyle photography** → Commission or source running lifestyle imagery with Alma-like warmth
2. **Onboarding copy** → Full rewrite in companion voice
3. **Landing page** → Editorial composition with cut-paper accents (via Kokonut UI Pro templates customized)

### Long-term (brand maturity)
1. **Illustration system** → Develop a lightweight illustration style (maybe tied to the mascot — see NAME-AND-MASCOT.md)
2. **Email / communication** → Same conversational voice extends to emails, push notifications, error messages
3. **Community content** → Alma's Instagram tone as reference for any social/community content

---

## Top 3 Learnings Applied

1. **Journal/companion aesthetic for the chat** — cream parchment bg + handwriting font for coach voice. See `coach-chat-journal.html` prototype.
2. **Companion-first language** — Updated in DESIGN-GUIDE.md principles. Never "tracker," always "companion."
3. **"Let's" framing** — Updated in COACH-PERSONALITY.md microcopy rules.
