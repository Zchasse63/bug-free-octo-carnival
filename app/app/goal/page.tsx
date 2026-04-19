import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { GoalAnalyzer } from "@/components/goal-analyzer";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function GoalPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Goal analyzer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reverse-engineer a race goal into required VDOT, weekly gains, and
          honest assessment of feasibility.
        </p>
      </div>
      <GoalAnalyzer />
    </AppShell>
  );
}
