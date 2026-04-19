import { AppShell } from "@/components/app-shell";
import { getAthlete } from "@/lib/data/queries";
import { ONBOARDING } from "@/lib/onboarding/questions";
import { OnboardingForm } from "@/components/onboarding-form";
import { createServiceClient } from "@/lib/supabase/service";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  const sb = createServiceClient();
  const { data } = await sb
    .from("onboarding_responses")
    .select("question_key, response_value")
    .eq("athlete_id", ATHLETE_ID);
  const existing: Record<string, string> = {};
  for (const r of data ?? []) existing[r.question_key] = r.response_value;

  return (
    <AppShell
      athleteName={`${athlete.firstname ?? ""} ${athlete.lastname ?? ""}`.trim() || "Athlete"}
      athleteLocation={[athlete.city, athlete.state].filter(Boolean).join(", ") || undefined}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Onboarding</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A few quick questions so your coach can tailor advice.
        </p>
      </div>
      <OnboardingForm questions={ONBOARDING} initial={existing} />
    </AppShell>
  );
}
