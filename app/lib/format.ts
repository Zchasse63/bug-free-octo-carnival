export function metersToKm(m: number | null | undefined, digits = 1): string {
  if (m === null || m === undefined) return "—";
  return (m / 1000).toFixed(digits);
}

export function metersToMiles(m: number | null | undefined, digits = 1): string {
  if (m === null || m === undefined) return "—";
  return (m / 1609.344).toFixed(digits);
}

export function secondsToDuration(s: number | null | undefined): string {
  if (s === null || s === undefined || s < 0) return "—";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}:${String(sec).padStart(2, "0")}`;
  return `0:${String(sec).padStart(2, "0")}`;
}

export function paceFromSecondsPerKm(
  secsPerKm: number | null | undefined,
  unit: "metric" | "imperial" = "metric",
): string {
  if (secsPerKm === null || secsPerKm === undefined || secsPerKm <= 0) return "—";
  const raw = unit === "imperial" ? secsPerKm * 1.609344 : secsPerKm;
  // Round to the nearest whole second first, then split into m/s so we never
  // render "7:60" when the seconds component rounds up to 60.
  const total = Math.round(raw);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}${unit === "imperial" ? "/mi" : "/km"}`;
}

export function relativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const day = 86400000;
  if (diffMs < day) return "Today";
  if (diffMs < 2 * day) return "Yesterday";
  if (diffMs < 7 * day) return `${Math.floor(diffMs / day)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function cToF(c: number | null | undefined): number | null {
  if (c === null || c === undefined) return null;
  return (c * 9) / 5 + 32;
}

export function kmhToMph(kmh: number | null | undefined): number | null {
  if (kmh === null || kmh === undefined) return null;
  return kmh * 0.621371;
}
