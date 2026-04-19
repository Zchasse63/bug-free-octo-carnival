"use client";

import { useState } from "react";
import { paceFromSecondsPerKm } from "@/lib/format";

type Result = {
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

const DISTANCES = [
  { label: "5K", meters: 5000 },
  { label: "10K", meters: 10000 },
  { label: "Half marathon", meters: 21097.5 },
  { label: "Marathon", meters: 42195 },
];

function fmt(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function fToC(f: number): number {
  return ((f - 32) * 5) / 9;
}

function ftToM(ft: number): number {
  return ft * 0.3048;
}

export function RaceSimForm({ useMetric = false }: { useMetric?: boolean }) {
  const [distance, setDistance] = useState(21097.5);
  // Inputs are displayed in the athlete's chosen unit. Backend expects
  // metric, so we convert at submit time.
  const [temp, setTemp] = useState<number | "">(useMetric ? 18 : 64);
  const [humidity, setHumidity] = useState<number | "">(60);
  const [elev, setElev] = useState<number | "">(useMetric ? 100 : 328);
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const temperature_c =
        temp === "" ? undefined : useMetric ? Number(temp) : fToC(Number(temp));
      const elevation_gain_m =
        elev === "" ? undefined : useMetric ? Number(elev) : ftToM(Number(elev));
      const res = await fetch("/api/race-sim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          distance_m: distance,
          temperature_c,
          humidity_pct: humidity === "" ? undefined : humidity,
          elevation_gain_m,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "sim failed");
      setResult(json as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  const tempLabel = useMetric ? "Temp (°C)" : "Temp (°F)";
  const elevLabel = useMetric ? "Elev gain (m)" : "Elev gain (ft)";
  const paceUnit = useMetric ? "metric" : "imperial";

  return (
    <div>
      <form onSubmit={submit} className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {DISTANCES.map((d) => (
            <button
              type="button"
              key={d.meters}
              onClick={() => setDistance(d.meters)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                Math.abs(distance - d.meters) < 1
                  ? "bg-saffron-500/20 border-saffron-500"
                  : "hover:bg-muted"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="race-sim-temp"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {tempLabel}
            </label>
            <input
              id="race-sim-temp"
              name="temperature"
              type="number"
              value={temp}
              onChange={(e) => setTemp(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="race-sim-humidity"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Humidity (%)
            </label>
            <input
              id="race-sim-humidity"
              name="humidity"
              type="number"
              value={humidity}
              onChange={(e) =>
                setHumidity(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="race-sim-elev"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {elevLabel}
            </label>
            <input
              id="race-sim-elev"
              name="elevation"
              type="number"
              value={elev}
              onChange={(e) => setElev(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-saffron-500 px-5 py-3 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
        >
          {submitting ? "Simulating…" : "Simulate race"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-xl border bg-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Realistic finish
          </div>
          <div className="mt-1 font-mono text-4xl font-bold tabular-nums">
            {fmt(result.predicted_time_seconds)}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Pace {paceFromSecondsPerKm(result.pace_seconds_per_km, paceUnit)}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Optimistic
              </div>
              <div className="font-mono text-lg tabular-nums">
                {fmt(result.confidence_range.optimistic_seconds)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Realistic
              </div>
              <div className="font-mono text-lg tabular-nums">
                {fmt(result.confidence_range.realistic_seconds)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Conservative
              </div>
              <div className="font-mono text-lg tabular-nums">
                {fmt(result.confidence_range.conservative_seconds)}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div>Heat: +{result.heat_adjustment_seconds_per_km}s/km</div>
            <div>Elev: +{result.elevation_adjustment_seconds_per_km}s/km</div>
            <div>Form: {result.form_adjustment_seconds_per_km}s/km</div>
          </div>
        </div>
      )}
    </div>
  );
}
