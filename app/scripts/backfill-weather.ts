import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { backfillWeather } from "@/lib/weather/open-meteo";

async function main() {
  const id = Number(process.argv[2] ?? process.env.STRAVA_ATHLETE_ID);
  const max = Number(process.argv[3] ?? 3000);
  const out = await backfillWeather(id, max);
  console.log(out);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
