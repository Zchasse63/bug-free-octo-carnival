import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { CoachChat } from "@/components/coach-chat";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function CoachPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <CoachChat firstname={athlete.firstname ?? "there"} />
    </AppShell>
  );
}
