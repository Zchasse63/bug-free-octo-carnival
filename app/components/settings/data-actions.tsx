"use client";

import { useState } from "react";

type ActionKey = "recompute-analytics" | "recompute-vdot" | "recompute-profile";

const ACTIONS: { key: ActionKey; label: string; description: string }[] = [
  {
    key: "recompute-analytics",
    label: "Recompute fitness & weekly totals",
    description:
      "Replays every activity to rebuild your Fitness / Fatigue / Freshness curves and the weekly rollup. Fast (<30s).",
  },
  {
    key: "recompute-vdot",
    label: "Recompute running score",
    description:
      "Re-evaluates your strongest performances from the last 180 days to update your Running score. Refreshes target paces across the app.",
  },
  {
    key: "recompute-profile",
    label: "Recompute response profile",
    description:
      "Re-derives your optimal quality-days-per-week and other learned patterns from the last 12 months.",
  },
];

export function DataActions() {
  const [running, setRunning] = useState<ActionKey | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function run(key: ActionKey) {
    setRunning(key);
    setResult(null);
    try {
      const res = await fetch(`/api/settings/data/${key}`, { method: "POST" });
      const json = await res.json();
      setResult(
        res.ok
          ? `${key}: ${JSON.stringify(json)}`
          : `${key} failed: ${json.error ?? res.status}`,
      );
    } catch (e) {
      setResult(
        `${key} failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    } finally {
      setRunning(null);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="serif text-xl">Maintenance</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Re-run the analytics pipelines. Safe to run any time — all operations
        are idempotent.
      </p>
      <div className="mt-4 space-y-3">
        {ACTIONS.map((a) => (
          <div
            key={a.key}
            className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <div className="text-sm font-medium">{a.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {a.description}
              </div>
            </div>
            <button
              onClick={() => run(a.key)}
              disabled={running !== null}
              className="shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40"
            >
              {running === a.key ? "Running…" : "Run"}
            </button>
          </div>
        ))}
      </div>
      {result && (
        <div className="mt-4 rounded-md border border-dashed bg-muted/40 p-3 font-mono text-xs">
          {result}
        </div>
      )}
    </div>
  );
}
