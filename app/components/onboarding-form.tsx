"use client";

import { useState } from "react";
import type { OnboardingQuestion } from "@/lib/onboarding/questions";

export function OnboardingForm({
  questions,
  initial,
}: {
  questions: OnboardingQuestion[];
  initial: Record<string, string>;
}) {
  const [responses, setResponses] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ responses }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {questions.map((q) => (
        <div key={q.key} className="rounded-xl border bg-card p-5">
          <label className="block text-sm font-medium text-foreground">
            {q.prompt}
          </label>
          {q.response_type === "choice" && q.choices && (
            <div className="mt-3 flex flex-wrap gap-2">
              {q.choices.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setResponses((r) => ({ ...r, [q.key]: c }))}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    responses[q.key] === c
                      ? "bg-saffron-500/20 border-saffron-500 text-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          {q.response_type === "date" && (
            <input
              type="date"
              value={responses[q.key] ?? ""}
              onChange={(e) => setResponses((r) => ({ ...r, [q.key]: e.target.value }))}
              className="mt-3 rounded-md border bg-background px-3 py-2 text-sm"
            />
          )}
          {q.response_type === "number" && (
            <input
              type="number"
              value={responses[q.key] ?? ""}
              onChange={(e) => setResponses((r) => ({ ...r, [q.key]: e.target.value }))}
              className="mt-3 w-32 rounded-md border bg-background px-3 py-2 text-sm"
            />
          )}
          {q.response_type === "text" && (
            <textarea
              value={responses[q.key] ?? ""}
              onChange={(e) => setResponses((r) => ({ ...r, [q.key]: e.target.value }))}
              placeholder={q.placeholder}
              rows={3}
              className="mt-3 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-saffron-500 px-5 py-3 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
        >
          {saving ? "Saving…" : "Save answers"}
        </button>
        {saved && <span className="text-sm text-emerald-500">Saved ✓</span>}
      </div>
    </form>
  );
}
