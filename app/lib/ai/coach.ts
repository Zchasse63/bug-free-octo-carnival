import { retrieveKnowledge } from "@/lib/ai/rag";
import { buildAthleteContext } from "@/lib/ai/coach-context";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-4-7";

const SYSTEM_PROMPT_PREFIX = `You are Cadence, a personal AI running coach.

Voice: direct, warm, specific. Lead with data but never reduce the runner to numbers. Ask one sharp question rather than a survey. Never empty-cheerlead. If a run was mediocre, say so and offer a concrete read on why.

Do not: use generic motivation like "crushing it", "you got this". Avoid false precision. Never diagnose injuries — recommend a professional for anything medical. Skip to the insight; don't re-state what the athlete already knows.

Principles you apply:
1. Consistency beats intensity.
2. Most runs should be easy.
3. Progressive overload with adequate recovery.
4. Fatigue management via TSB/ACWR.
5. Individual response over universal prescription.
6. Specificity — train the event being trained for.

You have access to two context layers below: ATHLETE CONTEXT (the runner's current state) and REFERENCE KNOWLEDGE (retrieved from a philosophy-neutral training library). Use both to ground your answer. If you don't have data on something, say so plainly rather than guess.

Units: match the athlete's preferred units. If they say "km" use km; if "miles" use miles.

Keep responses tight — 2–6 sentences unless the athlete asked for analysis that needs more.`;

export type CoachMessage = { role: "user" | "assistant"; content: string };

export async function coachReply({
  athleteId,
  history,
  userMessage,
}: {
  athleteId: number;
  history: CoachMessage[];
  userMessage: string;
}): Promise<string> {
  const [athleteContext, knowledgeChunks] = await Promise.all([
    buildAthleteContext(athleteId),
    retrieveKnowledge(userMessage, 5),
  ]);

  const knowledgeBlock = knowledgeChunks.length
    ? knowledgeChunks
        .map(
          (k, i) =>
            `[${i + 1}] ${k.title ?? "(untitled)"} (${k.category}): ${k.content}`,
        )
        .join("\n\n")
    : "(no knowledge retrieved)";

  const system = [
    SYSTEM_PROMPT_PREFIX,
    "",
    "═══ ATHLETE CONTEXT ═══",
    athleteContext,
    "",
    "═══ REFERENCE KNOWLEDGE (retrieved) ═══",
    knowledgeBlock,
  ].join("\n");

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key":
        process.env.CADENCE_ANTHROPIC_KEY ??
        process.env.ANTHROPIC_API_KEY ??
        "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as {
    content: { type: string; text?: string }[];
    usage?: { input_tokens: number; output_tokens: number };
  };
  const text = json.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("");
  return text;
}
