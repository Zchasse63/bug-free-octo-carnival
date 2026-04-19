import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/lib/supabase/types";

type PlannedUpdate = Database["public"]["Tables"]["planned_workouts"]["Update"];

type Body = {
  status?: "planned" | "completed" | "skipped" | "modified";
  deviation_notes?: string;
  actual_activity_id?: number | null;
};

const ATHLETE_ID = 56272355;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await req.json()) as Body;
  const sb = createServiceClient();

  const update: PlannedUpdate = {
    updated_at: new Date().toISOString(),
  };
  if (body.status) update.status = body.status;
  if (body.deviation_notes !== undefined) update.deviation_notes = body.deviation_notes;
  if (body.actual_activity_id !== undefined)
    update.actual_activity_id = body.actual_activity_id;

  const { error } = await sb
    .from("planned_workouts")
    .update(update)
    .eq("id", id)
    .eq("athlete_id", ATHLETE_ID);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
