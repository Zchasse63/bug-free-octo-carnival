import { createServiceClient } from "@/lib/supabase/service";

/**
 * Career-level aggregates for the History page. Every query here is
 * read-only, pages through Supabase's 1000-row limit where needed, and
 * is cheap enough to run on every page load for now.
 */

export type CareerOverview = {
  first_activity_date: string | null;
  total_runs: number;
  total_distance_meters: number;
  total_moving_seconds: number;
  total_elevation_meters: number;
  total_runs_longer_than_marathon: number;
};

export async function getCareerOverview(
  athleteId: number,
): Promise<CareerOverview> {
  const sb = createServiceClient();
  const PAGE = 1000;
  let first: string | null = null;
  let total_runs = 0;
  let total_distance_meters = 0;
  let total_moving_seconds = 0;
  let total_elevation_meters = 0;
  let total_runs_longer_than_marathon = 0;
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await sb
      .from("activities")
      .select(
        "start_date_local, sport_type, distance_meters, moving_time, total_elevation_gain",
      )
      .eq("athlete_id", athleteId)
      .in("sport_type", ["Run", "TrailRun"])
      .order("start_date_local", { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const a of data) {
      if (!first || a.start_date_local < first) first = a.start_date_local;
      total_runs += 1;
      const d = Number(a.distance_meters) || 0;
      total_distance_meters += d;
      total_moving_seconds += a.moving_time ?? 0;
      total_elevation_meters += Number(a.total_elevation_gain) || 0;
      if (d > 42195) total_runs_longer_than_marathon += 1;
    }
    if (data.length < PAGE) break;
  }
  return {
    first_activity_date: first,
    total_runs,
    total_distance_meters,
    total_moving_seconds,
    total_elevation_meters,
    total_runs_longer_than_marathon,
  };
}

export type MonthlyBucket = {
  month: string; // "YYYY-MM-01"
  run_count: number;
  distance_meters: number;
  elevation_meters: number;
};

export async function getMonthlyVolume(
  athleteId: number,
  months = 36,
): Promise<MonthlyBucket[]> {
  const sb = createServiceClient();
  const since = new Date();
  since.setUTCMonth(since.getUTCMonth() - months);
  since.setUTCDate(1);
  const sinceIso = since.toISOString().slice(0, 10);

  const PAGE = 1000;
  const byMonth = new Map<
    string,
    { count: number; distance: number; elevation: number }
  >();
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await sb
      .from("activities")
      .select(
        "start_date_local, sport_type, distance_meters, total_elevation_gain",
      )
      .eq("athlete_id", athleteId)
      .in("sport_type", ["Run", "TrailRun"])
      .gte("start_date_local", sinceIso)
      .order("start_date_local", { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const a of data) {
      const month = a.start_date_local.slice(0, 7) + "-01";
      const cur = byMonth.get(month) ?? { count: 0, distance: 0, elevation: 0 };
      cur.count += 1;
      cur.distance += Number(a.distance_meters) || 0;
      cur.elevation += Number(a.total_elevation_gain) || 0;
      byMonth.set(month, cur);
    }
    if (data.length < PAGE) break;
  }
  const cursor = new Date(since);
  const out: MonthlyBucket[] = [];
  for (let i = 0; i < months; i++) {
    const key = cursor.toISOString().slice(0, 7) + "-01";
    const v = byMonth.get(key) ?? { count: 0, distance: 0, elevation: 0 };
    out.push({
      month: key,
      run_count: v.count,
      distance_meters: v.distance,
      elevation_meters: v.elevation,
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return out;
}

export type FitnessCurvePoint = {
  date: string;
  fitness: number;
};

/**
 * Long-term Fitness (CTL) curve — one data point per week for readability.
 */
export async function getFitnessCurve(
  athleteId: number,
): Promise<FitnessCurvePoint[]> {
  const sb = createServiceClient();
  const { data } = await sb
    .from("weekly_summaries")
    .select("week_start, total_training_load")
    .eq("athlete_id", athleteId)
    .order("week_start", { ascending: true });
  if (!data || data.length === 0) return [];
  // Re-derive CTL from weekly load with a 6-week EMA (42-day CTL, weekly).
  const alpha = 2 / (6 + 1);
  let ctl = 0;
  const out: FitnessCurvePoint[] = [];
  for (const row of data) {
    const weeklyLoad = Number(row.total_training_load) || 0;
    // Treat the weekly load as a 7-day average of daily load.
    const dailyLoad = weeklyLoad / 7;
    ctl = ctl + alpha * (dailyLoad - ctl);
    out.push({ date: row.week_start, fitness: Math.round(ctl * 10) / 10 });
  }
  return out;
}

export type BestEffortPR = {
  name: string;
  distance_meters: number;
  best_time_seconds: number;
  best_date: string;
  activity_id: number | null;
};

/** One PR per standard race distance, taken across the athlete's whole history. */
export async function getAllTimeBestEfforts(
  athleteId: number,
): Promise<BestEffortPR[]> {
  const sb = createServiceClient();
  const DISTANCES = [
    { name: "1 mile", distance: 1609.34 },
    { name: "5k", distance: 5000 },
    { name: "10k", distance: 10000 },
    { name: "Half Marathon", distance: 21097.5 },
    { name: "Marathon", distance: 42195 },
  ];
  const out: BestEffortPR[] = [];
  for (const d of DISTANCES) {
    const { data } = await sb
      .from("best_efforts")
      .select("elapsed_time, start_date_local, activity_id")
      .eq("athlete_id", athleteId)
      .eq("name", d.name)
      .gt("elapsed_time", 0)
      .order("elapsed_time", { ascending: true })
      .limit(1);
    const row = data?.[0];
    if (!row) continue;
    out.push({
      name: d.name,
      distance_meters: d.distance,
      best_time_seconds: row.elapsed_time,
      best_date: row.start_date_local ?? "",
      activity_id: row.activity_id ?? null,
    });
  }
  return out;
}

export type PaceProgressionRow = {
  quarter: string; // "YYYY-Qn"
  distance_name: string;
  best_pace_sec_per_km: number;
};

/**
 * For the common race distances, pull the best pace achieved each quarter
 * so we can draw a PR curve over time.
 */
export async function getPaceProgression(
  athleteId: number,
  distances = ["5k", "10k", "Half Marathon"],
): Promise<PaceProgressionRow[]> {
  const sb = createServiceClient();
  const rows: PaceProgressionRow[] = [];
  for (const name of distances) {
    const { data } = await sb
      .from("best_efforts")
      .select("elapsed_time, distance_meters, start_date_local")
      .eq("athlete_id", athleteId)
      .eq("name", name)
      .gt("elapsed_time", 0)
      .order("start_date_local", { ascending: true });
    if (!data) continue;
    const byQuarter = new Map<string, number>();
    for (const r of data) {
      const d = new Date(r.start_date_local ?? "");
      if (Number.isNaN(d.getTime())) continue;
      const q = Math.floor(d.getUTCMonth() / 3) + 1;
      const key = `${d.getUTCFullYear()}-Q${q}`;
      const paceSecPerKm =
        Number(r.distance_meters) > 0
          ? r.elapsed_time / (Number(r.distance_meters) / 1000)
          : 0;
      if (paceSecPerKm <= 0) continue;
      const cur = byQuarter.get(key);
      if (!cur || paceSecPerKm < cur) byQuarter.set(key, paceSecPerKm);
    }
    for (const [q, pace] of byQuarter.entries()) {
      rows.push({
        quarter: q,
        distance_name: name,
        best_pace_sec_per_km: Math.round(pace),
      });
    }
  }
  return rows.sort((a, b) => a.quarter.localeCompare(b.quarter));
}

export type HrEfficiencyPoint = {
  month: string;
  avg_easy_hr: number | null;
  avg_easy_pace_sec_per_km: number | null;
};

/**
 * Easy-run HR-at-pace by month, over the last 18 months. Useful as a
 * proxy for aerobic efficiency — as you get fitter, HR drops at the
 * same pace.
 */
export async function getHrEfficiency(
  athleteId: number,
  months = 18,
): Promise<HrEfficiencyPoint[]> {
  const sb = createServiceClient();
  const since = new Date();
  since.setUTCMonth(since.getUTCMonth() - months);
  since.setUTCDate(1);
  const sinceIso = since.toISOString().slice(0, 10);

  const PAGE = 1000;
  const byMonth = new Map<
    string,
    { hrSum: number; paceSum: number; count: number }
  >();
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await sb
      .from("activities")
      .select(
        "start_date_local, sport_type, average_heartrate, distance_meters, moving_time, workout_classification",
      )
      .eq("athlete_id", athleteId)
      .in("sport_type", ["Run", "TrailRun"])
      .gte("start_date_local", sinceIso)
      .order("start_date_local", { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const a of data) {
      const dist = Number(a.distance_meters) || 0;
      const time = a.moving_time ?? 0;
      if (!a.average_heartrate || dist < 3000 || time <= 0) continue;
      const paceSecPerKm = time / (dist / 1000);
      // Approximate "easy" via pace — slower than 5:00/km (roughly),
      // excluding obvious walks (> 10:00/km) and any flagged non-easy
      // workout classifications.
      const cls = a.workout_classification ?? "";
      if (["tempo", "threshold", "intervals", "race"].includes(cls)) continue;
      if (paceSecPerKm < 300 || paceSecPerKm > 600) continue;
      const month = a.start_date_local.slice(0, 7) + "-01";
      const cur = byMonth.get(month) ?? { hrSum: 0, paceSum: 0, count: 0 };
      cur.hrSum += a.average_heartrate;
      cur.paceSum += paceSecPerKm;
      cur.count += 1;
      byMonth.set(month, cur);
    }
    if (data.length < PAGE) break;
  }
  return Array.from(byMonth.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, v]) => ({
      month,
      avg_easy_hr: v.count ? Math.round(v.hrSum / v.count) : null,
      avg_easy_pace_sec_per_km: v.count ? Math.round(v.paceSum / v.count) : null,
    }));
}

export type TimeOfDayRow = {
  bucket: "Early morning" | "Morning" | "Midday" | "Afternoon" | "Evening";
  run_count: number;
  avg_pace_sec_per_km: number | null;
  avg_heartrate: number | null;
  avg_distance_meters: number | null;
};

function bucketFromHour(h: number): TimeOfDayRow["bucket"] {
  if (h < 7) return "Early morning";
  if (h < 11) return "Morning";
  if (h < 14) return "Midday";
  if (h < 18) return "Afternoon";
  return "Evening";
}

export async function getTimeOfDayStats(
  athleteId: number,
): Promise<TimeOfDayRow[]> {
  const sb = createServiceClient();
  const PAGE = 1000;
  const accum = new Map<
    string,
    { count: number; paceSum: number; hrSum: number; hrCount: number; distSum: number }
  >();
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await sb
      .from("activities")
      .select(
        "start_date_local, sport_type, distance_meters, moving_time, average_heartrate",
      )
      .eq("athlete_id", athleteId)
      .in("sport_type", ["Run", "TrailRun"])
      .order("start_date_local", { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const a of data) {
      const dist = Number(a.distance_meters) || 0;
      const time = a.moving_time ?? 0;
      if (dist < 1000 || time <= 0) continue;
      const paceSecPerKm = time / (dist / 1000);
      if (paceSecPerKm > 900) continue; // drop walks
      const hour = new Date(a.start_date_local).getUTCHours();
      const bucket = bucketFromHour(hour);
      const cur =
        accum.get(bucket) ??
        { count: 0, paceSum: 0, hrSum: 0, hrCount: 0, distSum: 0 };
      cur.count += 1;
      cur.paceSum += paceSecPerKm;
      cur.distSum += dist;
      if (a.average_heartrate) {
        cur.hrSum += a.average_heartrate;
        cur.hrCount += 1;
      }
      accum.set(bucket, cur);
    }
    if (data.length < PAGE) break;
  }
  const buckets: TimeOfDayRow["bucket"][] = [
    "Early morning",
    "Morning",
    "Midday",
    "Afternoon",
    "Evening",
  ];
  return buckets
    .map((b) => {
      const v = accum.get(b);
      if (!v) return null;
      return {
        bucket: b,
        run_count: v.count,
        avg_pace_sec_per_km: v.count
          ? Math.round(v.paceSum / v.count)
          : null,
        avg_heartrate: v.hrCount
          ? Math.round(v.hrSum / v.hrCount)
          : null,
        avg_distance_meters: v.count ? Math.round(v.distSum / v.count) : null,
      };
    })
    .filter((r): r is TimeOfDayRow => r !== null);
}

export type Milestone = {
  label: string;
  date: string;
  distance_meters: number;
};

export async function getMilestones(
  athleteId: number,
): Promise<Milestone[]> {
  const sb = createServiceClient();
  const out: Milestone[] = [];

  // First run ever
  const { data: firstRuns } = await sb
    .from("activities")
    .select("id, start_date_local, distance_meters")
    .eq("athlete_id", athleteId)
    .in("sport_type", ["Run", "TrailRun"])
    .order("start_date_local", { ascending: true })
    .limit(1);
  const first = firstRuns?.[0];
  if (first) {
    out.push({
      label: "First run on Cadence",
      date: first.start_date_local.slice(0, 10),
      distance_meters: Number(first.distance_meters) || 0,
    });
  }

  // First 10K, HM, Marathon distance reached
  const thresholds = [
    { label: "First 10K distance", meters: 10000 },
    { label: "First half-marathon distance", meters: 21097.5 },
    { label: "First marathon distance", meters: 42195 },
  ];
  for (const t of thresholds) {
    const { data } = await sb
      .from("activities")
      .select("start_date_local, distance_meters")
      .eq("athlete_id", athleteId)
      .in("sport_type", ["Run", "TrailRun"])
      .gte("distance_meters", t.meters)
      .order("start_date_local", { ascending: true })
      .limit(1);
    const hit = data?.[0];
    if (hit)
      out.push({
        label: t.label,
        date: hit.start_date_local.slice(0, 10),
        distance_meters: Number(hit.distance_meters) || 0,
      });
  }

  // Longest run ever
  const { data: longest } = await sb
    .from("activities")
    .select("start_date_local, distance_meters")
    .eq("athlete_id", athleteId)
    .in("sport_type", ["Run", "TrailRun"])
    .order("distance_meters", { ascending: false })
    .limit(1);
  const lr = longest?.[0];
  if (lr)
    out.push({
      label: "Longest run ever",
      date: lr.start_date_local.slice(0, 10),
      distance_meters: Number(lr.distance_meters) || 0,
    });

  // Biggest training week
  const { data: biggestWeek } = await sb
    .from("weekly_summaries")
    .select("week_start, run_distance_meters")
    .eq("athlete_id", athleteId)
    .order("run_distance_meters", { ascending: false })
    .limit(1);
  const bw = biggestWeek?.[0];
  if (bw)
    out.push({
      label: "Biggest training week",
      date: bw.week_start,
      distance_meters: Number(bw.run_distance_meters) || 0,
    });

  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export type TopRoute = {
  lat_rounded: number;
  lng_rounded: number;
  run_count: number;
  avg_distance_meters: number;
  avg_pace_sec_per_km: number | null;
};

/**
 * Top 5 most-repeated run starting points. Clusters by rounding start
 * coordinates to ~0.01° (~1km) — same approach as /activities/routes.
 */
export async function getTopRoutes(
  athleteId: number,
  limit = 5,
): Promise<TopRoute[]> {
  const sb = createServiceClient();
  const PAGE = 1000;
  const clusters = new Map<
    string,
    {
      lat: number;
      lng: number;
      count: number;
      distSum: number;
      paceSum: number;
      paceCount: number;
    }
  >();
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await sb
      .from("activities")
      .select(
        "sport_type, start_lat, start_lng, distance_meters, moving_time",
      )
      .eq("athlete_id", athleteId)
      .in("sport_type", ["Run", "TrailRun"])
      .order("start_date_local", { ascending: true })
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const a of data) {
      const lat = a.start_lat;
      const lng = a.start_lng;
      if (lat == null || lng == null) continue;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
      const dist = Number(a.distance_meters) || 0;
      const time = a.moving_time ?? 0;
      const pace = dist > 0 && time > 0 ? time / (dist / 1000) : null;
      const cur = clusters.get(key) ?? {
        lat: Number(lat.toFixed(2)),
        lng: Number(lng.toFixed(2)),
        count: 0,
        distSum: 0,
        paceSum: 0,
        paceCount: 0,
      };
      cur.count += 1;
      cur.distSum += dist;
      if (pace && pace < 900) {
        cur.paceSum += pace;
        cur.paceCount += 1;
      }
      clusters.set(key, cur);
    }
    if (data.length < PAGE) break;
  }
  return Array.from(clusters.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((c) => ({
      lat_rounded: c.lat,
      lng_rounded: c.lng,
      run_count: c.count,
      avg_distance_meters: c.count ? Math.round(c.distSum / c.count) : 0,
      avg_pace_sec_per_km: c.paceCount
        ? Math.round(c.paceSum / c.paceCount)
        : null,
    }));
}
