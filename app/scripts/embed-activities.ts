import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { embedActivitiesBatch } from "@/lib/ai/activity-embeddings";

async function main() {
  const id = Number(process.argv[2] ?? process.env.STRAVA_ATHLETE_ID);
  const max = Number(process.argv[3] ?? 500);
  const res = await embedActivitiesBatch(id, max);
  console.log(res);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
