import { getAthlete } from "@/lib/data/queries";
import { ProfileForm } from "@/components/settings/profile-form";
import { isImperial } from "@/lib/units";

const ATHLETE_ID = 56272355;

export const dynamic = "force-dynamic";

export default async function ProfileSettingsPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  const useMetric = !isImperial(athlete.measurement_preference);
  return (
    <ProfileForm
      useMetric={useMetric}
      initial={{
        firstname: athlete.firstname ?? "",
        lastname: athlete.lastname ?? "",
        city: athlete.city ?? "",
        state: athlete.state ?? "",
        weight_kg: athlete.weight_kg ? Number(athlete.weight_kg) : null,
      }}
    />
  );
}
