import { cn } from "@/lib/utils";

type Tone = "saffron" | "emerald" | "purple" | "rose" | "cyan" | "ink";

const toneBg: Record<Tone, string> = {
  saffron:
    "bg-[linear-gradient(140deg,#FDF2D4_0%,#F2D89C_45%,#C48A2A_100%)] dark:bg-[linear-gradient(140deg,#5E3C0D_0%,#4A2D09_50%,#2F1B05_100%)]",
  emerald:
    "bg-[linear-gradient(130deg,#E4F8ED_0%,#A8E0C3_45%,#4FA580_100%)] dark:bg-[linear-gradient(130deg,#0D4A32_0%,#0B3A27_50%,#07261A_100%)]",
  purple:
    "bg-[linear-gradient(135deg,#F4ECFD_0%,#D9C6F6_45%,#A487E0_100%)] dark:bg-[linear-gradient(135deg,#3E2A6B_0%,#2F1F55_50%,#1C113A_100%)]",
  rose:
    "bg-[linear-gradient(125deg,#FCE3ED_0%,#F3A8C1_45%,#CE5886_100%)] dark:bg-[linear-gradient(125deg,#5A1634_0%,#45112B_50%,#2C091C_100%)]",
  cyan:
    "bg-[linear-gradient(145deg,#E0F4F9_0%,#A2D9E4_45%,#459CB3_100%)] dark:bg-[linear-gradient(145deg,#0A4659_0%,#07384A_50%,#03202C_100%)]",
  ink: "bg-card",
};

export function GlowTile({
  tone = "saffron",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden rounded-[22px] p-[22px]",
        "shadow-[0_10px_30px_-10px_rgba(16,14,8,0.12),0_4px_12px_-4px_rgba(16,14,8,0.06),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_0_0_1px_rgba(255,255,255,0.1)]",
        "dark:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.55),0_6px_16px_-4px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.04)]",
        "transition-[transform,box-shadow] duration-[260ms] ease-emphasis",
        "hover:-translate-y-[3px] motion-reduce:transform-none",
        "before:pointer-events-none before:absolute before:-left-[20%] before:-top-[35%] before:z-0",
        "before:h-[80%] before:w-[80%] before:rounded-full",
        "before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_60%)]",
        "dark:before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]",
        "before:blur-[10px]",
        "after:pointer-events-none after:absolute after:top-0 after:-left-[150%] after:z-[2]",
        "after:h-full after:w-3/4 after:skew-x-[-20deg]",
        "after:bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.22)_50%,transparent_70%)]",
        "dark:after:bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.10)_50%,transparent_70%)]",
        "after:transition-[left] after:duration-[900ms] after:ease-emphasis",
        "hover:after:left-[150%] motion-reduce:hover:after:left-[-150%]",
        toneBg[tone],
        className,
      )}
    >
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

export function TileLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-900/70 dark:text-ink-50/80">
      {children}
    </div>
  );
}

export function BigNumber({
  value,
  unit,
  className,
}: {
  value: string | number;
  unit?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-2 mt-2", className)}>
      <span className="font-mono font-bold tabular-nums leading-[0.92] tracking-[-0.025em] text-5xl text-ink-900 dark:text-ink-50">
        {value}
      </span>
      {unit && (
        <span className="text-lg text-ink-900/60 dark:text-ink-50/60">{unit}</span>
      )}
    </div>
  );
}
