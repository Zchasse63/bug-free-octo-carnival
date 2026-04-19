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

/**
 * Strava returns TWO limit pairs:
 *   x-ratelimit-*      — overall (200/15min, 2000/day)
 *   x-readratelimit-*  — read-only (100/15min, 1000/day)
 * We must watch the tighter of the two. 429 responses typically come from
 * the read-only limit being hit even when overall usage is trivial.
 */
function parseRateLimit(res: Response): StravaRateLimit | null {
  const overallUsage = res.headers.get("x-ratelimit-usage");
  const overallLimit = res.headers.get("x-ratelimit-limit");
  const readUsage = res.headers.get("x-readratelimit-usage");
  const readLimit = res.headers.get("x-readratelimit-limit");

  function pair(s: string): [number, number] | null {
    const [a, b] = s.split(",").map((x) => parseInt(x, 10));
    return Number.isNaN(a) || Number.isNaN(b) ? null : [a, b];
  }

  const o = overallUsage && overallLimit ? { u: pair(overallUsage), l: pair(overallLimit) } : null;
  const r = readUsage && readLimit ? { u: pair(readUsage), l: pair(readLimit) } : null;
  if (!o?.u || !o?.l) return null;

  // Return the tighter set (highest usage fraction). Fall back to overall if read headers missing.
  const candidates: StravaRateLimit[] = [
    { shortUsed: o.u[0], shortLimit: o.l[0], longUsed: o.u[1], longLimit: o.l[1] },
  ];
  if (r?.u && r?.l) {
    candidates.push({ shortUsed: r.u[0], shortLimit: r.l[0], longUsed: r.u[1], longLimit: r.l[1] });
  }
  return candidates.reduce((tightest, c) => {
    const tMax = Math.max(tightest.shortUsed / tightest.shortLimit, tightest.longUsed / tightest.longLimit);
    const cMax = Math.max(c.shortUsed / c.shortLimit, c.longUsed / c.longLimit);
    return cMax > tMax ? c : tightest;
  });
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
    const fallback = { shortUsed: 0, shortLimit: 100, longUsed: 0, longLimit: 1000 };
    const r = rate ?? fallback;
    // When 429 fires but short usage looks trivial, the daily read limit is the real culprit.
    const kind: "short" | "long" =
      r.longUsed >= r.longLimit || r.shortUsed < r.shortLimit * 0.5 ? "long" : "short";
    throw new StravaRateLimitError(kind, r);
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
