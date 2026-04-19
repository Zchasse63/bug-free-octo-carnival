"use client";

import { useState } from "react";

type Analysis = {
  target_vdot: number;
  current_vdot: number | null;
  gap: number | null;
  weeks_to_race: number | null;
  required_vdot_per_week: number | null;
  assessment: "ahead" | "on_track" | "stretch" | "aggressive" | "unrealistic";
  recommended_paces: {
    easy: number;
    marathon: number;
    threshold: number;
    interval: number;
    repetition: number;
  } | null;
  note: string;
};

const DISTANCES = [
  { label: "5K", meters: 5000 },
  { label: "10K", meters: 10000 },
  { label: "Half", meters: 21097.5 },
  { label: "Marathon", meters: 42195 },
];

function paceFmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}/km`;
}

export function GoalAnalyzer() {
  const [distance, setDistance] = useState(21097.5);
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [raceDate, setRaceDate] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/goal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        target_distance_m: distance,
        target_time_s: totalSeconds,
        race_date: raceDate || undefined,
      }),
    });
    const json = await res.json();
    setResult(json as Analysis);
    setSubmitting(false);
  }

  const toneColor: Record<Analysis["assessment"], string> = {
    ahead: "text-emerald-500",
    on_track: "text-emerald-500",
    stretch: "text-amber-500",
    aggressive: "text-orange-500",
    unrealistic: "text-red-500",
  };

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

        <div className="mb-4 grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hours
            </label>
            <input
              type="number"
              min={0}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Min
            </label>
            <input
              type="number"
              min={0}
              max={59}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sec
            </label>
            <input
              type="number"
              min={0}
              max={59}
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Race date (optional)
          </label>
          <input
            type="date"
            value={raceDate}
            onChange={(e) => setRaceDate(e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || totalSeconds <= 0}
          className="rounded-xl bg-saffron-500 px-5 py-3 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
        >
          {submitting ? "Analyzing…" : "Analyze goal"}
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Assessment
                </div>
                <div
                  className={`mt-1 text-3xl font-semibold ${toneColor[result.assessment]}`}
                >
                  {result.assessment.replace("_", " ")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Target VDOT
                </div>
                <div className="mt-1 font-mono text-3xl font-bold tabular-nums">
                  {result.target_vdot.toFixed(1)}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{result.note}</p>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Current
                </div>
                <div className="font-mono font-semibold">
                  {result.current_vdot?.toFixed(1) ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Gap
                </div>
                <div className="font-mono font-semibold">
                  {result.gap !== null ? result.gap.toFixed(1) : "—"}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  /week needed
                </div>
                <div className="font-mono font-semibold">
                  {result.required_vdot_per_week ?? "—"}
                </div>
              </div>
            </div>
          </div>

          {result.recommended_paces && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="mb-3 text-sm font-semibold">
                Target paces at VDOT {result.target_vdot.toFixed(1)}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Easy
                  </div>
                  <div className="font-mono font-semibold">
                    {paceFmt(result.recommended_paces.easy)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Marathon
                  </div>
                  <div className="font-mono font-semibold">
                    {paceFmt(result.recommended_paces.marathon)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Threshold
                  </div>
                  <div className="font-mono font-semibold">
                    {paceFmt(result.recommended_paces.threshold)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Interval
                  </div>
                  <div className="font-mono font-semibold">
                    {paceFmt(result.recommended_paces.interval)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Rep
                  </div>
                  <div className="font-mono font-semibold">
                    {paceFmt(result.recommended_paces.repetition)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
