"use client";

type Row = { week: string; km: number; load: number };

export function WeeklyVolumeChart({ data }: { data: Row[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No data.
      </div>
    );
  }
  const w = 600;
  const h = 200;
  const pad = { l: 32, r: 8, t: 8, b: 28 };
  const max = Math.max(...data.map((d) => d.km), 1);
  const barW = (w - pad.l - pad.r) / data.length - 4;
  const scaleY = (v: number) =>
    h - pad.b - ((v / max) * (h - pad.t - pad.b));

  const ticks = [0, Math.round(max / 2), Math.round(max)];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full">
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.l}
              x2={w - pad.r}
              y1={scaleY(t)}
              y2={scaleY(t)}
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
            <text
              x={pad.l - 4}
              y={scaleY(t) + 3}
              fontSize={9}
              fill="hsl(var(--muted-foreground))"
              textAnchor="end"
              fontFamily="JetBrains Mono, monospace"
            >
              {t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.l + i * ((w - pad.l - pad.r) / data.length) + 2;
          const y = scaleY(d.km);
          const barH = h - pad.b - y;
          const label = new Date(d.week).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
          });
          return (
            <g key={d.week}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={3}
                fill="#C48A2A"
                opacity={0.85}
              />
              <text
                x={x + barW / 2}
                y={h - pad.b + 14}
                fontSize={9}
                fill="hsl(var(--muted-foreground))"
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
