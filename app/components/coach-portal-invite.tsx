"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CoachPortalInvite({ coachId }: { coachId: number }) {
  const [athleteEmail, setAthleteEmail] = useState("");
  const [viewActivities, setViewActivities] = useState(true);
  const [viewNotes, setViewNotes] = useState(false);
  const [modifyPlan, setModifyPlan] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/coach-athletes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          coach_id: coachId,
          athlete_email: athleteEmail,
          permissions: {
            view_activities: viewActivities,
            view_notes: viewNotes,
            view_streams: viewActivities,
            modify_plan: modifyPlan,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "invite failed");
      setStatus(`Invited — ${json.status}`);
      setAthleteEmail("");
      router.refresh();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold">Invite an athlete</h3>
      <input
        value={athleteEmail}
        onChange={(e) => setAthleteEmail(e.target.value)}
        placeholder="athlete@email.com"
        required
        type="email"
        className="mb-4 w-full rounded-md border bg-background px-3 py-2 text-sm"
      />
      <div className="mb-4 space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={viewActivities}
            onChange={(e) => setViewActivities(e.target.checked)}
          />
          View activities
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={viewNotes}
            onChange={(e) => setViewNotes(e.target.checked)}
          />
          View private notes (opt-in)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={modifyPlan}
            onChange={(e) => setModifyPlan(e.target.checked)}
          />
          Modify training plan
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting || !athleteEmail.trim()}
        className="rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
      >
        {submitting ? "Inviting…" : "Send invite"}
      </button>
      {status && <div className="mt-3 text-sm">{status}</div>}
    </form>
  );
}
