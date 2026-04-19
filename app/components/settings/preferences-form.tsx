"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

type Prefs = {
  measurement_preference: string;
};

export function PreferencesForm({ initial }: { initial: Prefs }) {
  const [fields, setFields] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  async function save(next: Partial<Prefs>) {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings/preferences", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="serif text-xl">Measurement system</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Used for distance, pace, temperature, wind, and elevation across every
          page and every AI tool.
        </p>
        <div className="mt-4 flex gap-2">
          {(
            [
              { value: "feet", label: "Imperial (mi, °F, ft)" },
              { value: "meters", label: "Metric (km, °C, m)" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFields({ ...fields, measurement_preference: opt.value });
                save({ measurement_preference: opt.value });
              }}
              className={`rounded-full border px-4 py-2 text-sm ${
                fields.measurement_preference === opt.value
                  ? "bg-saffron-500/20 border-saffron-500"
                  : "hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="serif text-xl">Theme</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Both modes are designed first-class. Pick whichever feels right for the time of day.
        </p>
        <div className="mt-4 flex gap-2">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`rounded-full border px-4 py-2 text-sm capitalize ${
                theme === t
                  ? "bg-saffron-500/20 border-saffron-500"
                  : "hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {saving && <p className="text-sm text-muted-foreground">Saving…</p>}
      {saved && <p className="text-sm text-emerald-500">Saved ✓</p>}
    </div>
  );
}
