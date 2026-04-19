"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  MessageCircle,
  List,
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Users,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const NAV: { href: string; label: string; icon: typeof MessageCircle }[] = [
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/activities", label: "Activities", icon: List },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/plan", label: "Plan", icon: CalendarDays },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/teams", label: "Teams", icon: Users },
];

export function AppShell({
  athleteName,
  athleteLocation,
  children,
}: {
  athleteName: string;
  athleteLocation?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-60 flex-col border-r bg-card md:flex lg:w-64">
        <div className="flex items-center justify-between border-b px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="hsl(var(--background))"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold">Cadence</span>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-black/[.03] dark:hover:bg-white/[.05]"
            aria-label="Toggle theme"
          >
            {mounted &&
              (theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              ))}
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                  active
                    ? "bg-saffron-500/12 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-black/[.03] dark:hover:bg-white/[.03]",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-saffron-500 dark:text-saffron-400" : "",
                  )}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              {athleteName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{athleteName}</div>
              {athleteLocation && (
                <div className="truncate text-xs text-muted-foreground">
                  {athleteLocation}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
