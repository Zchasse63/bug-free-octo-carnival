"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CONTAINER_PROPS = {
  className: "h-56 w-full" as const,
  style: { minWidth: 0 },
};

function monthLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function paceLabel(secPerKm: number, useMetric: boolean): string {
  const sec = useMetric ? secPerKm : secPerKm * 1.609344;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}${useMetric ? "/km" : "/mi"}`;
}

// -- Fitness curve ----------------------------------------------------------

export function FitnessCurveChart({
  data,
}: {
  data: { date: string; fitness: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        Not enough data yet.
      </div>
    );
  }
  const rows = data.map((d) => ({ label: monthLabel(d.date), fitness: d.fitness }));
  return (
    <div {...CONTAINER_PROPS}>
      <ResponsiveContainer width="100%" height={224} debounce={1}>
        <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fitnessGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C48A2A" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#C48A2A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            minTickGap={48}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="fitness"
            stroke="#C48A2A"
            strokeWidth={2}
            fill="url(#fitnessGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// -- Monthly volume bar chart ----------------------------------------------

export function MonthlyVolumeChart({
  data,
  useMetric,
}: {
  data: { month: string; distance_meters: number }[];
  useMetric: boolean;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No data.
      </div>
    );
  }
  const unitLabel = useMetric ? "km" : "mi";
  const rows = data.map((d) => {
    const km = d.distance_meters / 1000;
    const val = useMetric ? km : km * 0.621371;
    return { label: monthLabel(d.month), distance: Math.round(val * 10) / 10 };
  });
  return (
    <div {...CONTAINER_PROPS}>
      <ResponsiveContainer width="100%" height={224} debounce={1}>
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            minTickGap={32}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value) => [
              `${typeof value === "number" ? value : Number(value ?? 0)} ${unitLabel}`,
              "Distance",
            ]}
          />
          <Bar dataKey="distance" fill="#C48A2A" opacity={0.85} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// -- Pace progression (multi-line) ------------------------------------------

type PaceRow = {
  quarter: string;
  distance_name: string;
  best_pace_sec_per_km: number;
};

export function PaceProgressionChart({
  data,
  useMetric,
}: {
  data: PaceRow[];
  useMetric: boolean;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        Not enough best-effort data yet.
      </div>
    );
  }
  const quarters = Array.from(new Set(data.map((r) => r.quarter))).sort();
  const distances = Array.from(new Set(data.map((r) => r.distance_name)));
  const rows = quarters.map((q) => {
    const row: Record<string, number | string> = { label: q };
    for (const d of distances) {
      const r = data.find((x) => x.quarter === q && x.distance_name === d);
      if (r) {
        row[d] = useMetric
          ? r.best_pace_sec_per_km
          : Math.round(r.best_pace_sec_per_km * 1.609344);
      }
    }
    return row;
  });
  const colors: Record<string, string> = {
    "5k": "#C48A2A",
    "10k": "#EF4444",
    "Half Marathon": "#3B82F6",
  };
  return (
    <div {...CONTAINER_PROPS}>
      <ResponsiveContainer width="100%" height={224} debounce={1}>
        <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            minTickGap={32}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={44}
            reversed
            tickFormatter={(v) => paceLabel(v as number, useMetric)}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value, name) => [
              paceLabel(
                typeof value === "number" ? value : Number(value ?? 0),
                useMetric,
              ),
              String(name),
            ]}
          />
          {distances.map((d) => (
            <Line
              key={d}
              type="monotone"
              dataKey={d}
              stroke={colors[d] ?? "#888"}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {distances.map((d) => (
          <span key={d} className="flex items-center gap-1.5">
            <span
              className="h-0.5 w-4"
              style={{ background: colors[d] ?? "#888" }}
            />
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

// -- HR efficiency ----------------------------------------------------------

export function HrEfficiencyChart({
  data,
  useMetric,
}: {
  data: {
    month: string;
    avg_easy_hr: number | null;
    avg_easy_pace_sec_per_km: number | null;
  }[];
  useMetric: boolean;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        Not enough easy-pace data yet.
      </div>
    );
  }
  const rows = data.map((d) => ({
    label: monthLabel(d.month),
    hr: d.avg_easy_hr,
    pace: d.avg_easy_pace_sec_per_km,
  }));
  return (
    <div {...CONTAINER_PROPS}>
      <ResponsiveContainer width="100%" height={224} debounce={1}>
        <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
            minTickGap={32}
          />
          <YAxis
            yAxisId="hr"
            orientation="left"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={34}
            label={{
              value: "HR",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <YAxis
            yAxisId="pace"
            orientation="right"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={44}
            reversed
            tickFormatter={(v) => paceLabel(v as number, useMetric)}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value, name) => {
              if (name === "pace") {
                return [
                  paceLabel(
                    typeof value === "number" ? value : Number(value ?? 0),
                    useMetric,
                  ),
                  "Pace",
                ];
              }
              return [String(value ?? "—"), "HR"];
            }}
          />
          <Line
            yAxisId="hr"
            type="monotone"
            dataKey="hr"
            stroke="#EF4444"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="pace"
            type="monotone"
            dataKey="pace"
            stroke="#3B82F6"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-red-500" />
          Avg HR on easy runs
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 border-t-2 border-dashed border-blue-500" />
          Avg easy pace
        </span>
      </div>
    </div>
  );
}
