"use client";

import { useState } from "react";
import type { BuiltWorkout } from "@/lib/ai/workout-builder";

const EXAMPLES = [
  "6x1km at threshold with 90s jog between reps",
  "10 mile long run with the last 3 at marathon pace",
  "Fartlek: 8x 1 min hard / 1 min easy after a 20-min warm up",
  "45 min recovery run, super easy",
];

export function WorkoutBuilderForm() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<BuiltWorkout | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/workouts/build", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "build failed");
      setResult(json as BuiltWorkout);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="mb-6 rounded-xl border bg-card p-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Describe your workout
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
          placeholder="e.g. 4x1km at 5k pace with 2min jog between"
          className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setDescription(ex)}
              className="rounded-full border px-2 py-1 text-xs hover:bg-muted"
            >
              {ex}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={submitting || !description.trim()}
          className="mt-4 rounded-xl bg-saffron-500 px-5 py-3 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
        >
          {submitting ? "Building…" : "Build workout"}
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-lg font-semibold">{result.title}</h3>
            <span className="rounded-full bg-saffron-500/20 px-2 py-0.5 text-xs font-semibold uppercase text-saffron-700 dark:text-saffron-300">
              {result.workout_type.replace("_", " ")}
            </span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{result.description}</p>
          <div className="space-y-2">
            {result.structure.map((s, i) => (
              <div key={i} className="rounded-md border p-3 text-sm">
                <div className="font-medium">{s.step}</div>
                <div className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                  {s.reps && `${s.reps} × `}
                  {s.distance_m && `${s.distance_m}m`}
                  {s.duration_s &&
                    ` ${Math.floor(s.duration_s / 60)}:${String(s.duration_s % 60).padStart(2, "0")}`}
                  {s.pace && ` @ ${s.pace}`}
                  {s.recovery_s && ` · ${s.recovery_s}s recovery`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
