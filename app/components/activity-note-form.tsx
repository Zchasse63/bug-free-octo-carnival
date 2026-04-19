"use client";

import { useState, useRef } from "react";

// Web Speech API typing for browsers that expose it
type SR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { resultIndex: number; results: { isFinal: boolean; [k: number]: { transcript: string } }[] }) => void) | null;
  onend: (() => void) | null;
};

export function ActivityNoteForm({ activityId }: { activityId: number }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<SR | null>(null);

  function toggleVoice() {
    const SR = (
      window as unknown as {
        webkitSpeechRecognition?: new () => SR;
        SpeechRecognition?: new () => SR;
      }
    );
    const Ctor = SR.webkitSpeechRecognition ?? SR.SpeechRecognition;
    if (!Ctor) {
      alert("Voice input not supported in this browser.");
      return;
    }
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }
    const recog = new Ctor();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";
    let finalText = "";
    recog.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interim += res[0].transcript;
      }
      setText((text + " " + finalText + interim).trim());
    };
    recog.onend = () => setRecording(false);
    recognitionRef.current = recog;
    recog.start();
    setRecording(true);
  }

  async function save() {
    const body = text.trim();
    if (!body || saving) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/activities/${activityId}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ raw_text: body, input_method: recording ? "voice" : "text" }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setText("");
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        How did this run feel?
      </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Legs heavy from yesterday's tempo, ran in the Vaporflys, hot and humid, last two miles hurt…"
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={save}
          disabled={saving || !text.trim()}
          className="rounded-md bg-saffron-500 px-4 py-2 text-sm font-semibold text-ink-900 disabled:opacity-40 dark:bg-saffron-400"
        >
          {saving ? "Saving…" : "Save note"}
        </button>
        <button
          onClick={toggleVoice}
          type="button"
          className={`rounded-md border px-3 py-2 text-sm ${recording ? "bg-red-500/20 border-red-500" : ""}`}
        >
          {recording ? "Stop recording" : "🎤 Voice"}
        </button>
        {saved && <span className="text-sm text-emerald-500">Saved ✓</span>}
      </div>
    </div>
  );
}
