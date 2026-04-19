"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProfileFields = {
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  weight_kg: number | null;
};

export function ProfileForm({ initial }: { initial: ProfileFields }) {
  const [fields, setFields] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...fields,
          weight_kg: fields.weight_kg ? Number(fields.weight_kg) : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "save failed");
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-6 rounded-xl border bg-card p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="First name">
          <input
            value={fields.firstname}
            onChange={(e) => setFields({ ...fields, firstname: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Last name">
          <input
            value={fields.lastname}
            onChange={(e) => setFields({ ...fields, lastname: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="City">
          <input
            value={fields.city}
            onChange={(e) => setFields({ ...fields, city: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="State / Region">
          <input
            value={fields.state}
            onChange={(e) => setFields({ ...fields, state: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Weight (kg)">
          <input
            type="number"
            step="0.1"
            value={fields.weight_kg ?? ""}
            onChange={(e) =>
              setFields({
                ...fields,
                weight_kg: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </Field>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-saffron-500 px-5 py-2.5 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
        {saved && <span className="text-sm text-emerald-500">Saved ✓</span>}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
