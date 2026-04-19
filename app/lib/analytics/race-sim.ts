import { pacesFromVdot } from "@/lib/analytics/vdot";

export type RaceSimInput = {
  vdot: number;
  distance_m: number;
  temperature_c?: number;
  humidity_pct?: number;
  elevation_gain_m?: number;
  current_tsb?: number;
};

export type RaceSimResult = {
  predicted_time_seconds: number;
  pace_seconds_per_km: number;
  confidence_range: {
    optimistic_seconds: number;
    realistic_seconds: number;
    conservative_seconds: number;
  };
  heat_adjustment_seconds_per_km: number;
  elevation_adjustment_seconds_per_km: number;
  form_adjustment_seconds_per_km: number;
};

/**
 * Heat adjustment (sec/km), calibrated against common running-science tables.
 */
function heatAdjustment(tempC?: number, humidityPct?: number): number {
  if (tempC === undefined) return 0;
  // Optimal zone 10-13°C; add ~10-30s/mi (~6-18s/km) above
  let sec = 0;
  if (tempC <= 13) sec = 0;
  else if (tempC <= 18) sec = 4 + ((tempC - 13) / 5) * 6;
  else if (tempC <= 24) sec = 10 + ((tempC - 18) / 6) * 8;
  else if (tempC <= 29) sec = 18 + ((tempC - 24) / 5) * 12;
  else sec = 30 + ((tempC - 29) / 3) * 10;
  if (humidityPct && humidityPct > 70) sec *= 1 + ((humidityPct - 70) / 100);
  return Math.round(sec);
}

/**
 * Elevation gain adjustment — ~12-15 seconds added per km for every 100m of climb,
 * divided across the distance.
 */
function elevationAdjustment(gainM?: number, distanceM?: number): number {
  if (!gainM || !distanceM) return 0;
  const km = distanceM / 1000;
  if (km <= 0) return 0;
  return Math.round((gainM / 100) * 14 / km);
}

/**
 * Form (TSB) adjustment. Fresh = minor benefit, fatigued = penalty.
 */
function formAdjustment(tsb?: number): number {
  if (tsb === undefined || tsb === null) return 0;
  if (tsb > 15) return -3;
  if (tsb > 5) return -1;
  if (tsb > -10) return 0;
  if (tsb > -20) return 4;
  return 10;
}

export function simulateRace(input: RaceSimInput): RaceSimResult {
  const paces = pacesFromVdot(input.vdot);
  if (!paces) throw new Error("VDOT required");

  // Base pace for distance — interpolate between Daniels tiers
  // 5K ≈ interval pace, 10K ≈ 95% threshold, HM ≈ 105% marathon, M ≈ marathon
  const km = input.distance_m / 1000;
  let basePace: number;
  if (km <= 5.5) basePace = paces.interval;
  else if (km <= 11) basePace = Math.round((paces.interval + paces.threshold) / 2);
  else if (km <= 22) basePace = Math.round((paces.threshold + paces.marathon) / 2);
  else basePace = paces.marathon;

  const heat = heatAdjustment(input.temperature_c, input.humidity_pct);
  const elev = elevationAdjustment(input.elevation_gain_m, input.distance_m);
  const form = formAdjustment(input.current_tsb);
  const pace = basePace + heat + elev + form;
  const timeSec = Math.round(pace * km);

  return {
    predicted_time_seconds: timeSec,
    pace_seconds_per_km: pace,
    confidence_range: {
      optimistic_seconds: Math.round(timeSec * 0.97),
      realistic_seconds: timeSec,
      conservative_seconds: Math.round(timeSec * 1.03),
    },
    heat_adjustment_seconds_per_km: heat,
    elevation_adjustment_seconds_per_km: elev,
    form_adjustment_seconds_per_km: form,
  };
}
