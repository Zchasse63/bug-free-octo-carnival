import type { NextConfig } from "next";

const LEGACY_REDIRECTS: { source: string; destination: string }[] = [
  { source: "/goal", destination: "/plan/goal" },
  { source: "/community", destination: "/insights/community" },
  { source: "/coach-portal", destination: "/teams/coach-portal" },
  { source: "/routes", destination: "/activities/routes" },
  { source: "/tools", destination: "/dashboard" },
  { source: "/race-sim", destination: "/plan/race-sim" },
  { source: "/workout-builder", destination: "/plan/build" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // typedRoutes disabled until all routes exist; re-enable in Phase 2.
  // typedRoutes: true,
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
