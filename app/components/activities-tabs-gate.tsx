"use client";

import { usePathname } from "next/navigation";
import { SectionTabs } from "@/components/section-tabs";

const TABS = [
  { href: "/activities", label: "All activities" },
  { href: "/activities/routes", label: "Routes" },
];

export function ActivitiesTabsGate() {
  const pathname = usePathname();
  // Hide tabs on deep activity detail — they have their own header.
  if (/^\/activities\/\d+/.test(pathname ?? "")) return null;
  return <SectionTabs tabs={TABS} />;
}
