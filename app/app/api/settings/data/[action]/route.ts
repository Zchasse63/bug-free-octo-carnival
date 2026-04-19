import { NextResponse } from "next/server";
import {
  recomputeTrainingLoad,
  rollupWeeklySummaries,
} from "@/lib/analytics/training-load";
import { recomputeVdot } from "@/lib/analytics/vdot";
import { computeResponseProfile } from "@/lib/analytics/fatigue-fingerprint";

const ATHLETE_ID = 56272355;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  try {
    if (action === "recompute-analytics") {
      const load = await recomputeTrainingLoad(ATHLETE_ID);
      const weeks = await rollupWeeklySummaries(ATHLETE_ID);
      return NextResponse.json({ load, weeks });
    }
    if (action === "recompute-vdot") {
      const out = await recomputeVdot(ATHLETE_ID);
      return NextResponse.json(out);
    }
    if (action === "recompute-profile") {
      const out = await computeResponseProfile(ATHLETE_ID);
      return NextResponse.json(out ?? { note: "insufficient data" });
    }
    return NextResponse.json({ error: "unknown action" }, { status: 404 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
