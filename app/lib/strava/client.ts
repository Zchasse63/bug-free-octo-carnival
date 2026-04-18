import { getValidAccessToken } from "@/lib/strava/token";
import type {
  StravaDetailActivity,
  StravaRateLimit,
  StravaStreamSet,
  StravaSummaryActivity,
} from "@/lib/strava/types";

const BASE = "https://www.strava.com/api/v3";

export class StravaRateLimitError extends Error {
  constructor(public readonly kind: "short" | "long", public readonly rate: StravaRateLimit) {
    super(`Strava rate limit hit (${kind}): ${rate.shortUsed}/${rate.shortLimit} short, ${rate.longUsed}/${rate.longLimit} long`);
  }
}

export class StravaHttpError extends Error {
  constructor(public readonly status: number, public readonly body: string) {
    super(`Strava HTTP ${status}: ${body}`);
  }
}

function parseRateLimit(res: Response): StravaRateLimit | null {
  const usage = res.headers.get("x-ratelimit-usage");
  const limit = res.headers.get("x-ratelimit-limit");
  if (!usage || !limit) return null;
  const [su, lu] = usage.split(",").map((x) => parseInt(x, 10));
  const [sl, ll] = limit.split(",").map((x) => parseInt(x, 10));
  return { shortUsed: su, shortLimit: sl, longUsed: lu, longLimit: ll };
}

export type StravaRequestOptions = {
  athleteId: number;
  /** If true, failing a soft-threshold check raises StravaRateLimitError. Default: true. */
  respectSoftLimit?: boolean;
  /** Fraction of 15-min limit to treat as "safe to proceed". Default 0.9. */
  shortSafetyFraction?: number;
  /** Fraction of daily limit to treat as "safe to proceed". Default 0.9. */
  longSafetyFraction?: number;
};

async function request<T>(
  path: string,
  query: Record<string, string | number | boolean | undefined>,
  opts: StravaRequestOptions,
): Promise<{ data: T; rate: StravaRateLimit | null }> {
  const token = await getValidAccessToken(opts.athleteId);
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) qs.set(k, String(v));
  }
  const url = `${BASE}${path}${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const rate = parseRateLimit(res);

  if (res.status === 429) {
    throw new StravaRateLimitError(
      rate && rate.longUsed >= rate.longLimit ? "long" : "short",
      rate ?? { shortUsed: 0, shortLimit: 100, longUsed: 0, longLimit: 1000 },
    );
  }
  if (!res.ok) throw new StravaHttpError(res.status, await res.text());

  if (rate && opts.respectSoftLimit !== false) {
    const shortFrac = opts.shortSafetyFraction ?? 0.9;
    const longFrac = opts.longSafetyFraction ?? 0.9;
    if (rate.shortUsed / rate.shortLimit >= shortFrac) {
      throw new StravaRateLimitError("short", rate);
    }
    if (rate.longUsed / rate.longLimit >= longFrac) {
      throw new StravaRateLimitError("long", rate);
    }
  }

  return { data: (await res.json()) as T, rate };
}

export async function listAthleteActivities(
  page: number,
  perPage: number,
  opts: StravaRequestOptions,
  extra: { before?: number; after?: number } = {},
) {
  return request<StravaSummaryActivity[]>(
    "/athlete/activities",
    { page, per_page: perPage, before: extra.before, after: extra.after },
    opts,
  );
}

export async function getActivityDetail(activityId: number, opts: StravaRequestOptions) {
  return request<StravaDetailActivity>(
    `/activities/${activityId}`,
    { include_all_efforts: true },
    opts,
  );
}

const STREAM_KEYS = [
  "time",
  "distance",
  "latlng",
  "altitude",
  "velocity_smooth",
  "heartrate",
  "cadence",
  "watts",
  "temp",
  "moving",
  "grade_smooth",
].join(",");

export async function getActivityStreams(activityId: number, opts: StravaRequestOptions) {
  return request<StravaStreamSet>(
    `/activities/${activityId}/streams`,
    { keys: STREAM_KEYS, key_by_type: true },
    opts,
  );
}

export async function getAthleteGear(athleteId: number, opts: StravaRequestOptions) {
  // There's no "list gear" endpoint — gear comes with the /athlete response
  return request<{ bikes?: unknown[]; shoes?: unknown[] }>("/athlete", {}, opts);
}
