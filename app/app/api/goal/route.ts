import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { analyzeGoal } from "@/lib/analytics/goal-planner";

const ATHLETE_ID = 56272355;

export async function POST(req: Request) {
  const body = (await req.json()) as {
    target_distance_m: number;
    target_time_s: number;
    race_date?: string;
  };
  if (!body.target_distance_m || !body.target_time_s) {
    return NextResponse.json(
      { error: "target_distance_m and target_time_s required" },
      { status: 400 },
    );
  }
  const sb = createServiceClient();
  const { data: zones } = await sb
    .from("athlete_zones")
    .select("estimated_vdot")
    .eq("athlete_id", ATHLETE_ID)
    .order("effective_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  const currentVdot = zones?.estimated_vdot ? Number(zones.estimated_vdot) : null;

  const analysis = analyzeGoal({
    current_vdot: currentVdot,
    target_distance_m: body.target_distance_m,
    target_time_s: body.target_time_s,
    race_date: body.race_date,
  });
  return NextResponse.json(analysis);
}
