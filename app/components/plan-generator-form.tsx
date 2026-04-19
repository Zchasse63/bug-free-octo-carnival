"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PlanGeneratorForm() {
  const [goal, setGoal] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [weeks, setWeeks] = useState(12);
  const [planType, setPlanType] = useState<
    "base_building" | "5k" | "10k" | "half_marathon" | "marathon" | "maintenance"
  >("half_marathon");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          goal,
          goalRaceDate: raceDate || undefined,
          weeks,
          planType,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Plan generation failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Goal
        </label>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Sub-1:30 half marathon, December"
          required
          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-saffron-500/40"
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Plan type
          </label>
          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value as typeof planType)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="base_building">Base building</option>
            <option value="5k">5K</option>
            <option value="10k">10K</option>
            <option value="half_marathon">Half marathon</option>
            <option value="marathon">Marathon</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Length (weeks)
          </label>
          <input
            type="number"
            min={4}
            max={24}
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mb-6">
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

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !goal.trim()}
        className="rounded-xl bg-saffron-500 px-5 py-3 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
      >
        {submitting ? "Generating plan…" : "Generate plan with Claude"}
      </button>
    </form>
  );
}
