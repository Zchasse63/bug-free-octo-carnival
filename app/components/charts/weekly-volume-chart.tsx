"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = { week: string; km: number; load: number };

function weekLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
}

export function WeeklyVolumeChart({ data }: { data: Row[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No data.
      </div>
    );
  }
  const chartData = data.map((d) => ({
    week: d.week,
    label: weekLabel(d.week),
    km: Math.round(d.km * 10) / 10,
    load: Math.round(d.load),
  }));
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
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
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
            formatter={(value, name) => {
              const v = typeof value === "number" ? value : Number(value ?? 0);
              return name === "km"
                ? [`${v} km`, "Distance"]
                : [String(v), "Load"];
            }}
          />
          <Bar dataKey="km" fill="#C48A2A" opacity={0.85} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
