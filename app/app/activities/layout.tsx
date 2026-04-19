import { AppShell } from "@/components/app-shell";
import { ActivitiesTabsGate } from "@/components/activities-tabs-gate";
import { getAthlete } from "@/lib/data/queries";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const athlete = await getAthlete(ATHLETE_ID);
  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <ActivitiesTabsGate />
      {children}
    </AppShell>
  );
}
