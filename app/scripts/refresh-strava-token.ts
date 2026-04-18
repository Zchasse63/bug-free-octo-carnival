import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { refreshTokens } from "@/lib/strava/token";

async function main() {
  const id = Number(process.argv[2] ?? process.env.STRAVA_ATHLETE_ID);
  const out = await refreshTokens(id);
  console.log(`Refreshed. Expires at ${out.expiresAt.toISOString()}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
