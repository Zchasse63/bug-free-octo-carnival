import { createServiceClient } from "@/lib/supabase/service";
import {
  StravaRateLimitError,
  getActivityDetail,
  getActivityStreams,
  listAthleteActivities,
} from "@/lib/strava/client";
import {
  bestEffortsToRows,
  detailToActivityUpdate,
  lapsToRows,
  segmentEffortsToRows,
  splitsToRows,
  streamsToRow,
  summaryToActivityRow,
} from "@/lib/strava/transform";

export type SyncResult = {
  pass: "summaries" | "details" | "streams";
  processed: number;
  failed: number;
  rateLimited: boolean;
  message?: string;
};

async function logSync(
  athleteId: number,
  syncType: string,
  status: string,
  counts: { synced?: number; failed?: number; rateLimited?: boolean; error?: string },
) {
  const sb = createServiceClient();
  await sb.from("sync_log").insert({
    athlete_id: athleteId,
    sync_type: syncType,
    status,
    activities_synced: counts.synced ?? 0,
    activities_failed: counts.failed ?? 0,
    rate_limit_hit: counts.rateLimited ?? false,
    error_message: counts.error ?? null,
    completed_at: new Date().toISOString(),
  });
}

/** PASS 1 — Activity summaries. Paginates until empty page or rate limit. */
export async function syncSummaries(athleteId: number): Promise<SyncResult> {
  const sb = createServiceClient();
  let processed = 0;
  let page = 1;
  const perPage = 200;

  try {
    while (true) {
      const { data } = await listAthleteActivities(page, perPage, { athleteId });
      if (data.length === 0) break;

      const rows = data.map((s) => summaryToActivityRow(s, athleteId));
      const { error } = await sb.from("activities").upsert(rows, { onConflict: "id" });
      if (error) throw error;

      processed += rows.length;
      await sb
        .from("athletes")
        .update({
          last_sync_at: new Date().toISOString(),
          sync_cursor_epoch: Math.floor(new Date(data[data.length - 1].start_date).getTime() / 1000),
        })
        .eq("id", athleteId);

      if (data.length < perPage) break;
      page += 1;
    }
    await logSync(athleteId, "summaries", "completed", { synced: processed });
    return { pass: "summaries", processed, failed: 0, rateLimited: false };
  } catch (err) {
    if (err instanceof StravaRateLimitError) {
      await logSync(athleteId, "summaries", "rate_limited", {
        synced: processed,
        rateLimited: true,
        error: err.message,
      });
      return { pass: "summaries", processed, failed: 0, rateLimited: true, message: err.message };
    }
    const msg = err instanceof Error ? err.message : String(err);
    await logSync(athleteId, "summaries", "failed", { synced: processed, error: msg });
    throw err;
  }
}

/** PASS 2 — Activity details. Recent-first, batched, rate-limit aware. */
export async function syncDetails(
  athleteId: number,
  maxToProcess = 1000,
): Promise<SyncResult> {
  const sb = createServiceClient();
  let processed = 0;
  let failed = 0;

  try {
    const { data: pending, error } = await sb
      .from("activities")
      .select("id")
      .eq("athlete_id", athleteId)
      .eq("detail_fetched", false)
      .order("start_date", { ascending: false })
      .limit(maxToProcess);
    if (error) throw error;
    if (!pending || pending.length === 0) {
      await logSync(athleteId, "details", "completed", { synced: 0 });
      return { pass: "details", processed: 0, failed: 0, rateLimited: false };
    }

    for (const { id } of pending) {
      try {
        const { data: detail } = await getActivityDetail(id, { athleteId });

        // Update activity
        await sb.from("activities").update(detailToActivityUpdate(detail)).eq("id", id);

        // Laps
        if (detail.laps?.length) {
          await sb
            .from("activity_laps")
            .upsert(lapsToRows(detail.laps, athleteId), { onConflict: "id" });
        }
        // Splits (metric + standard)
        if (detail.splits_metric?.length) {
          await sb.from("activity_splits").upsert(
            splitsToRows(detail.splits_metric, id, athleteId, "metric"),
            { onConflict: "activity_id,unit_system,split_number" },
          );
        }
        if (detail.splits_standard?.length) {
          await sb.from("activity_splits").upsert(
            splitsToRows(detail.splits_standard, id, athleteId, "standard"),
            { onConflict: "activity_id,unit_system,split_number" },
          );
        }
        // Best efforts
        if (detail.best_efforts?.length) {
          await sb
            .from("best_efforts")
            .upsert(bestEffortsToRows(detail.best_efforts, athleteId), { onConflict: "id" });
        }
        // Segment efforts
        if (detail.segment_efforts?.length) {
          await sb
            .from("segment_efforts")
            .upsert(segmentEffortsToRows(detail.segment_efforts, athleteId), { onConflict: "id" });
        }

        processed += 1;
      } catch (innerErr) {
        if (innerErr instanceof StravaRateLimitError) throw innerErr;
        failed += 1;
        console.error(`Detail fetch failed for activity ${id}`, innerErr);
      }
    }

    await logSync(athleteId, "details", "completed", { synced: processed, failed });
    return { pass: "details", processed, failed, rateLimited: false };
  } catch (err) {
    if (err instanceof StravaRateLimitError) {
      await logSync(athleteId, "details", "rate_limited", {
        synced: processed,
        failed,
        rateLimited: true,
        error: err.message,
      });
      return {
        pass: "details",
        processed,
        failed,
        rateLimited: true,
        message: err.message,
      };
    }
    const msg = err instanceof Error ? err.message : String(err);
    await logSync(athleteId, "details", "failed", { synced: processed, failed, error: msg });
    throw err;
  }
}

/** PASS 3 — Streams. Recent-first, rate-limit aware. */
export async function syncStreams(
  athleteId: number,
  maxToProcess = 500,
): Promise<SyncResult> {
  const sb = createServiceClient();
  let processed = 0;
  let failed = 0;

  try {
    const { data: pending, error } = await sb
      .from("activities")
      .select("id")
      .eq("athlete_id", athleteId)
      .eq("streams_fetched", false)
      .eq("detail_fetched", true)
      .order("start_date", { ascending: false })
      .limit(maxToProcess);
    if (error) throw error;
    if (!pending || pending.length === 0) {
      await logSync(athleteId, "streams", "completed", { synced: 0 });
      return { pass: "streams", processed: 0, failed: 0, rateLimited: false };
    }

    for (const { id } of pending) {
      try {
        const { data: streams } = await getActivityStreams(id, { athleteId });
        await sb
          .from("activity_streams")
          .upsert(streamsToRow(streams, id, athleteId), { onConflict: "activity_id" });
        await sb.from("activities").update({ streams_fetched: true }).eq("id", id);
        processed += 1;
      } catch (innerErr) {
        if (innerErr instanceof StravaRateLimitError) throw innerErr;
        failed += 1;
        console.error(`Stream fetch failed for activity ${id}`, innerErr);
      }
    }

    await logSync(athleteId, "streams", "completed", { synced: processed, failed });
    return { pass: "streams", processed, failed, rateLimited: false };
  } catch (err) {
    if (err instanceof StravaRateLimitError) {
      await logSync(athleteId, "streams", "rate_limited", {
        synced: processed,
        failed,
        rateLimited: true,
        error: err.message,
      });
      return {
        pass: "streams",
        processed,
        failed,
        rateLimited: true,
        message: err.message,
      };
    }
    const msg = err instanceof Error ? err.message : String(err);
    await logSync(athleteId, "streams", "failed", { synced: processed, failed, error: msg });
    throw err;
  }
}

export async function runFullBackfill(athleteId: number) {
  console.log(`[sync] Pass 1 — summaries for athlete ${athleteId}`);
  const s1 = await syncSummaries(athleteId);
  console.log(`[sync] Pass 1 done: ${s1.processed} activities`);
  if (s1.rateLimited) return { summaries: s1, details: null, streams: null };

  console.log(`[sync] Pass 2 — details`);
  const s2 = await syncDetails(athleteId);
  console.log(`[sync] Pass 2 done: ${s2.processed} processed, ${s2.failed} failed`);
  if (s2.rateLimited) return { summaries: s1, details: s2, streams: null };

  console.log(`[sync] Pass 3 — streams`);
  const s3 = await syncStreams(athleteId);
  console.log(`[sync] Pass 3 done: ${s3.processed} processed, ${s3.failed} failed`);
  return { summaries: s1, details: s2, streams: s3 };
}
