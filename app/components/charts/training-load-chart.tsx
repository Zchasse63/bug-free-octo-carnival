"use client";

import type { DailySeriesPoint } from "@/lib/analytics/training-load";

export function TrainingLoadChart({ data }: { data: DailySeriesPoint[] }) {
  if (data.length < 2) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Not enough data yet.
      </div>
    );
  }
  const w = 600;
  const h = 200;
  const pad = { l: 32, r: 8, t: 8, b: 20 };
  const allY = data.flatMap((d) => [d.ctl, d.atl, d.tsb]);
  const minY = Math.min(...allY, 0);
  const maxY = Math.max(...allY, 1);
  const range = maxY - minY || 1;
  const xFor = (i: number) => pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r);
  const yFor = (v: number) =>
    pad.t + (1 - (v - minY) / range) * (h - pad.t - pad.b);

  const line = (key: "ctl" | "atl" | "tsb", stroke: string, dash?: string) => (
    <path
      d={data.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d[key])}`).join(" ")}
      fill="none"
      stroke={stroke}
      strokeWidth={1.75}
      strokeDasharray={dash}
      vectorEffect="non-scaling-stroke"
    />
  );

  const ticks = [0, Math.round(maxY / 2), Math.round(maxY)].filter(
    (v, i, a) => a.indexOf(v) === i,
  );

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full">
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.l}
              x2={w - pad.r}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
            <text
              x={pad.l - 4}
              y={yFor(t) + 3}
              fontSize={9}
              fill="hsl(var(--muted-foreground))"
              textAnchor="end"
              fontFamily="JetBrains Mono, monospace"
            >
              {t}
            </text>
          </g>
        ))}
        {/* Zero line for TSB */}
        <line
          x1={pad.l}
          x2={w - pad.r}
          y1={yFor(0)}
          y2={yFor(0)}
          stroke="hsl(var(--border))"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        {line("ctl", "#C48A2A")}
        {line("atl", "#EF4444", "3 3")}
        {line("tsb", "#3B82F6")}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-saffron-500" />
          CTL (fitness)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 border-t-2 border-dashed border-red-500" />
          ATL (fatigue)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-blue-500" />
          TSB (form)
        </span>
      </div>
    </div>
  );
}
