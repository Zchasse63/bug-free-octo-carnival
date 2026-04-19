import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dashed border-border bg-card/40 p-8 md:p-10 ${className ?? ""}`}
    >
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 text-saffron-500/15 dark:text-saffron-400/15"
        viewBox="0 0 160 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx="80" cy="80" r={15 + i * 9} />
        ))}
      </svg>

      <div className="relative flex max-w-md flex-col gap-3">
        {Icon && (
          <Icon className="h-7 w-7 text-saffron-500 dark:text-saffron-400" />
        )}
        <h3 className="font-serif text-2xl text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        {action && (
          <Link
            href={action.href}
            className="mt-1 inline-flex w-fit items-center rounded-full border border-saffron-500/60 bg-saffron-500/10 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-saffron-500/20 dark:border-saffron-400/60"
          >
            {action.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
