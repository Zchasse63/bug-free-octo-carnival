/**
 * Plain-English labels for the jargon metrics we show on the dashboard,
 * coach snapshots, and history page. All five metrics keep their
 * technical names in the DB and in types — these helpers are for
 * user-facing rendering only.
 *
 *   CTL  → Fitness      (long-term training accumulation, 42-day EMA of load)
 *   ATL  → Fatigue      (short-term load you haven't recovered from yet, 7-day EMA)
 *   TSB  → Freshness    (CTL − ATL; +ve = fresh, -ve = tired)
 *   VDOT → Running score (Jack Daniels VO2max proxy; predicts race paces)
 *   ACWR → Injury risk   (Acute:Chronic workload ratio; >1.3 = elevated risk)
 */

import { pacesFromVdot } from "@/lib/analytics/vdot";

// ---- VDOT / Running score ----------------------------------------------------

export type RunningScoreBand =
  | "Beginner"
  | "Recreational"
  | "Competitive"
  | "Advanced"
  | "Elite";

export function runningScoreBand(vdot: number | null | undefined): RunningScoreBand | null {
  if (vdot == null) return null;
  if (vdot < 35) return "Beginner";
  if (vdot < 45) return "Recreational";
  if (vdot < 55) return "Competitive";
  if (vdot < 65) return "Advanced";
  return "Elite";
}

/** Race-time predictions (seconds) derived from VDOT using the Daniels pace table. */
export function predictedRaceTimes(
  vdot: number | null | undefined,
): { km5: number; km10: number; halfMarathon: number; marathon: number } | null {
  if (vdot == null) return null;
  const paces = pacesFromVdot(vdot);
  if (!paces) return null;
  // Use distance-appropriate paces: 5K ≈ interval pace, 10K ≈ between
  // interval & threshold, HM ≈ threshold, Marathon ≈ marathon pace.
  const km5 = paces.interval * 5;
  const km10 = Math.round((paces.interval + paces.threshold) / 2) * 10;
  const halfMarathon = Math.round(paces.threshold * 21.0975);
  const marathon = Math.round(paces.marathon * 42.195);
  return { km5, km10, halfMarathon, marathon };
}

export function formatRaceTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ---- CTL / Fitness ----------------------------------------------------------

export type FitnessBand =
  | "Beginner"
  | "Recreational"
  | "Trained"
  | "Advanced"
  | "Highly trained";

export function fitnessBand(ctl: number | null | undefined): FitnessBand | null {
  if (ctl == null) return null;
  if (ctl < 30) return "Beginner";
  if (ctl < 50) return "Recreational";
  if (ctl < 70) return "Trained";
  if (ctl < 90) return "Advanced";
  return "Highly trained";
}

// ---- ATL / Fatigue ----------------------------------------------------------

export type FatigueLevel = "Low" | "Moderate" | "High";

/** Fatigue is only meaningful relative to the athlete's own Fitness baseline. */
export function fatigueLevel(
  atl: number | null | undefined,
  ctl: number | null | undefined,
): FatigueLevel | null {
  if (atl == null || ctl == null || ctl <= 0) return null;
  const ratio = atl / ctl;
  if (ratio < 0.8) return "Low";
  if (ratio > 1.2) return "High";
  return "Moderate";
}

// ---- TSB / Freshness --------------------------------------------------------

export type FreshnessBand =
  | "Overreaching"
  | "Productively tired"
  | "Holding steady"
  | "Race-ready"
  | "Very fresh";

export function freshnessBand(tsb: number | null | undefined): FreshnessBand | null {
  if (tsb == null) return null;
  if (tsb <= -30) return "Overreaching";
  if (tsb <= -10) return "Productively tired";
  if (tsb <= 10) return "Holding steady";
  if (tsb <= 25) return "Race-ready";
  return "Very fresh";
}

/** 0..1 position on the scale from Overreaching → Very fresh. Clamped. */
export function freshnessScalePosition(tsb: number | null | undefined): number {
  if (tsb == null) return 0.5;
  // Clamp TSB to [-40, +40] for visualization, map to [0, 1].
  const clamped = Math.max(-40, Math.min(40, tsb));
  return (clamped + 40) / 80;
}

// ---- ACWR / Injury risk -----------------------------------------------------

export type InjuryRiskLevel = "low" | "optimal" | "elevated" | "high";

export function injuryRiskBand(acwr: number | null | undefined): InjuryRiskLevel {
  if (acwr == null || acwr < 0.8) return "low";
  if (acwr < 1.3) return "optimal";
  if (acwr < 1.5) return "elevated";
  return "high";
}

// ---- Trend helpers ----------------------------------------------------------

/**
 * Returns a compact delta string like "+2.3" or "−1.1" or "≈".
 * `now` vs `then` (4-weeks-ago value); returns "≈" when delta is small.
 */
export function trendDelta(now: number, then: number, precision = 1): string {
  const d = now - then;
  if (Math.abs(d) < (precision === 0 ? 1 : 0.5)) return "≈";
  const rounded = d.toFixed(precision);
  if (d > 0) return `+${rounded}`;
  return rounded.replace("-", "−");
}

export function trendArrow(now: number, then: number, tolerance = 0.5): "up" | "down" | "flat" {
  if (now - then > tolerance) return "up";
  if (now - then < -tolerance) return "down";
  return "flat";
}
