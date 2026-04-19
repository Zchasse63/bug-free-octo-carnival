import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/lib/supabase/types";

type AthleteUpdate = Database["public"]["Tables"]["athletes"]["Update"];

const ATHLETE_ID = 56272355;

type Body = {
  measurement_preference?: "feet" | "meters";
};

export async function PATCH(req: Request) {
  const body = (await req.json()) as Body;
  const sb = createServiceClient();
  const update: AthleteUpdate = {
    updated_at: new Date().toISOString(),
  };
  if (body.measurement_preference)
    update.measurement_preference = body.measurement_preference;

  const { error } = await sb.from("athletes").update(update).eq("id", ATHLETE_ID);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
