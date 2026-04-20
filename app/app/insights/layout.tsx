import { AppShell } from "@/components/app-shell";
import { SectionTabs } from "@/components/section-tabs";
import { getAthlete } from "@/lib/data/queries";

const ATHLETE_ID = 56272355;

const TABS = [
  { href: "/insights", label: "Analysis" },
  { href: "/insights/history", label: "History" },
  { href: "/insights/community", label: "Community" },
];

export const dynamic = "force-dynamic";

export default async function InsightsLayout({
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
      <SectionTabs tabs={TABS} />
      {children}
    </AppShell>
  );
}
