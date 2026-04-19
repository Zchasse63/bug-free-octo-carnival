import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

type Body = {
  coach_id: number;
  athlete_email: string;
  permissions: {
    view_activities: boolean;
    view_notes: boolean;
    view_streams: boolean;
    modify_plan: boolean;
  };
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const sb = createServiceClient();

  // Resolve athlete by auth user email (athletes.auth_user_id → auth.users.email)
  const { data: user } = await sb.auth.admin.listUsers();
  const target = user.users.find((u) => u.email === body.athlete_email);
  if (!target) {
    return NextResponse.json(
      { error: "No athlete registered with that email" },
      { status: 404 },
    );
  }
  const { data: targetAthlete } = await sb
    .from("athletes")
    .select("id")
    .eq("auth_user_id", target.id)
    .maybeSingle();
  if (!targetAthlete) {
    return NextResponse.json(
      { error: "Auth user exists but isn't linked to an athlete row" },
      { status: 404 },
    );
  }
  if (targetAthlete.id === body.coach_id) {
    return NextResponse.json(
      { error: "You can't coach yourself" },
      { status: 400 },
    );
  }

  const { error } = await sb.from("coach_athletes").upsert(
    {
      coach_id: body.coach_id,
      athlete_id: targetAthlete.id,
      status: "pending",
      permissions: body.permissions,
      invited_at: new Date().toISOString(),
    },
    { onConflict: "coach_id,athlete_id" },
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ status: "pending", athlete_id: targetAthlete.id });
}
