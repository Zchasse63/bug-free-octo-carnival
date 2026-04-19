/**
 * Unit-preference helper. Strava's athletes.measurement_preference values:
 *   "meters" → metric (km, kg, °C, km/h)
 *   "feet"   → imperial (mi, lb, °F, mph)
 * Treat anything not explicitly metric as imperial.
 */
export function isImperial(pref: string | null | undefined): boolean {
  return pref !== "meters";
}

export function prefersMetric(pref: string | null | undefined): boolean {
  return !isImperial(pref);
}
