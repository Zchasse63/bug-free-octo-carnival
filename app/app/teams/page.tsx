import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import { TeamCreateForm } from "@/components/team-create-form";

const ATHLETE_ID = 56272355;

export default async function TeamsPage() {
  const sb = createServiceClient();

  const { data: memberships } = await sb
    .from("team_members")
    .select("team_id, role, teams(id, name, description, owner_id)")
    .eq("athlete_id", ATHLETE_ID);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Teams</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Shared training boards with coaches and running partners.
        </p>
      </div>

      <div className="mb-6 space-y-3">
        {(memberships ?? []).map((m) => {
          const t = Array.isArray(m.teams) ? m.teams[0] : m.teams;
          if (!t) return null;
          return (
            <Link
              key={m.team_id}
              href={`/teams/${t.id}`}
              className="block rounded-xl border bg-card p-5 hover:bg-muted/40"
            >
              <div className="flex items-baseline justify-between">
                <div className="font-medium">{t.name}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {m.role}
                </div>
              </div>
              {t.description && (
                <div className="mt-1 text-sm text-muted-foreground">{t.description}</div>
              )}
            </Link>
          );
        })}
        {(memberships ?? []).length === 0 && (
          <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
            You aren&apos;t on any teams yet.
          </div>
        )}
      </div>

      <TeamCreateForm athleteId={ATHLETE_ID} />
    </>
  );
}
