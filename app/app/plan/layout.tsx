import { AppShell } from "@/components/app-shell";
import { SectionTabs } from "@/components/section-tabs";
import { getAthlete } from "@/lib/data/queries";

const ATHLETE_ID = 56272355;

const PLAN_TABS = [
  { href: "/plan", label: "Calendar" },
  { href: "/plan/build", label: "Build workout" },
  { href: "/plan/goal", label: "Analyze goal" },
  { href: "/plan/race-sim", label: "Simulate race" },
];

export const dynamic = "force-dynamic";

export default async function PlanLayout({
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
      <SectionTabs tabs={PLAN_TABS} />
      {children}
    </AppShell>
  );
}
