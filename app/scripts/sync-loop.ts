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

const FIFTEEN_MIN_MS = 15 * 60 * 1000;
const SLEEP_MS = 15 * 60 * 1000 + 30 * 1000; // 15m30s — a little over a window

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

    if (!detailsDone) {
      const r = await syncDetails(id, 200);
      console.log(`[${ts()}]   details: ${JSON.stringify(r)}`);
      if (!r.rateLimited && r.processed === 0) {
        detailsDone = true;
        console.log(`[${ts()}]   details DONE`);
      }
    }

    if (detailsDone && !streamsDone) {
      const r = await syncStreams(id, 200);
      console.log(`[${ts()}]   streams: ${JSON.stringify(r)}`);
      if (!r.rateLimited && r.processed === 0) {
        streamsDone = true;
        console.log(`[${ts()}]   streams DONE`);
      }
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
      console.log(`[${ts()}]   sleeping ~${Math.round(SLEEP_MS / 60000)} min until Strava window resets`);
      await sleep(SLEEP_MS);
    }
  }

  console.log(`[${ts()}] sync-loop COMPLETE after ${iterations} iterations`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
