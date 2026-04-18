/**
 * Seed knowledge_base with a curated set of philosophy-neutral training content.
 * Expansion: parse full planning docs in a later pass.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { createServiceClient } from "@/lib/supabase/service";
import { embedMany } from "@/lib/ai/openai";

type Seed = {
  category:
    | "coaching_philosophy"
    | "training_method"
    | "running_vocabulary"
    | "coach_personality"
    | "injury_prevention"
    | "nutrition"
    | "general";
  title: string;
  content: string;
  source_doc?: string;
  tags?: string[];
};

const SEEDS: Seed[] = [
  // ==== Coach personality (philosophy-neutral) ====
  {
    category: "coach_personality",
    title: "Coach voice",
    content:
      "You are Cadence, an AI running coach for Zach. Your voice is direct, warm, and specific. You lead with data but never reduce a runner to numbers. You ask one sharp question rather than a survey. You acknowledge feelings without making them the whole story. You never cheerlead empty praise — if a run was mediocre, say so and offer a concrete read on why.",
  },
  {
    category: "coach_personality",
    title: "What to avoid",
    content:
      "Avoid generic motivation language like 'crushing it' or 'you got this'. Avoid false precision (no 'exactly 6.3% harder today'). Avoid diagnosing injuries — always recommend a professional for anything medical. Avoid re-hashing what the athlete already knows; skip to the insight.",
  },
  {
    category: "coach_personality",
    title: "Coaching principles",
    content:
      "1. Consistency beats intensity. 2. Most runs should be easy. 3. Progressive overload with adequate recovery. 4. Fatigue management via TSB/ACWR. 5. Individual response over universal prescription. 6. Specificity — train the event you're training for.",
  },

  // ==== Training methods (philosophy-neutral summaries) ====
  {
    category: "training_method",
    title: "Jack Daniels' VDOT",
    content:
      "VDOT is a single number representing current aerobic fitness, derived from race performance or quality-workout pace. Paces for Easy, Marathon, Threshold, Interval, and Repetition efforts scale from VDOT. Most runners over-run easy days and under-recover; Daniels' prescription is strict about easy pace being easy.",
    tags: ["VDOT", "daniels", "pace"],
  },
  {
    category: "training_method",
    title: "Polarized training (Seiler)",
    content:
      "Roughly 80% of training below ventilatory threshold (very easy), 20% above lactate threshold (hard), almost nothing in the middle 'moderate' zone. Produces strong adaptation with lower cumulative fatigue than pyramidal or threshold-heavy plans. Works well for well-trained runners.",
    tags: ["polarized", "seiler", "80-20"],
  },
  {
    category: "training_method",
    title: "Pyramidal (Lydiard base-building)",
    content:
      "Lots of easy aerobic running at the base, less tempo/threshold work, least amount of VO2max and speed work at the top of the pyramid. Long base phase before introducing quality. Favors volume.",
    tags: ["lydiard", "pyramidal", "base"],
  },
  {
    category: "training_method",
    title: "Threshold training (Magness/Pfitzinger)",
    content:
      "Emphasizes lactate-threshold work (often 'comfortably hard' / tempo pace). Raises the pace an athlete can sustain aerobically. Pfitzinger's marathon plans are threshold-heavy with long mid-week tempos.",
    tags: ["threshold", "pfitzinger", "tempo"],
  },
  {
    category: "training_method",
    title: "Heart rate zones (5-zone common model)",
    content:
      "Zone 1 (<68% maxHR): active recovery. Zone 2 (68-78%): aerobic base/easy. Zone 3 (78-87%): tempo/marathon. Zone 4 (87-94%): threshold/lactate. Zone 5 (>94%): VO2max/repetition. LTHR ≈ 89% of maxHR for most runners not lab-tested.",
    tags: ["zones", "heart rate"],
  },

  // ==== Training load ====
  {
    category: "general",
    title: "CTL, ATL, TSB explained",
    content:
      "CTL (Chronic Training Load) = 42-day EMA of daily training load, represents fitness. ATL (Acute Training Load) = 7-day EMA, represents fatigue. TSB = CTL - ATL, represents form. Negative TSB means accumulated fatigue (productive training), positive TSB means fresh (good for racing). TSB below -30 is overreaching territory.",
    tags: ["CTL", "ATL", "TSB", "training load"],
  },
  {
    category: "general",
    title: "ACWR and injury risk",
    content:
      "Acute:Chronic Workload Ratio = this week's training load / 4-week average. Sweet spot 0.8-1.3 (productive). Above 1.5 is danger zone with significantly elevated injury risk. Below 0.8 suggests detraining.",
    tags: ["ACWR", "injury"],
  },

  // ==== Running vocabulary ====
  {
    category: "running_vocabulary",
    title: "Easy / Aerobic run",
    content:
      "Conversational pace, zone 1-2 HR, typical 60-90 seconds/mile slower than marathon pace. The foundation of any training plan. Should genuinely feel easy — if it doesn't, it's too fast.",
    tags: ["easy", "aerobic"],
  },
  {
    category: "running_vocabulary",
    title: "Tempo run",
    content:
      "'Comfortably hard' pace, roughly lactate threshold, typically one-hour race pace or slightly slower. Usually 20-40 minutes of continuous effort. Builds the pace you can sustain aerobically.",
    tags: ["tempo", "threshold"],
  },
  {
    category: "running_vocabulary",
    title: "Intervals / VO2max",
    content:
      "Repetitions at VO2max pace (roughly 3000m-5K race pace), typically 3-5 minute intervals with equal or shorter recovery. Develops maximum aerobic capacity. Examples: 5x1000m, 6x800m.",
    tags: ["intervals", "VO2max"],
  },
  {
    category: "running_vocabulary",
    title: "Long run",
    content:
      "The longest single run of the training week, usually 20-30% of weekly volume. Builds aerobic endurance, glycogen storage capacity, and mental toughness. Generally easy pace with optional segments at marathon pace or faster for specific training.",
    tags: ["long run"],
  },
  {
    category: "running_vocabulary",
    title: "Fartlek",
    content:
      "Swedish for 'speed play' — unstructured surges within a continuous run. Less formal than intervals. Good for staying flexible, responding to how you feel on the day.",
    tags: ["fartlek"],
  },
  {
    category: "running_vocabulary",
    title: "Progression run",
    content:
      "A run that starts easy and gets faster, often ending at marathon pace or tempo. Trains the ability to finish strong and simulates late-race fatigue.",
    tags: ["progression"],
  },
  {
    category: "running_vocabulary",
    title: "Recovery run",
    content:
      "Very easy, short (30-45 min). Purpose is active recovery, not fitness gain. Flushes the legs the day after a hard session.",
    tags: ["recovery"],
  },

  // ==== Weather / heat adjustment ====
  {
    category: "general",
    title: "Heat adjustment for pace",
    content:
      "Running in heat slows you down at the same effort. Rough adjustments vs. optimal (50-55°F / 10-13°C): +0-10s/mi at 55-65°F, +10-30s at 65-75°F, +30-60s at 75-85°F, +60-90s+ above 85°F. Humidity compounds the effect — dew point above 60°F (16°C) adds meaningful stress.",
    tags: ["heat", "weather"],
  },

  // ==== Injury prevention ====
  {
    category: "injury_prevention",
    title: "Early-warning signals",
    content:
      "Watch for: morning heart rate elevated >5 bpm above baseline, HR higher than expected at easy pace, persistent soreness beyond 48 hours, disturbed sleep, declining motivation, or mild pain that persists beyond a few runs. Any one is a yellow flag; two or more is a reason to back off.",
    tags: ["injury", "overtraining"],
  },
  {
    category: "injury_prevention",
    title: "Shoe rotation and mileage",
    content:
      "Most running shoes lose measurable cushioning after 300-500 miles. Rotating 2-3 pairs reduces cumulative stress on any single pair and gives soft tissue varied loading patterns. Track mileage; swap in new shoes before the old ones feel dead, not after.",
    tags: ["shoes", "gear"],
  },

  // ==== Nutrition ====
  {
    category: "nutrition",
    title: "Easy-run fueling",
    content:
      "Most easy runs under ~75 minutes don't need fuel during. A pre-run coffee is fine. Fasted easy running is an option to train fat oxidation, but don't fast before quality sessions.",
    tags: ["fuel", "easy"],
  },
  {
    category: "nutrition",
    title: "Marathon-pace and long runs",
    content:
      "Anything at marathon pace or faster above 90 minutes warrants carbohydrate intake during — aim for 30-60g/hr, up to 90g/hr with trained gut. Practice race-day fueling on long runs.",
    tags: ["fuel", "marathon", "long run"],
  },
];

async function main() {
  const sb = createServiceClient();

  // Check if already seeded
  const { count } = await sb.from("knowledge_base").select("*", { count: "exact", head: true });
  if ((count ?? 0) >= SEEDS.length) {
    console.log(`knowledge_base already has ${count} rows — skipping seed`);
    return;
  }

  console.log(`Embedding ${SEEDS.length} entries...`);
  const inputs = SEEDS.map((s) => `${s.title}\n\n${s.content}`);
  const vectors = await embedMany(inputs);

  const rows = SEEDS.map((s, i) => ({
    content: s.content,
    // Supabase expects pgvector as a JSON string or bracket list; the client serializes correctly when passed as unknown array
    embedding: `[${vectors[i].join(",")}]` as unknown as string,
    category: s.category,
    source_doc: s.source_doc ?? null,
    title: s.title,
    tags: s.tags ?? null,
  }));

  const { error } = await sb.from("knowledge_base").insert(rows);
  if (error) throw error;
  console.log(`Seeded ${rows.length} knowledge_base entries`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
