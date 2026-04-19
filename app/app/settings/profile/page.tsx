import { getAthlete } from "@/lib/data/queries";
import { ProfileForm } from "@/components/settings/profile-form";

const ATHLETE_ID = 56272355;

export default async function ProfileSettingsPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  return (
    <ProfileForm
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
