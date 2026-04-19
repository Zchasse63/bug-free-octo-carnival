"use client";

import { useEffect, useState } from "react";
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

export function WeeklyVolumeChart({
  data,
  useMetric = true,
}: {
  data: Row[];
  useMetric?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No data.
      </div>
    );
  }
  if (!mounted) {
    return <div className="h-56 w-full" style={{ minHeight: 224 }} />;
  }
  const unitLabel = useMetric ? "km" : "mi";
  const chartData = data.map((d) => {
    const display = useMetric ? d.km : d.km * 0.621371;
    return {
      week: d.week,
      label: weekLabel(d.week),
      distance: Math.round(display * 10) / 10,
      load: Math.round(d.load),
    };
  });
  return (
    <div className="h-56 w-full" style={{ minHeight: 224, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
              return name === "distance"
                ? [`${v} ${unitLabel}`, "Distance"]
                : [String(v), "Load"];
            }}
          />
          <Bar dataKey="distance" fill="#C48A2A" opacity={0.85} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
