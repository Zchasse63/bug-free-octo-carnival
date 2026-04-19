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
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UserMenu } from "@/components/user-menu";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const sidebarBody = (
    <>
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
        <UserMenu
          athleteName={athleteName}
          athleteLocation={athleteLocation}
        />
      </div>
    </>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
      <header className="flex items-center justify-between border-b bg-card px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-black/[.04] dark:hover:bg-white/[.05]"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="hsl(var(--background))"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <span className="text-sm font-semibold">Cadence</span>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-black/[.04] dark:hover:bg-white/[.05]"
        >
          {mounted &&
            (theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            ))}
        </button>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            id="mobile-nav-drawer"
            className="absolute inset-y-0 left-0 flex w-[80vw] max-w-xs flex-col border-r bg-card shadow-xl"
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-black/[.05] dark:hover:bg-white/[.05]"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebarBody}
          </aside>
        </div>
      )}

      <aside className="hidden w-60 flex-col border-r bg-card md:flex lg:w-64">
        {sidebarBody}
      </aside>

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
