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

const KG_PER_LB = 0.45359237;

function kgToLbs(kg: number): number {
  return kg / KG_PER_LB;
}

function lbsToKg(lbs: number): number {
  return lbs * KG_PER_LB;
}

export function ProfileForm({
  initial,
  useMetric,
}: {
  initial: ProfileFields;
  useMetric: boolean;
}) {
  // UI shows whichever unit the athlete prefers; DB stores canonical kg.
  const [fields, setFields] = useState<ProfileFields>(initial);
  const [weightInput, setWeightInput] = useState<string>(
    initial.weight_kg == null
      ? ""
      : useMetric
        ? String(Math.round(initial.weight_kg * 10) / 10)
        : String(Math.round(kgToLbs(initial.weight_kg) * 10) / 10),
  );
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
      let weight_kg: number | null = null;
      if (weightInput.trim() !== "") {
        const parsed = Number(weightInput);
        if (!Number.isFinite(parsed)) throw new Error("weight must be a number");
        weight_kg = useMetric
          ? Math.round(parsed * 10) / 10
          : Math.round(lbsToKg(parsed) * 10) / 10;
      }
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...fields, weight_kg }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "save failed");
      setFields({ ...fields, weight_kg });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  const weightLabel = useMetric ? "Weight (kg)" : "Weight (lbs)";

  return (
    <form onSubmit={save} className="max-w-2xl space-y-6 rounded-xl border bg-card p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id="profile-firstname" label="First name">
          <input
            id="profile-firstname"
            name="firstname"
            value={fields.firstname}
            onChange={(e) => setFields({ ...fields, firstname: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field id="profile-lastname" label="Last name">
          <input
            id="profile-lastname"
            name="lastname"
            value={fields.lastname}
            onChange={(e) => setFields({ ...fields, lastname: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field id="profile-city" label="City">
          <input
            id="profile-city"
            name="city"
            value={fields.city}
            onChange={(e) => setFields({ ...fields, city: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field id="profile-state" label="State / Region">
          <input
            id="profile-state"
            name="state"
            value={fields.state}
            onChange={(e) => setFields({ ...fields, state: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field id="profile-weight" label={weightLabel}>
          <input
            id="profile-weight"
            name="weight"
            type="number"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
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
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
