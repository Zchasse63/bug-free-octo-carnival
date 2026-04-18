import { NextResponse } from "next/server";
import { coachReply, type CoachMessage } from "@/lib/ai/coach";
import { createServiceClient } from "@/lib/supabase/service";

const ATHLETE_ID = 56272355;

type Body = {
  conversation_id?: string;
  message: string;
  history?: CoachMessage[];
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  if (!body.message || typeof body.message !== "string") {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const sb = createServiceClient();
  let conversationId = body.conversation_id;
  if (!conversationId) {
    const { data, error } = await sb
      .from("conversations")
      .insert({ athlete_id: ATHLETE_ID, title: null })
      .select("id")
      .single();
    if (error || !data) return NextResponse.json({ error: error?.message }, { status: 500 });
    conversationId = data.id;
  }

  // Load last 20 messages of conversation history if not provided
  let history: CoachMessage[] = body.history ?? [];
  if (body.conversation_id && !body.history) {
    const { data } = await sb
      .from("messages")
      .select("role, content")
      .eq("conversation_id", body.conversation_id)
      .order("created_at", { ascending: true })
      .limit(20);
    history = (data ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
  }

  // Persist user message
  await sb.from("messages").insert({
    conversation_id: conversationId,
    athlete_id: ATHLETE_ID,
    role: "user",
    content: body.message,
  });

  const reply = await coachReply({
    athleteId: ATHLETE_ID,
    history,
    userMessage: body.message,
  });

  // Persist assistant reply
  await sb.from("messages").insert({
    conversation_id: conversationId,
    athlete_id: ATHLETE_ID,
    role: "assistant",
    content: reply,
    model_used: "claude-opus-4-7",
  });

  await sb
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return NextResponse.json({ conversation_id: conversationId, reply });
}
