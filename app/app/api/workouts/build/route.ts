import { NextResponse } from "next/server";
import { buildWorkout } from "@/lib/ai/workout-builder";

const ATHLETE_ID = 56272355;

export async function POST(req: Request) {
  const body = (await req.json()) as { description: string };
  if (!body.description) {
    return NextResponse.json({ error: "description required" }, { status: 400 });
  }
  try {
    const workout = await buildWorkout(ATHLETE_ID, body.description);
    return NextResponse.json(workout);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
