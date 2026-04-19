import { createServiceClient } from "@/lib/supabase/service";
import { CoachPortalInvite } from "@/components/coach-portal-invite";
import Link from "next/link";

const ATHLETE_ID = 56272355;

export default async function CoachPortalPage() {
  const sb = createServiceClient();

  const { data: coaching } = await sb
    .from("coach_athletes")
    .select(
      "id, athlete_id, status, permissions, invited_at, accepted_at, athletes:athlete_id(firstname, lastname, city)",
    )
    .eq("coach_id", ATHLETE_ID);

  const { data: myCoaches } = await sb
    .from("coach_athletes")
    .select(
      "id, coach_id, status, invited_at, accepted_at, athletes:coach_id(firstname, lastname)",
    )
    .eq("athlete_id", ATHLETE_ID);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Coach portal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage coach-athlete relationships.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">My athletes</h2>
          {(coaching ?? []).length === 0 ? (
            <div className="text-sm text-muted-foreground">
              You don&apos;t coach anyone yet.
            </div>
          ) : (
            <div className="space-y-2">
              {coaching?.map((c) => {
                const a = Array.isArray(c.athletes) ? c.athletes[0] : c.athletes;
                const name = a
                  ? `${a.firstname ?? ""} ${a.lastname ?? ""}`.trim()
                  : "Athlete";
                return (
                  <div key={c.id} className="rounded-md border p-3">
                    <div className="flex items-baseline justify-between">
                      <Link
                        href={`/teams/coach-portal/${c.athlete_id}`}
                        className="font-medium hover:underline"
                      >
                        {name}
                      </Link>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        {c.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold">My coaches</h2>
          {(myCoaches ?? []).length === 0 ? (
            <div className="text-sm text-muted-foreground">No coach yet.</div>
          ) : (
            <div className="space-y-2">
              {myCoaches?.map((c) => {
                const a = Array.isArray(c.athletes) ? c.athletes[0] : c.athletes;
                const name = a
                  ? `${a.firstname ?? ""} ${a.lastname ?? ""}`.trim()
                  : "Coach";
                return (
                  <div key={c.id} className="rounded-md border p-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium">{name}</span>
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        {c.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CoachPortalInvite coachId={ATHLETE_ID} />
    </>
  );
}
