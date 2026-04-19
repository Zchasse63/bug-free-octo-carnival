import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/lib/supabase/types";

type AthleteUpdate = Database["public"]["Tables"]["athletes"]["Update"];

const ATHLETE_ID = 56272355;

type Body = {
  firstname?: string;
  lastname?: string;
  city?: string;
  state?: string;
  weight_kg?: number | null;
};

export async function PATCH(req: Request) {
  const body = (await req.json()) as Body;
  const sb = createServiceClient();
  const update: AthleteUpdate = {
    updated_at: new Date().toISOString(),
  };
  for (const key of ["firstname", "lastname", "city", "state"] as const) {
    if (body[key] !== undefined) update[key] = body[key] ?? null;
  }
  if (body.weight_kg !== undefined) update.weight_kg = body.weight_kg;

  const { error } = await sb.from("athletes").update(update).eq("id", ATHLETE_ID);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
