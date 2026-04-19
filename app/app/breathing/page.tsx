import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { BreathingCoach } from "@/components/breathing-coach";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function BreathingPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Breathing coach</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Box breathing, 4-7-8, and a pre-race calm-down protocol.
        </p>
      </div>
      <BreathingCoach />
    </AppShell>
  );
}
