import { AppShell } from "@/components/app-shell";
import { SectionTabs } from "@/components/section-tabs";
import { getAthlete } from "@/lib/data/queries";

const ATHLETE_ID = 56272355;

const TABS = [
  { href: "/settings", label: "Overview" },
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/preferences", label: "Preferences" },
  { href: "/settings/data", label: "Data & Sync" },
];

export const dynamic = "force-dynamic";

export default async function SettingsLayout({
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
      <div className="mb-6">
        <h1 className="serif text-4xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Profile, preferences, and the data that powers your coach.
        </p>
      </div>
      <SectionTabs tabs={TABS} />
      {children}
    </AppShell>
  );
}
