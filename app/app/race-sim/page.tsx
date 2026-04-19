import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { RaceSimForm } from "@/components/race-sim-form";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function RaceSimPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Race day simulator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          VDOT-based prediction with heat, elevation, and form adjustments.
        </p>
      </div>
      <RaceSimForm />
    </AppShell>
  );
}
