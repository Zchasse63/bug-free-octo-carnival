import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import {
  recomputeTrainingLoad,
  rollupWeeklySummaries,
} from "@/lib/analytics/training-load";

async function main() {
  const id = Number(process.argv[2] ?? process.env.STRAVA_ATHLETE_ID);
  console.log("Recomputing training load...");
  console.log(await recomputeTrainingLoad(id));
  console.log("Rolling up weekly summaries...");
  console.log(await rollupWeeklySummaries(id));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
