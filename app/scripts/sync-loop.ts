/**
 * Rate-limit-aware sync loop.
 * Runs pass 2 (details) + pass 3 (streams) repeatedly, sleeping through
 * Strava's 15-minute rolling window when hit. Also nudges weather and
 * embeddings between passes so nothing stalls.
 *
 * Usage: npx tsx scripts/sync-loop.ts 56272355 [details|streams|all]
 */
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { syncDetails, syncStreams } from "@/lib/strava/sync";
import { backfillWeather } from "@/lib/weather/open-meteo";
import { embedActivitiesBatch } from "@/lib/ai/activity-embeddings";
import { recomputeTrainingLoad, rollupWeeklySummaries } from "@/lib/analytics/training-load";

const SHORT_SLEEP_MS = 15 * 60 * 1000 + 30 * 1000; // 15m30s — one 15-min window plus buffer
function msUntilNextUtcMidnight(): number {
  const now = new Date();
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 1, 0),
  );
  return next.getTime() - now.getTime();
}

function ts(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const id = Number(process.argv[2] ?? process.env.STRAVA_ATHLETE_ID);
  const mode = (process.argv[3] ?? "all") as "details" | "streams" | "all";
  if (!id) throw new Error("Pass athlete ID");

  let detailsDone = mode === "streams";
  let streamsDone = mode === "details";
  let iterations = 0;

  console.log(`[${ts()}] sync-loop start mode=${mode}`);

  while (!detailsDone || !streamsDone) {
    iterations += 1;
    console.log(`[${ts()}] iteration #${iterations}`);

    let hitDailyLimit = false;

    if (!detailsDone) {
      const r = await syncDetails(id, 200);
      console.log(`[${ts()}]   details: ${JSON.stringify(r)}`);
      if (!r.rateLimited && r.processed === 0) {
        detailsDone = true;
        console.log(`[${ts()}]   details DONE`);
      }
      // If the message mentions "long" or read-limit, we hit daily cap.
      if (r.rateLimited && /long|1000/.test(r.message ?? "")) hitDailyLimit = true;
    }

    if (detailsDone && !streamsDone) {
      const r = await syncStreams(id, 200);
      console.log(`[${ts()}]   streams: ${JSON.stringify(r)}`);
      if (!r.rateLimited && r.processed === 0) {
        streamsDone = true;
        console.log(`[${ts()}]   streams DONE`);
      }
      if (r.rateLimited && /long|1000/.test(r.message ?? "")) hitDailyLimit = true;
    }

    // Between passes, push forward on things that don't hit Strava
    try {
      const w = await backfillWeather(id, 500);
      if (w.processed > 0) console.log(`[${ts()}]   weather +${w.processed}`);
    } catch (e) {
      console.error(`[${ts()}]   weather error`, e);
    }
    try {
      const e = await embedActivitiesBatch(id, 500);
      if (e.processed > 0) console.log(`[${ts()}]   embeddings +${e.processed}`);
    } catch (e) {
      console.error(`[${ts()}]   embeddings error`, e);
    }

    // Recompute analytics in case new data arrived
    try {
      await recomputeTrainingLoad(id);
      await rollupWeeklySummaries(id);
    } catch (e) {
      console.error(`[${ts()}]   analytics error`, e);
    }

    if (!detailsDone || !streamsDone) {
      const sleepMs = hitDailyLimit ? msUntilNextUtcMidnight() : SHORT_SLEEP_MS;
      const minutes = Math.round(sleepMs / 60000);
      console.log(
        `[${ts()}]   sleeping ~${minutes} min until ${hitDailyLimit ? "UTC midnight (daily limit)" : "next 15-min window"}`,
      );
      await sleep(sleepMs);
    }
  }

  console.log(`[${ts()}] sync-loop COMPLETE after ${iterations} iterations`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
