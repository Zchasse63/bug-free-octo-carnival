import { NextResponse } from "next/server";
import { simulateRace } from "@/lib/analytics/race-sim";
import { createServiceClient } from "@/lib/supabase/service";

const ATHLETE_ID = 56272355;

export async function POST(req: Request) {
  const body = (await req.json()) as {
    race_name?: string;
    race_date?: string;
    distance_m: number;
    temperature_c?: number;
    humidity_pct?: number;
    elevation_gain_m?: number;
  };
  if (!body.distance_m) {
    return NextResponse.json({ error: "distance_m required" }, { status: 400 });
  }

  const sb = createServiceClient();
  const { data: zones } = await sb
    .from("athlete_zones")
    .select("estimated_vdot")
    .eq("athlete_id", ATHLETE_ID)
    .order("effective_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  const vdot = zones?.estimated_vdot ? Number(zones.estimated_vdot) : null;
  if (!vdot) return NextResponse.json({ error: "no VDOT yet" }, { status: 400 });

  // Pull latest TSB via monthly summaries form_score
  const { data: monthly } = await sb
    .from("monthly_summaries")
    .select("form_score")
    .eq("athlete_id", ATHLETE_ID)
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .limit(1)
    .maybeSingle();
  const tsb = monthly?.form_score ? Number(monthly.form_score) : undefined;

  const sim = simulateRace({
    vdot,
    distance_m: body.distance_m,
    temperature_c: body.temperature_c,
    humidity_pct: body.humidity_pct,
    elevation_gain_m: body.elevation_gain_m,
    current_tsb: tsb,
  });

  const { data: prediction } = await sb
    .from("race_predictions")
    .insert({
      athlete_id: ATHLETE_ID,
      race_name: body.race_name ?? null,
      race_date: body.race_date ?? null,
      race_distance_meters: body.distance_m,
      predicted_time_seconds: sim.predicted_time_seconds,
      confidence_range: sim.confidence_range,
      current_vdot: vdot,
      current_tsb: tsb ?? null,
      analysis_text: `Heat +${sim.heat_adjustment_seconds_per_km}s/km, elev +${sim.elevation_adjustment_seconds_per_km}s/km, form ${sim.form_adjustment_seconds_per_km}s/km.`,
      model_used: "daniels-vdot",
    })
    .select("id")
    .single();

  return NextResponse.json({ ...sim, prediction_id: prediction?.id });
}
