"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StreamsInput = {
  time: number[];
  distance?: number[];
  heartrate?: number[];
  velocity?: number[];
  altitude?: number[];
  cadence?: number[];
};

function paceFromVelocity(ms: number): string {
  if (!ms || ms <= 0) return "";
  const secPerKm = 1000 / ms;
  return `${Math.floor(secPerKm / 60)}:${String(Math.round(secPerKm % 60)).padStart(2, "0")}/km`;
}

export function StreamsChart({
  streams,
  mode = "hr",
  useMetric,
}: {
  streams: StreamsInput;
  mode?: "hr" | "pace" | "elevation" | "cadence";
  useMetric: boolean;
}) {
  if (!streams.time || streams.time.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No stream data.
      </div>
    );
  }

  // Downsample to at most ~500 points for render
  const stride = Math.max(1, Math.floor(streams.time.length / 500));
  const data: Array<{
    t: number;
    km: number;
    hr?: number;
    pace?: number;
    alt?: number;
    cad?: number;
  }> = [];
  for (let i = 0; i < streams.time.length; i += stride) {
    const pt: (typeof data)[number] = {
      t: streams.time[i],
      km: streams.distance ? streams.distance[i] / 1000 : i / streams.time.length,
    };
    if (streams.heartrate) pt.hr = streams.heartrate[i];
    if (streams.velocity && streams.velocity[i] > 0)
      pt.pace = 1000 / streams.velocity[i];
    if (streams.altitude) pt.alt = streams.altitude[i];
    if (streams.cadence) pt.cad = streams.cadence[i] * 2;
    data.push(pt);
  }

  const specs: Record<
    "hr" | "pace" | "elevation" | "cadence",
    { key: "hr" | "pace" | "alt" | "cad"; color: string; label: string; unit: string; type: "line" | "area" }
  > = {
    hr: { key: "hr", color: "#EF4444", label: "Heart rate", unit: "bpm", type: "line" },
    pace: {
      key: "pace",
      color: "#3B82F6",
      label: "Pace",
      unit: useMetric ? "/km" : "/mi",
      type: "line",
    },
    elevation: { key: "alt", color: "#10B981", label: "Elevation", unit: "m", type: "area" },
    cadence: { key: "cad", color: "#A855F7", label: "Cadence", unit: "spm", type: "line" },
  };
  const spec = specs[mode];

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="km"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            type="number"
            domain={[0, "dataMax"]}
            tickFormatter={(v: number) => `${v.toFixed(1)}${useMetric ? "km" : ""}`}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={34}
            domain={mode === "pace" ? ["dataMin", "dataMax"] : [0, "auto"]}
            reversed={mode === "pace"}
            tickFormatter={(v: number) =>
              mode === "pace"
                ? `${Math.floor(v / 60)}:${String(Math.round(v % 60)).padStart(2, "0")}`
                : String(Math.round(v))
            }
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(value) => {
              const v = typeof value === "number" ? value : Number(value ?? 0);
              return mode === "pace"
                ? paceFromVelocity(1000 / v)
                : [`${Math.round(v)}${spec.unit}`, spec.label];
            }}
            labelFormatter={(label) => {
              const v = typeof label === "number" ? label : Number(label ?? 0);
              return `${v.toFixed(2)} km`;
            }}
          />
          {spec.type === "area" ? (
            <Area
              type="monotone"
              dataKey={spec.key}
              stroke={spec.color}
              fill={spec.color}
              fillOpacity={0.2}
              isAnimationActive={false}
            />
          ) : (
            <Line
              type="monotone"
              dataKey={spec.key}
              stroke={spec.color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
