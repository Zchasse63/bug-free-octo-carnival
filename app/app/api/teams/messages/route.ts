import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

type Body = { team_id: string; author_id: number; content: string };

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  if (!body.team_id || !body.content) {
    return NextResponse.json({ error: "team_id and content required" }, { status: 400 });
  }
  const sb = createServiceClient();
  const { data: msg, error } = await sb
    .from("team_messages")
    .insert({
      team_id: body.team_id,
      author_id: body.author_id,
      content: body.content,
    })
    .select("id, content, author_id, created_at")
    .single();
  if (error || !msg) return NextResponse.json({ error: error?.message }, { status: 500 });

  const { data: author } = await sb
    .from("athletes")
    .select("firstname, lastname")
    .eq("id", body.author_id)
    .maybeSingle();

  return NextResponse.json({
    message: {
      ...msg,
      author_name: `${author?.firstname ?? ""} ${author?.lastname ?? ""}`.trim() || "Unknown",
    },
  });
}
