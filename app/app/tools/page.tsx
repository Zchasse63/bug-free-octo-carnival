import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import Link from "next/link";
import { Hammer, Wind, Compass, Gauge, LineChart, Users, Sparkles, Rocket, Target } from "lucide-react";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

const TOOLS = [
  {
    href: "/workout-builder",
    label: "Workout builder",
    icon: Hammer,
    desc: "Plain-English → structured workout",
  },
  {
    href: "/goal",
    label: "Goal analyzer",
    icon: Target,
    desc: "Reverse-engineer a race goal into required VDOT",
  },
  {
    href: "/race-sim",
    label: "Race day simulator",
    icon: Rocket,
    desc: "VDOT + heat + elevation + form",
  },
  {
    href: "/insights",
    label: "Insights",
    icon: Sparkles,
    desc: "Time machine + fatigue fingerprint",
  },
  {
    href: "/community",
    label: "Community",
    icon: Users,
    desc: "Anonymized peer comparison",
  },
  {
    href: "/coach-portal",
    label: "Coach portal",
    icon: Gauge,
    desc: "Manage athletes you coach",
  },
  {
    href: "/onboarding",
    label: "Onboarding",
    icon: LineChart,
    desc: "Answer questions to tune your coach",
  },
  {
    href: "/breathing",
    label: "Breathing coach",
    icon: Wind,
    desc: "Box-breathing + race-day protocols",
  },
  {
    href: "/routes",
    label: "Routes",
    icon: Compass,
    desc: "Route insights (coming soon)",
  },
];

export default async function ToolsPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Tools</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything Cadence offers beyond the core training loop.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border bg-card p-5 hover:bg-muted/40"
          >
            <Icon className="h-5 w-5 text-saffron-500 dark:text-saffron-400" />
            <div className="mt-3 font-medium">{label}</div>
            <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
