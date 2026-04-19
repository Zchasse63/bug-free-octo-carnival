import { RaceSimForm } from "@/components/race-sim-form";
import { getAthlete } from "@/lib/data/queries";
import { isImperial } from "@/lib/units";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function PlanRaceSimPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  const useMetric = !isImperial(athlete.measurement_preference);
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Race day simulator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          VDOT-based prediction with heat, elevation, and form adjustments.
        </p>
      </div>
      <RaceSimForm useMetric={useMetric} />
    </>
  );
}
