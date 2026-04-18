# Running Vocabulary & Knowledge Base

## Purpose

Runners use wildly inconsistent terminology. The AI coach must understand ALL variations and map them to canonical concepts. This vocabulary is embedded into pgvector alongside the training philosophies and coach personality to form the RAG knowledge base.

---

## Terminology Mapping

### Workout Types (User Says → We Understand)

| User might say | Canonical term | What it means |
|---------------|---------------|---------------|
| "tempo", "tempo run", "LT run", "threshold run", "comfortably hard", "lactate run", "T pace" | **Threshold** | Sustained effort at/near lactate threshold (~1hr race pace) |
| "intervals", "track work", "repeats", "reps", "speed work", "I pace", "VO2 work" | **Intervals** | Structured high-intensity repeats with rest |
| "easy run", "recovery run", "slow run", "shake out", "E pace", "zone 2 run", "conversational pace" | **Easy** | Low intensity, fully conversational |
| "long run", "the long one", "LSD" (long slow distance), "endurance run" | **Long Run** | Extended duration at easy-moderate effort |
| "fartlek", "speed play", "pick-ups" | **Fartlek** | Unstructured speed variations during a run |
| "progression", "negative split run", "build run" | **Progression** | Start easy, finish faster |
| "strides", "striders", "accelerations", "wind sprints" | **Strides** | Short (~100m) accelerations, not full sprints |
| "race", "PR attempt", "time trial", "TT" | **Race** | Maximum effort for distance |
| "warmup", "warm up", "WU" | **Warm-up** | Pre-workout easy running |
| "cooldown", "cool down", "CD" | **Cooldown** | Post-workout easy running |
| "hill repeats", "hill sprints", "hills" | **Hill Work** | Repeated uphill efforts |
| "cross training", "XT", "bike", "swim", "weights", "gym" | **Cross-Training** | Non-running activity |
| "rest", "off day", "day off" | **Rest** | No training |

### Pace Descriptions

| User might say | What it means |
|---------------|---------------|
| "easy pace", "conversational", "zone 1-2" | 60-75% max HR, can hold full conversation |
| "marathon pace", "MP", "M pace" | Goal marathon race pace |
| "tempo pace", "threshold", "T pace", "comfortably hard" | ~83-88% VO2max, can speak in phrases |
| "interval pace", "I pace", "5K pace", "hard" | ~95-100% VO2max, can barely speak |
| "rep pace", "R pace", "sprint pace", "all out" | Faster than VO2max pace, very short efforts |
| "goal pace", "race pace", "GP", "RP" | Target pace for upcoming race |
| "BQ pace" | Boston Marathon qualifying pace |
| "GAP", "grade adjusted pace" | Pace normalized for elevation |
| "negative split" | Second half faster than first |
| "positive split" | First half faster than second (usually bad) |
| "even split" | Consistent pace throughout |

### Effort/Intensity

| User might say | RPE equivalent | What it means |
|---------------|---------------|---------------|
| "super easy", "barely moving", "walking pace" | 1-2 | Recovery effort |
| "easy", "comfortable", "chill" | 3-4 | Aerobic base effort |
| "moderate", "steady", "not easy not hard" | 5-6 | "Grey zone" / general aerobic |
| "comfortably hard", "tempo effort" | 7 | Threshold-ish |
| "hard", "hurting", "pushing" | 8 | Race effort (15-30 min) |
| "very hard", "dying", "max effort" | 9-10 | Near-sprint, unsustainable |
| "RPE 7" | 7 | Direct Borg scale reference |

### Body/Feeling Descriptors

| User might say | Parsed meaning | Relevant to |
|---------------|---------------|-------------|
| "heavy legs", "dead legs", "legs were shot" | Muscular fatigue | Recovery status |
| "fresh", "bouncy", "spring in my step" | Well recovered | Recovery status |
| "side stitch", "side cramp" | Side stitch | During-run issue |
| "shin splints", "shin pain" | Shin splint risk | Injury tracking |
| "IT band", "ITB", "knee pain outside" | IT band syndrome | Injury tracking |
| "plantar", "heel pain", "arch pain" | Plantar fasciitis risk | Injury tracking |
| "runner's knee", "knee pain" | Patellofemoral pain | Injury tracking |
| "Achilles", "calf tightness" | Achilles tendinopathy risk | Injury tracking |
| "bonked", "hit the wall", "ran out of gas" | Glycogen depletion | Fueling issue |
| "cramping", "cramps" | Electrolyte/fatigue issue | During-run issue |
| "nauseous", "stomach issues", "GI problems" | GI distress | Fueling/heat issue |

### Training Concepts

| User might say | What it means |
|---------------|---------------|
| "base building", "building my base", "aerobic base" | High-volume easy running phase |
| "build phase", "building fitness" | Progressive overload phase |
| "peak week", "peak training" | Highest volume/intensity week before taper |
| "taper", "tapering" | Reduced volume before race |
| "deload", "deload week", "recovery week", "down week" | Planned reduced-load week |
| "cutback week" | Same as deload/recovery week |
| "block training", "training block" | Focused multi-week training period |
| "periodization" | Structured training phases |
| "mileage", "volume", "weekly miles/km" | Total running distance per week |
| "quality session", "quality day", "workout", "SOS" | Hard/structured training day |
| "junk miles" | Controversial: running that's too hard for easy, too easy for quality |
| "doubles", "two-a-days" | Running twice in one day |
| "stacking", "back to back" | Hard sessions on consecutive days |

### Metric Abbreviations

| Abbreviation | Full term |
|-------------|-----------|
| HR | Heart rate |
| BPM | Beats per minute |
| SPM | Steps per minute (cadence) |
| RPM | Revolutions per minute (cadence) |
| VO2max | Maximum oxygen uptake |
| LT, LT1, LT2 | Lactate threshold(s) |
| FTP | Functional Threshold Power |
| NP | Normalized Power |
| TSS | Training Stress Score |
| CTL | Chronic Training Load (fitness) |
| ATL | Acute Training Load (fatigue) |
| TSB | Training Stress Balance (form) |
| ACWR | Acute:Chronic Workload Ratio |
| VDOT | Daniels' VO2max equivalent |
| GAP | Grade Adjusted Pace |
| TRIMP | Training Impulse |
| HRV | Heart Rate Variability |
| RHR | Resting Heart Rate |
| MHR | Maximum Heart Rate |
| BQ | Boston Qualifier |
| PR, PB | Personal Record / Personal Best |
| CR | Course Record |
| DNS | Did Not Start |
| DNF | Did Not Finish |
| DFL | Dead F***ing Last (affectionate term) |

### Race Distances

| User might say | Standard distance |
|---------------|-------------------|
| "5K", "5k", "five K" | 5,000m / 3.1 miles |
| "10K", "10k", "ten K" | 10,000m / 6.2 miles |
| "15K" | 15,000m / 9.3 miles |
| "half", "half marathon", "HM", "13.1" | 21,097.5m / 13.1 miles |
| "full", "marathon", "the marathon", "26.2" | 42,195m / 26.2 miles |
| "ultra", "ultramarathon", "50K", "50 miler", "100K", "100 miler" | Anything beyond marathon |
| "mile", "the mile" | 1,609.34m |
| "800", "half mile" | 800m |
| "400", "quarter", "one lap" | 400m |
| "200", "half lap" | 200m |

---

## RAG Knowledge Base Architecture

### What Gets Embedded into pgvector

The AI coach's knowledge comes from these embedded documents:

| Knowledge Type | Source | Embedding Strategy | Table |
|---------------|--------|-------------------|-------|
| Training philosophies | TRAINING-PHILOSOPHIES.md | Chunk by section (~500 tokens each) | `knowledge_base` |
| Elite coaching methods | ELITE-COACHES-AND-PLANS.md | Chunk by coach/method | `knowledge_base` |
| Coach personality | COACH-PERSONALITY.md | Chunk by section | `knowledge_base` |
| Running vocabulary | This document | Chunk by category | `knowledge_base` |
| Activity history | User's activities | Per-activity summary | `activity_embeddings` |
| User notes | User's post-run feedback | Included in activity embedding | `activity_embeddings` |

### New Table: `knowledge_base`

```sql
CREATE TABLE knowledge_base (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category          text NOT NULL,    -- 'training_philosophy', 'coaching_method', 'personality', 'vocabulary', 'science'
  source_doc        text NOT NULL,    -- 'TRAINING-PHILOSOPHIES.md', 'ELITE-COACHES-AND-PLANS.md', etc.
  section_title     text NOT NULL,    -- 'Polarized Training', 'Jack Daniels VDOT', 'Maffetone Method'
  content           text NOT NULL,    -- The actual text chunk
  embedding         vector(1536),
  embedding_model   text NOT NULL DEFAULT 'text-embedding-3-small',
  metadata          jsonb,            -- {coach: "Jack Daniels", topic: "zones", subtopic: "threshold pace"}
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_knowledge_embedding ON knowledge_base
  USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_knowledge_category ON knowledge_base(category);
```

### How RAG Works at Query Time

```
User: "Should I be doing more tempo runs or is easy running enough?"

1. Embed the user's question → vector

2. Search knowledge_base for relevant training knowledge:
   → "Polarized Training (80/20)" section
   → "The Key Debates: Zone 2" section  
   → "Norwegian Double Threshold" section
   → "What ALL Great Coaches Agree On" section

3. Search activity_embeddings for relevant personal data:
   → User's recent tempo runs
   → User's easy run HR trends
   → User's training distribution

4. Compose prompt:
   - System: Condensed coach personality (~2500 tokens)
   - Knowledge context: Relevant training philosophy chunks (~2000 tokens)
   - Athlete context: Recent training data (~1500 tokens)
   - Personal data: Similar past activities (~1500 tokens)
   - Conversation: Last 20 messages (~2000 tokens)
   
5. Claude responds with philosophy-aware, data-informed answer:
   "Based on your data, you're currently running about 60% easy and 40% in the moderate zone — 
   which is actually the pattern most coaches warn against. Your easy runs are averaging 155bpm, 
   which is above your aerobic threshold. There are a few schools of thought here..."
```

### Why RAG Instead of Fine-Tuning

| Approach | Pros | Cons |
|----------|------|------|
| **RAG (our choice)** | Update knowledge instantly, no training cost, source attribution, can add new knowledge anytime | Requires good chunking and retrieval |
| **Fine-tuning** | Faster inference, knowledge baked in | Expensive to retrain, can't update easily, loses source attribution, risk of hallucination |

RAG is the right call because:
1. Training knowledge evolves (new research, new methods)
2. We need source attribution ("According to Jack Daniels' research...")
3. We want to add new knowledge without retraining
4. The knowledge base is small enough that retrieval is fast
5. Per-user activity data MUST be RAG (can't fine-tune per user)
