"use client";

import { useState } from "react";

type Msg = {
  id: string;
  content: string;
  author_id: number;
  created_at: string | null;
  author_name: string;
};

export function TeamChat({
  teamId,
  athleteId,
  initialMessages,
}: {
  teamId: string;
  athleteId: number;
  initialMessages: Msg[];
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setText("");
    try {
      const res = await fetch("/api/teams/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ team_id: teamId, author_id: athleteId, content: body }),
      });
      const json = (await res.json()) as { message?: Msg; error?: string };
      if (json.message) setMessages((m) => [...m, json.message!]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div className="mb-4 max-h-[60vh] overflow-y-auto rounded-xl border bg-card p-4">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No messages yet — say hi to the team.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.author_id === athleteId ? "mb-3 text-right" : "mb-3"}
          >
            <div className="text-xs text-muted-foreground">
              {m.author_name}
              {m.created_at && ` · ${new Date(m.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`}
            </div>
            <div
              className={
                m.author_id === athleteId
                  ? "mt-1 inline-block max-w-[80%] rounded-xl bg-saffron-500/20 px-3 py-2 text-left text-sm"
                  : "mt-1 text-sm"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Post to the team"
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          className="rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
