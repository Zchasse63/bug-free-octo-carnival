import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { randomBytes } from "node:crypto";

type CreateBody = {
  action: "create";
  name: string;
  description?: string;
  athleteId: number;
};
type JoinBody = {
  action: "join";
  invite_code: string;
  athleteId: number;
};

function inviteCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateBody | JoinBody;
  const sb = createServiceClient();

  if (body.action === "create") {
    const code = inviteCode();
    const { data: team, error } = await sb
      .from("teams")
      .insert({
        name: body.name,
        description: body.description ?? null,
        owner_id: body.athleteId,
        invite_code: code,
        invite_code_expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      })
      .select("id")
      .single();
    if (error || !team) return NextResponse.json({ error: error?.message }, { status: 500 });
    const { error: memErr } = await sb.from("team_members").insert({
      team_id: team.id,
      athlete_id: body.athleteId,
      role: "owner",
    });
    if (memErr) return NextResponse.json({ error: memErr.message }, { status: 500 });
    return NextResponse.json({ team_id: team.id, invite_code: code });
  }

  if (body.action === "join") {
    const { data: team, error } = await sb
      .from("teams")
      .select("id, invite_code_expires_at, invite_code_use_count, invite_code_max_uses")
      .eq("invite_code", body.invite_code)
      .maybeSingle();
    if (error || !team)
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    if (
      team.invite_code_expires_at &&
      new Date(team.invite_code_expires_at) < new Date()
    ) {
      return NextResponse.json({ error: "Invite code expired" }, { status: 400 });
    }
    if (
      team.invite_code_max_uses &&
      team.invite_code_use_count != null &&
      team.invite_code_use_count >= team.invite_code_max_uses
    ) {
      return NextResponse.json({ error: "Invite code fully used" }, { status: 400 });
    }
    await sb
      .from("team_members")
      .upsert({ team_id: team.id, athlete_id: body.athleteId, role: "member" }, {
        onConflict: "team_id,athlete_id",
      });
    await sb
      .from("teams")
      .update({ invite_code_use_count: (team.invite_code_use_count ?? 0) + 1 })
      .eq("id", team.id);
    return NextResponse.json({ team_id: team.id });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
