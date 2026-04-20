import { freshnessScalePosition } from "@/lib/analytics/labels";

/**
 * Horizontal scale from "Overreaching" (left, red) → "Very fresh" (right,
 * green) with a saffron dot showing the athlete's current TSB position.
 * Gives the raw -18 number an immediate visual anchor without needing
 * the user to recall what TSB means.
 */
export function FreshnessScale({ tsb }: { tsb: number | null | undefined }) {
  const pos = freshnessScalePosition(tsb ?? 0);
  return (
    <div className="w-full">
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-red-400 via-amber-300 via-40% to-emerald-400">
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-900 bg-saffron-500 shadow-md dark:border-ink-50 dark:bg-saffron-400"
          style={{ left: `${pos * 100}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-ink-900/60 dark:text-ink-50/60">
        <span>Tired</span>
        <span>Steady</span>
        <span>Fresh</span>
      </div>
    </div>
  );
}
