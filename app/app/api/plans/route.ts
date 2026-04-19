import { NextResponse } from "next/server";
import { generateTrainingPlan, type PlanRequest } from "@/lib/ai/plan-generator";

const ATHLETE_ID = 56272355;

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<PlanRequest>;
  if (!body.goal || !body.weeks || !body.planType) {
    return NextResponse.json({ error: "goal, weeks, planType required" }, { status: 400 });
  }
  try {
    const result = await generateTrainingPlan({
      athleteId: ATHLETE_ID,
      goal: body.goal,
      weeks: body.weeks,
      planType: body.planType,
      goalRaceDate: body.goalRaceDate,
      goalDistance: body.goalDistance,
      goalTimeSeconds: body.goalTimeSeconds,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
