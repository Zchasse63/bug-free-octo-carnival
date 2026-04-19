import { getAthlete } from "@/lib/data/queries";
import { PreferencesForm } from "@/components/settings/preferences-form";

const ATHLETE_ID = 56272355;

export default async function PreferencesSettingsPage() {
  const athlete = await getAthlete(ATHLETE_ID);
  return (
    <PreferencesForm
      initial={{
        measurement_preference: athlete.measurement_preference ?? "feet",
      }}
    />
  );
}
