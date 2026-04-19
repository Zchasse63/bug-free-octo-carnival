"use client";

import { useEffect, useRef, useState } from "react";

type Protocol = {
  key: string;
  label: string;
  desc: string;
  pattern: { phase: "inhale" | "hold" | "exhale" | "holdOut"; seconds: number }[];
  cycles: number;
};

const PROTOCOLS: Protocol[] = [
  {
    key: "box",
    label: "Box breathing (4-4-4-4)",
    desc: "Used by special-forces for calm under pressure. 4 rounds.",
    pattern: [
      { phase: "inhale", seconds: 4 },
      { phase: "hold", seconds: 4 },
      { phase: "exhale", seconds: 4 },
      { phase: "holdOut", seconds: 4 },
    ],
    cycles: 4,
  },
  {
    key: "478",
    label: "4-7-8 (Weil method)",
    desc: "Pre-sleep wind-down. 4 rounds.",
    pattern: [
      { phase: "inhale", seconds: 4 },
      { phase: "hold", seconds: 7 },
      { phase: "exhale", seconds: 8 },
    ],
    cycles: 4,
  },
  {
    key: "prerace",
    label: "Pre-race calm-down (6-2-8)",
    desc: "Long exhale activates the parasympathetic response. 6 rounds.",
    pattern: [
      { phase: "inhale", seconds: 6 },
      { phase: "hold", seconds: 2 },
      { phase: "exhale", seconds: 8 },
    ],
    cycles: 6,
  },
];

const PHASE_LABEL: Record<Protocol["pattern"][number]["phase"], string> = {
  inhale: "Breathe in",
  hold: "Hold",
  exhale: "Breathe out",
  holdOut: "Hold",
};

export function BreathingCoach() {
  const [protocol, setProtocol] = useState<Protocol>(PROTOCOLS[0]);
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        const step = protocol.pattern[phaseIdx];
        if (e + 1 >= step.seconds) {
          const nextPhase = (phaseIdx + 1) % protocol.pattern.length;
          if (nextPhase === 0) {
            if (cycle + 1 >= protocol.cycles) {
              setRunning(false);
              return 0;
            }
            setCycle((c) => c + 1);
          }
          setPhaseIdx(nextPhase);
          return 0;
        }
        return e + 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, phaseIdx, cycle, protocol]);

  function start() {
    setPhaseIdx(0);
    setCycle(0);
    setElapsed(0);
    setRunning(true);
  }
  function stop() {
    setRunning(false);
    setPhaseIdx(0);
    setCycle(0);
    setElapsed(0);
  }

  const currentPhase = protocol.pattern[phaseIdx];
  const phaseLabel = PHASE_LABEL[currentPhase.phase];
  const remaining = currentPhase.seconds - elapsed;

  const scale =
    currentPhase.phase === "inhale"
      ? 0.5 + (elapsed / currentPhase.seconds) * 0.5
      : currentPhase.phase === "exhale"
        ? 1 - (elapsed / currentPhase.seconds) * 0.5
        : currentPhase.phase === "hold"
          ? 1
          : 0.5;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {PROTOCOLS.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setProtocol(p);
              stop();
            }}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              protocol.key === p.key
                ? "bg-saffron-500/20 border-saffron-500"
                : "hover:bg-muted"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{protocol.desc}</p>

      <div className="flex flex-col items-center gap-6 rounded-xl border bg-card p-10">
        <div
          className="flex h-48 w-48 items-center justify-center rounded-full bg-saffron-500/20 text-center transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        >
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {running ? phaseLabel : "Ready"}
            </div>
            <div className="mt-1 font-mono text-5xl font-bold tabular-nums">
              {running ? remaining : "—"}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {running
            ? `Cycle ${cycle + 1} of ${protocol.cycles}`
            : `${protocol.cycles} cycles total`}
        </div>
        <div className="flex gap-3">
          {!running ? (
            <button
              onClick={start}
              className="rounded-xl bg-saffron-500 px-6 py-3 text-sm font-semibold text-ink-900 dark:bg-saffron-400"
            >
              Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="rounded-xl border px-6 py-3 text-sm font-semibold"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
