import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { createServiceClient } from "@/lib/supabase/service";
import { getValidAccessToken } from "@/lib/strava/token";

type StravaGearSummary = {
  id: string;
  name: string;
  primary: boolean;
  resource_state: number;
  distance: number;
};

async function main() {
  const athleteId = Number(process.argv[2] ?? process.env.STRAVA_ATHLETE_ID);
  if (!athleteId) throw new Error("athlete id required");

  const token = await getValidAccessToken(athleteId);
  const res = await fetch("https://www.strava.com/api/v3/athlete", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Strava /athlete ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    shoes?: StravaGearSummary[];
    bikes?: StravaGearSummary[];
  };

  const sb = createServiceClient();
  const rows = [
    ...(json.shoes ?? []).map((g) => ({
      id: g.id,
      athlete_id: athleteId,
      name: g.name,
      gear_type: "shoe" as const,
      is_primary: g.primary,
      distance_meters: g.distance,
      retired: false,
    })),
    ...(json.bikes ?? []).map((g) => ({
      id: g.id,
      athlete_id: athleteId,
      name: g.name,
      gear_type: "bike" as const,
      is_primary: g.primary,
      distance_meters: g.distance,
      retired: false,
    })),
  ];

  if (rows.length === 0) {
    console.log("No gear returned by Strava.");
    return;
  }

  const { error } = await sb.from("gear").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  console.log(`Upserted ${rows.length} gear rows (${(json.shoes ?? []).length} shoes, ${(json.bikes ?? []).length} bikes)`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
