import { buildAthleteContext } from "@/lib/ai/coach-context";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-4-7";

function anthropicKey(): string {
  return process.env.CADENCE_ANTHROPIC_KEY ?? process.env.ANTHROPIC_API_KEY ?? "";
}

export type BuiltWorkout = {
  title: string;
  workout_type:
    | "easy"
    | "long_run"
    | "tempo"
    | "interval"
    | "recovery"
    | "fartlek"
    | "progression"
    | "cross_train";
  target_distance_meters?: number;
  target_duration?: number;
  structure: {
    step: string;
    distance_m?: number;
    duration_s?: number;
    pace?: string;
    reps?: number;
    recovery_s?: number;
  }[];
  description: string;
};

/**
 * Turn a free-text workout description into a structured workout plan.
 * e.g. "4x1km @ 5k pace with 90s jog" → intervals with explicit reps
 */
export async function buildWorkout(
  athleteId: number,
  description: string,
): Promise<BuiltWorkout> {
  const ctx = await buildAthleteContext(athleteId);
  const system = `You convert plain-English running workout descriptions into structured JSON.

Return STRICT JSON matching this schema:
{
  "title": string,
  "workout_type": "easy"|"long_run"|"tempo"|"interval"|"recovery"|"fartlek"|"progression"|"cross_train",
  "target_distance_meters"?: number,
  "target_duration"?: number,
  "structure": Array<{
    "step": string,
    "distance_m"?: number,
    "duration_s"?: number,
    "pace"?: string,
    "reps"?: number,
    "recovery_s"?: number
  }>,
  "description": string
}

Rules:
- Break the workout into clear steps: warm-up, main set, recovery, cool-down.
- Always include a warm-up (10-15 min easy) unless the user says no.
- Always include a cool-down.
- For intervals, use reps + distance_m + recovery_s.
- For tempo, use distance_m + pace.
- For long runs, use target_distance_meters.
- Ground paces in the athlete's current VDOT if mentioned in ATHLETE CONTEXT.

ATHLETE CONTEXT:
${ctx}

Return only JSON.`;

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": anthropicKey(),
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [
        { role: "user", content: `Workout: "${description}"\n\nBuild structured JSON now.` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`buildWorkout failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { content: { type: string; text?: string }[] };
  const raw = json.content.filter((c) => c.type === "text").map((c) => c.text).join("");
  const cleaned = raw.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned) as BuiltWorkout;
}
