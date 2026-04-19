"use client";

import { useState } from "react";
import { StreamsChart } from "@/components/charts/streams-chart";

type StreamsInput = {
  time: number[];
  distance?: number[];
  heartrate?: number[];
  velocity?: number[];
  altitude?: number[];
  cadence?: number[];
};

const MODES = [
  { key: "hr", label: "Heart rate" },
  { key: "pace", label: "Pace" },
  { key: "elevation", label: "Elevation" },
  { key: "cadence", label: "Cadence" },
] as const;

export function ActivityStreamsPanel({
  streams,
  useMetric,
}: {
  streams: StreamsInput;
  useMetric: boolean;
}) {
  const [mode, setMode] = useState<(typeof MODES)[number]["key"]>("hr");
  const availability: Record<(typeof MODES)[number]["key"], boolean> = {
    hr: Boolean(streams.heartrate && streams.heartrate.length > 0),
    pace: Boolean(streams.velocity && streams.velocity.length > 0),
    elevation: Boolean(streams.altitude && streams.altitude.length > 0),
    cadence: Boolean(streams.cadence && streams.cadence.length > 0),
  };

  const visibleModes = MODES.filter((m) => availability[m.key]);
  if (visibleModes.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
        Stream data not synced for this activity yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {visibleModes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              mode === m.key
                ? "bg-saffron-500/20 border-saffron-500"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <StreamsChart streams={streams} mode={mode} useMetric={useMetric} />
    </div>
  );
}
