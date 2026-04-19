import { createServiceClient } from "@/lib/supabase/service";
import type { Json } from "@/lib/supabase/types";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-opus-4-7";

function anthropicKey(): string {
  return process.env.CADENCE_ANTHROPIC_KEY ?? process.env.ANTHROPIC_API_KEY ?? "";
}

type ParsedFactor = {
  factor_key: string;
  category: string;
  factor_value?: string;
  confidence: number;
  raw_text_excerpt?: string;
};

type ParseResponse = {
  perceived_effort?: number;
  sentiment?: "positive" | "neutral" | "negative" | "mixed";
  ai_parsed_tags?: string[];
  key_factors: ParsedFactor[];
};

/**
 * Ask Claude to parse a free-text note into structured context factors,
 * normalized against the canonical factor_key dictionary.
 */
export async function parseNote(
  rawText: string,
  existingFactorKeys: string[],
): Promise<ParseResponse> {
  const system = `You parse running-athlete post-run notes into structured data.

Return STRICT JSON only — no prose, no markdown fences.
Schema:
{
  "perceived_effort": number | null,  // 1-10 scale if inferrable
  "sentiment": "positive" | "neutral" | "negative" | "mixed",
  "ai_parsed_tags": string[],  // short free tags like "heavy legs", "hot weather"
  "key_factors": Array<{
    "factor_key": string,     // snake_case, matching existing dictionary when possible
    "category": "gear"|"clothing"|"pre_run"|"during_run"|"post_run"|"nutrition"|"recovery"|"weather"|"surface"|"custom",
    "factor_value"?: string,  // numeric value (hours, mi) or descriptor ("poor","heavy")
    "confidence": number,     // 0.0-1.0
    "raw_text_excerpt"?: string  // the substring of the note this came from
  }>
}

Normalization rules:
- Prefer existing factor_keys when semantically equivalent (e.g., "ice bath" -> "ice_bath_before" or "ice_bath_after" depending on context).
- If no existing key fits, invent a new snake_case key.
- Skip weather information (we fetch that from an API separately) unless the user's note reveals something the API can't capture.
- Skip pace / HR / distance — those are already in structured data.

Existing factor dictionary (use these when possible):
${existingFactorKeys.join(", ")}`;

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
      messages: [{ role: "user", content: `Note:\n"""\n${rawText}\n"""\n\nParse now.` }],
    }),
  });
  if (!res.ok) throw new Error(`parseNote failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { content: { type: string; text?: string }[] };
  const raw = json.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("");
  const cleaned = raw.trim().replace(/^```json\s*/, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned) as ParseResponse;
}

/**
 * Parse a single activity_note and persist parsed factors + note metadata.
 */
export async function parseAndPersistNote(noteId: string) {
  const sb = createServiceClient();
  const { data: note, error } = await sb
    .from("activity_notes")
    .select("id, activity_id, athlete_id, raw_text")
    .eq("id", noteId)
    .single();
  if (error || !note) throw error ?? new Error("Note not found");

  const { data: factorDefs } = await sb
    .from("context_factor_definitions")
    .select("factor_key");
  const existingKeys = (factorDefs ?? []).map((f) => f.factor_key);

  const parsed = await parseNote(note.raw_text, existingKeys);

  // Update note metadata
  await sb
    .from("activity_notes")
    .update({
      perceived_effort: parsed.perceived_effort ?? null,
      sentiment: parsed.sentiment ?? null,
      ai_parsed_tags: parsed.ai_parsed_tags ?? null,
      key_factors: parsed.key_factors as unknown as Json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId);

  // Ensure every factor_key exists in definitions
  const newKeys = parsed.key_factors
    .map((f) => f.factor_key)
    .filter((k) => !existingKeys.includes(k));
  for (const key of newKeys) {
    const factor = parsed.key_factors.find((f) => f.factor_key === key)!;
    await sb.from("context_factor_definitions").upsert(
      {
        factor_key: factor.factor_key,
        category: factor.category,
        display_name: factor.factor_key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        is_builtin: false,
        usage_count: 1,
      },
      { onConflict: "factor_key" },
    );
  }

  // Bump usage_count for all referenced factor_keys
  for (const f of parsed.key_factors) {
    try {
      await sb.rpc("increment_factor_usage", { key: f.factor_key });
    } catch {
      // non-fatal — factor-counter is best-effort
    }
  }

  // Persist context factor rows
  if (parsed.key_factors.length) {
    const rows = parsed.key_factors.map((f) => ({
      activity_id: note.activity_id,
      athlete_id: note.athlete_id,
      category: f.category,
      factor_key: f.factor_key,
      factor_value: f.factor_value ?? null,
      source: "user_note" as const,
      confidence: f.confidence,
      raw_text_excerpt: f.raw_text_excerpt ?? null,
    }));
    await sb.from("activity_context_factors").insert(rows);
  }

  return {
    perceived_effort: parsed.perceived_effort ?? null,
    sentiment: parsed.sentiment ?? null,
    factor_count: parsed.key_factors.length,
    new_factor_keys: newKeys,
  };
}
