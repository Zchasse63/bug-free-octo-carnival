import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { createServiceClient } from "@/lib/supabase/service";
import { TeamChat } from "@/components/team-chat";
import { notFound } from "next/navigation";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const athlete = await getAthlete(ATHLETE_ID);
  const sb = createServiceClient();
  const { data: team } = await sb
    .from("teams")
    .select("id, name, description, owner_id, invite_code")
    .eq("id", id)
    .maybeSingle();
  if (!team) notFound();

  const { data: members } = await sb
    .from("team_members")
    .select("athlete_id, role, athletes(firstname, lastname)")
    .eq("team_id", id);

  const { data: initialMessages } = await sb
    .from("team_messages")
    .select("id, content, author_id, created_at, athletes:author_id(firstname, lastname)")
    .eq("team_id", id)
    .order("created_at", { ascending: true })
    .limit(100);

  const initial = (initialMessages ?? []).map((m) => {
    const a = Array.isArray(m.athletes) ? m.athletes[0] : m.athletes;
    return {
      id: m.id,
      content: m.content,
      author_id: m.author_id,
      created_at: m.created_at,
      author_name: a ? `${a.firstname ?? ""} ${a.lastname ?? ""}`.trim() : "Unknown",
    };
  });

  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{team.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {members?.length ?? 0} members
            {team.invite_code && ` · invite code: ${team.invite_code}`}
          </p>
        </div>
      </div>
      <TeamChat teamId={team.id} athleteId={ATHLETE_ID} initialMessages={initial} />
    </AppShell>
  );
}
