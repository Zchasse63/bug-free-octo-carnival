import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import { User, Cog, Database } from "lucide-react";
import { getAthlete, getSyncStatus } from "@/lib/data/queries";

const ATHLETE_ID = 56272355;

export default async function SettingsOverviewPage() {
  const [athlete, sync] = await Promise.all([
    getAthlete(ATHLETE_ID),
    getSyncStatus(ATHLETE_ID),
  ]);
  const sb = createServiceClient();
  const { count: onboardingCount } = await sb
    .from("onboarding_responses")
    .select("id", { count: "exact", head: true })
    .eq("athlete_id", ATHLETE_ID);

  const name =
    `${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "—";
  const location =
    [athlete.city, athlete.state].filter(Boolean).join(", ") || "—";
  const units =
    athlete.measurement_preference === "meters" ? "Metric (km, °C)" : "Imperial (mi, °F)";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card
        href="/settings/profile"
        icon={User}
        title="Profile"
        rows={[
          ["Name", name],
          ["Location", location],
          ["Weight", athlete.weight_kg ? `${athlete.weight_kg} kg` : "—"],
        ]}
      />
      <Card
        href="/settings/preferences"
        icon={Cog}
        title="Preferences"
        rows={[
          ["Units", units],
          [
            "Onboarding",
            (onboardingCount ?? 0) >= 8 ? "Complete" : `${onboardingCount ?? 0}/10 answered`,
          ],
        ]}
      />
      <Card
        href="/settings/data"
        icon={Database}
        title="Data & Sync"
        rows={[
          ["Total activities", sync.total.toLocaleString()],
          ["Detail synced", `${sync.detailed.toLocaleString()} (${sync.total ? Math.round((sync.detailed / sync.total) * 100) : 0}%)`],
          ["Weather", sync.weathered.toLocaleString()],
          ["Embedded", sync.embedded.toLocaleString()],
        ]}
      />
    </div>
  );
}

function Card({
  href,
  icon: Icon,
  title,
  rows,
}: {
  href: string;
  icon: typeof User;
  title: string;
  rows: [string, string][];
}) {
  return (
    <Link
      href={href}
      className="card-hover block rounded-xl border bg-card p-5 transition-colors"
    >
      <div className="mb-3 flex items-center gap-3">
        <Icon className="h-4 w-4 text-saffron-500 dark:text-saffron-400" />
        <h2 className="serif text-xl">{title}</h2>
      </div>
      <dl className="space-y-1.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4">
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">
              {k}
            </dt>
            <dd className="truncate font-mono tabular-nums text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </Link>
  );
}
