import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getActivityDetail, listAthleteActivities } from "@/lib/strava/client";
import {
  summaryToActivityRow,
  detailToActivityUpdate,
  lapsToRows,
  splitsToRows,
  bestEffortsToRows,
  segmentEffortsToRows,
} from "@/lib/strava/transform";

const VERIFY_TOKEN = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN ?? "cadence-verify";

// Strava subscription verification
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return NextResponse.json({ "hub.challenge": challenge });
  }
  return NextResponse.json({ error: "verification_failed" }, { status: 403 });
}

type WebhookEvent = {
  object_type: "activity" | "athlete";
  object_id: number;
  aspect_type: "create" | "update" | "delete";
  owner_id: number;
  subscription_id: number;
  event_time: number;
  updates?: Record<string, string>;
};

export async function POST(req: Request) {
  const event = (await req.json()) as WebhookEvent;

  // ACK immediately — Strava requires < 2s response
  const ack = NextResponse.json({ received: true });

  // Process asynchronously
  (async () => {
    const sb = createServiceClient();
    try {
      if (event.object_type === "activity" && event.aspect_type === "create") {
        // Fetch summary + detail
        const { data: summaries } = await listAthleteActivities(
          1,
          10,
          { athleteId: event.owner_id },
          {},
        );
        const summary = summaries.find((s) => s.id === event.object_id);
        if (summary) {
          await sb
            .from("activities")
            .upsert(summaryToActivityRow(summary, event.owner_id), { onConflict: "id" });
        }
        const { data: detail } = await getActivityDetail(event.object_id, {
          athleteId: event.owner_id,
        });
        await sb
          .from("activities")
          .update(detailToActivityUpdate(detail))
          .eq("id", event.object_id);
        if (detail.laps?.length) {
          await sb
            .from("activity_laps")
            .upsert(lapsToRows(detail.laps, event.owner_id), { onConflict: "id" });
        }
        if (detail.splits_metric?.length) {
          await sb
            .from("activity_splits")
            .upsert(
              splitsToRows(detail.splits_metric, event.object_id, event.owner_id, "metric"),
              { onConflict: "activity_id,unit_system,split_number" },
            );
        }
        if (detail.best_efforts?.length) {
          await sb
            .from("best_efforts")
            .upsert(bestEffortsToRows(detail.best_efforts, event.owner_id), {
              onConflict: "id",
            });
        }
        if (detail.segment_efforts?.length) {
          await sb
            .from("segment_efforts")
            .upsert(
              segmentEffortsToRows(detail.segment_efforts, event.owner_id),
              { onConflict: "id" },
            );
        }
      } else if (event.object_type === "activity" && event.aspect_type === "delete") {
        await sb.from("activities").delete().eq("id", event.object_id);
      } else if (event.object_type === "activity" && event.aspect_type === "update") {
        // Title/type change — refetch detail
        const { data: detail } = await getActivityDetail(event.object_id, {
          athleteId: event.owner_id,
        });
        await sb
          .from("activities")
          .update(detailToActivityUpdate(detail))
          .eq("id", event.object_id);
      }
    } catch (e) {
      console.error("[strava webhook]", e);
    }
  })();

  return ack;
}
