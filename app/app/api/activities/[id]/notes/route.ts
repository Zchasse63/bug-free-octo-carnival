import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { parseAndPersistNote } from "@/lib/ai/context-parser";

const ATHLETE_ID = 56272355;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const activityId = Number(id);
  const body = (await req.json()) as { raw_text: string; input_method?: "text" | "voice" };
  if (!body.raw_text?.trim()) {
    return NextResponse.json({ error: "raw_text required" }, { status: 400 });
  }
  const sb = createServiceClient();
  const { data: note, error } = await sb
    .from("activity_notes")
    .insert({
      activity_id: activityId,
      athlete_id: ATHLETE_ID,
      raw_text: body.raw_text,
      input_method: body.input_method ?? "text",
    })
    .select("id")
    .single();
  if (error || !note) return NextResponse.json({ error: error?.message }, { status: 500 });

  // Parse note asynchronously — we don't want to block user
  parseAndPersistNote(note.id).catch((e) => console.error("parse note failed", e));

  // Mark activity embedding needs update
  await sb
    .from("activities")
    .update({ embedding_needs_update: true })
    .eq("id", activityId);

  return NextResponse.json({ note_id: note.id });
}
