"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TeamCreateForm({ athleteId }: { athleteId: number }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function createTeam(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/teams", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "create", name, description, athleteId }),
    });
    setSubmitting(false);
    setName("");
    setDescription("");
    router.refresh();
  }

  async function joinTeam(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/teams", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "join", invite_code: inviteCode, athleteId }),
    });
    setSubmitting(false);
    setInviteCode("");
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <form onSubmit={createTeam} className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">Create a team</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Team name"
          required
          className="mb-2 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description (optional)"
          className="mb-3 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
        >
          Create team
        </button>
      </form>
      <form onSubmit={joinTeam} className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">Join with invite code</h3>
        <input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="INVITE-CODE"
          className="mb-3 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={submitting || !inviteCode.trim()}
          className="rounded-md border px-4 py-2 text-sm font-semibold"
        >
          Join
        </button>
      </form>
    </div>
  );
}
