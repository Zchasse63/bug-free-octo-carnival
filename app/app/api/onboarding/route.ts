import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { ONBOARDING } from "@/lib/onboarding/questions";

const ATHLETE_ID = 56272355;

export async function GET() {
  const sb = createServiceClient();
  const { data } = await sb
    .from("onboarding_responses")
    .select("question_key, response_value")
    .eq("athlete_id", ATHLETE_ID);
  const responses: Record<string, string> = {};
  for (const r of data ?? []) responses[r.question_key] = r.response_value;
  return NextResponse.json({ responses, questions: ONBOARDING });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { responses: Record<string, string> };
  if (!body.responses) {
    return NextResponse.json({ error: "responses required" }, { status: 400 });
  }
  const sb = createServiceClient();
  const byKey = new Map(ONBOARDING.map((q) => [q.key, q]));
  const rows = Object.entries(body.responses)
    .filter(([k, v]) => byKey.has(k) && v.trim().length > 0)
    .map(([k, v]) => ({
      athlete_id: ATHLETE_ID,
      question_key: k,
      question_text: byKey.get(k)!.prompt,
      response_value: v,
      response_type: byKey.get(k)!.response_type,
    }));
  if (rows.length) {
    const { error } = await sb
      .from("onboarding_responses")
      .upsert(rows, { onConflict: "athlete_id,question_key" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  await sb
    .from("athletes")
    .update({ onboarding_complete: true })
    .eq("id", ATHLETE_ID);
  return NextResponse.json({ saved: rows.length });
}
