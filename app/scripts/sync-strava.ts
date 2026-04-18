/**
 * Run the three-pass Strava backfill for a given athlete.
 * Usage: npx tsx scripts/sync-strava.ts [athleteId] [pass]
 *   pass: full (default), summaries, details, streams
 */
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

import {
  runFullBackfill,
  syncDetails,
  syncStreams,
  syncSummaries,
} from "@/lib/strava/sync";

async function main() {
  const athleteId = Number(process.argv[2] ?? process.env.STRAVA_ATHLETE_ID);
  if (!athleteId || Number.isNaN(athleteId)) {
    throw new Error("Pass athlete ID as arg or set STRAVA_ATHLETE_ID");
  }
  const pass = process.argv[3] ?? "full";
  switch (pass) {
    case "summaries":
      console.log(await syncSummaries(athleteId));
      break;
    case "details":
      console.log(await syncDetails(athleteId));
      break;
    case "streams":
      console.log(await syncStreams(athleteId));
      break;
    case "full":
    default:
      console.log(await runFullBackfill(athleteId));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
