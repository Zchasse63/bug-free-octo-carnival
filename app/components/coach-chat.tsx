"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export function CoachChat({ firstname }: { firstname: string }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Hey ${firstname}. I've got your training history loaded. What's on your mind?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
          history: messages,
        }),
      });
      const json = (await res.json()) as { conversation_id: string; reply: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Coach error");
      setConversationId(json.conversation_id);
      setMessages((m) => [...m, { role: "assistant", content: json.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `I ran into an error: ${e instanceof Error ? e.message : String(e)}. Try again in a moment.`,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-3xl flex-col">
      <div
        className="flex-1 overflow-y-auto rounded-2xl border bg-[#EEE9DC] p-6 shadow-inner dark:bg-[#1A1612]"
        ref={scrollRef}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 31px, rgba(76,69,54,0.08) 31px, rgba(76,69,54,0.08) 32px)",
        }}
      >
        <div className="space-y-5 font-hand text-[17px] leading-[32px] text-ink-900 dark:text-ink-50">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : ""}>
              <div
                className={
                  m.role === "user"
                    ? "inline-block max-w-[80%] whitespace-pre-wrap rounded-2xl bg-saffron-500/20 px-4 py-2 text-left text-ink-900 dark:bg-saffron-400/20 dark:text-ink-50"
                    : "whitespace-pre-wrap"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="text-ink-900/50 dark:text-ink-50/50">…</div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={sending ? "Coach is thinking…" : "Ask your coach anything"}
          disabled={sending}
          className="flex-1 rounded-xl border bg-card px-4 py-3 text-sm outline-none ring-saffron-500/40 focus:ring-2"
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className="rounded-xl bg-saffron-500 px-4 py-3 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
