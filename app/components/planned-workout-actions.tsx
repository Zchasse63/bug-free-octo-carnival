"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PlannedWorkoutActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function setStatus(next: "completed" | "skipped" | "planned") {
    setBusy(true);
    await fetch(`/api/planned-workouts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  if (status === "completed") {
    return (
      <button
        onClick={() => setStatus("planned")}
        disabled={busy}
        className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-40"
        title="Mark as not done"
      >
        Undo
      </button>
    );
  }
  if (status === "skipped") {
    return (
      <button
        onClick={() => setStatus("planned")}
        disabled={busy}
        className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-40"
      >
        Restore
      </button>
    );
  }
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setStatus("completed")}
        disabled={busy}
        className="text-[10px] uppercase tracking-wider text-emerald-600 hover:underline disabled:opacity-40 dark:text-emerald-400"
      >
        Done
      </button>
      <button
        onClick={() => setStatus("skipped")}
        disabled={busy}
        className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-40"
      >
        Skip
      </button>
    </div>
  );
}
