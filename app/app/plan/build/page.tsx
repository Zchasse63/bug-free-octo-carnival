import { WorkoutBuilderForm } from "@/components/workout-builder-form";
import { getAthlete } from "@/lib/data/queries";
import { isImperial } from "@/lib/units";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function PlanBuildPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  const useMetric = !isImperial(athlete.measurement_preference);
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Build workout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe a session in plain English. Claude will structure it.
        </p>
      </div>
      <WorkoutBuilderForm useMetric={useMetric} />
    </>
  );
}
