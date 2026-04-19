import { redirect } from "next/navigation";

export default async function CoachAthleteRedirect({
  params,
}: {
  params: Promise<{ athleteId: string }>;
}) {
  const { athleteId } = await params;
  redirect(`/teams/coach-portal/${athleteId}`);
}
