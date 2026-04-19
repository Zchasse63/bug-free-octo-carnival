import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { WorkoutBuilderForm } from "@/components/workout-builder-form";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function WorkoutBuilderPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Workout builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe a session in plain English. I&apos;ll structure it.
        </p>
      </div>
      <WorkoutBuilderForm />
    </AppShell>
  );
}
