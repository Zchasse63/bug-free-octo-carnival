import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { recomputeVdot } from "@/lib/analytics/vdot";

async function main() {
  const id = Number(process.argv[2] ?? process.env.STRAVA_ATHLETE_ID);
  console.log(await recomputeVdot(id));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
