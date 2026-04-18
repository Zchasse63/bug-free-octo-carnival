# UX Philosophy: Chat-First AI Running Coach

## Core Principle

**The app IS a conversation with your AI coach.** Everything else is a supporting screen.

Think of it like the Claude/ChatGPT/Grok iOS app — but for running. The chat is the primary interface. The dashboard, run screen, and settings exist to support the conversation, not the other way around.

> **Phase Note**: Phase 1 is text-first (keyboard input). Voice input via Web Speech API is Phase 3. Native iOS voice (Apple Speech framework) is Phase 4. The UX principles below describe the full vision — adapt for text-only in early phases.

---

## App Structure

### Primary Screens

1. **Coach Chat** (Home / Default Screen)
   - The main interface. This is where 80% of interaction happens.
   - Voice-first input (tap to talk, or type)
   - Give workout feedback: "That run felt heavy, my legs were tired from yesterday's HIIT"
   - Create workouts: "Build me 400m repeats for tomorrow"
   - Ask questions: "How does my pace compare to last month?"
   - Get insights: Coach proactively shares observations
   - Review past notes: "What did I say about my long run last week?"
   - All conversation history is persistent and searchable

2. **Live Run Screen**
   - Active workout display during a run
   - Current pace, HR, distance, elapsed time
   - Workout structure (if following a planned workout)
   - Minimal — glanceable on a phone or watch

3. **Dashboard**
   - Visual summary of training data
   - Weekly/monthly volume charts
   - Fitness/fatigue/form trends
   - Recent AI insights cards
   - PR tracking
   - Quick-glance, not the primary interaction point

4. **Activity Detail**
   - Deep dive into a specific workout
   - Laps, splits, HR/pace charts, map
   - AI analysis of that specific workout
   - User's voice/text notes attached
   - Segment efforts and PRs

5. **Training Plan**
   - Calendar view of planned vs completed workouts
   - Adaptive — shows adjustments the AI has made
   - Tap any planned workout to see details or modify via chat

6. **Settings / Profile**
   - Account, goals, preferences
   - Connected devices
   - Notification preferences
   - Subscription management

### Navigation

```
Tab Bar (4 tabs):
├── Coach (Chat)     ← Default, primary
├── Run (Live)       ← Active workout
├── Dashboard        ← Data visualization
└── Plan             ← Training calendar
    
Settings accessible from profile icon in top nav
Activity detail accessed by tapping any activity from dashboard or chat
```

---

## Free-Flow Workout Feedback

### The Problem with Existing Apps
- 1-10 scores are reductive — "7" means nothing in 3 months
- Smiley faces are worse — no nuance
- Users can't remember what a "6" felt like
- No way to capture the *why* behind how a workout felt
- Structured inputs force users into categories that may not apply

### Our Approach: Voice/Text Notes

After every workout (or anytime in chat), users can:

**Voice input** (primary — friction-free, post-run when hands are sweaty):
> "That was tough. My legs felt heavy from the start, probably because of yesterday's weight session. Intervals felt okay pace-wise but my heart rate was higher than usual. Last two reps I really struggled to maintain form."

**Text input** (secondary — for when voice isn't practical):
Same content, typed in the chat.

### What We Do With It

The AI parses the note and extracts structured data while preserving the original:

```
Original note: (stored verbatim — the user sees this when they look back)
Parsed tags: [fatigue, cross-training-impact, hr-drift, form-breakdown]
Perceived effort: 8/10 (AI-estimated from language)
Key factors: legs heavy, HR elevated, form degraded late
Related context: weight training previous day
```

This parsed data feeds into:
- **Adaptive planning**: "User reported heavy legs after weight training → adjust tomorrow's run"
- **Pattern detection**: "User consistently reports fatigue on runs after HIIT → suggest spacing"
- **Trend analysis**: "Positive sentiment increasing over 4-week block → fitness improving"
- **Searchable history**: User asks "when did I last feel great on a long run?" → semantic search through notes

### Storage Design

Workout notes live in the chat conversation AND get linked to the activity:

```
activity_notes table:
  - activity_id (links to the workout)
  - raw_text (exactly what the user said)
  - voice_transcript (if voice input, the raw transcription)
  - ai_parsed_tags (structured extraction)
  - perceived_effort (AI-estimated 1-10)
  - sentiment (positive/neutral/negative)
  - key_factors (extracted themes)
```

---

## Voice-First Design Principles

1. **Every text input should also accept voice** — microphone button everywhere
2. **Voice is the default post-run** — after a workout ends, prompt with voice input first
3. **Transcription happens on-device** (Apple Speech framework) — fast, private
4. **AI processes the transcript** — extracts meaning, doesn't require perfect transcription
5. **Users can review and edit** — see the transcript, correct if needed
6. **Voice notes are timestamped** — "What did I say after my run on Tuesday?"

---

## Chat as the Hub

The chat isn't just for feedback. It's the central nervous system:

| Action | How It Works in Chat |
|--------|---------------------|
| Post-run feedback | Voice/text note → parsed → linked to activity |
| Create workout | "Build me intervals for tomorrow" → structured workout → send to watch |
| Ask about data | "What's my 5K trend?" → AI queries DB → responds with chart + analysis |
| Get recommendations | "What should I do today?" → AI checks plan, recent load → suggests workout |
| Review history | "Show me my notes from last week" → retrieves past feedback |
| Adjust plan | "I'm feeling tired, can we back off this week?" → AI modifies plan |
| Race prep | "I have a 10K in 3 weeks" → AI builds taper plan from current fitness |

### Proactive Coach Messages

The AI doesn't just respond — it initiates:
- Post-sync: "Nice run this morning! Your pace was 15s/mi faster than last week's easy run — was that intentional or did it feel easy?"
- Weekly check-in: "You've hit 3 of 5 planned runs this week. Want to adjust Friday's long run?"
- Pattern alert: "Your average HR on easy runs has been climbing for 2 weeks — might be time for a recovery week"
- Milestone: "You just logged your 100th run this year!"

---

## What This Is NOT

- Not a social app (no feed, no followers — Strava already does this)
- Not a data dashboard with a chat bolted on (the chat IS the product)
- Not a static training plan generator (it adapts continuously)
- Not limited to running (weight training, HIIT, and cross-training are tracked and factored in)
