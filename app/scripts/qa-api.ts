/**
 * QA test suite that hits the deployed API endpoints with real requests.
 * Fails loudly on non-2xx responses. No mocks.
 *
 * Usage: node ./node_modules/tsx/dist/cli.mjs scripts/qa-api.ts <base-url>
 */
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

const base = process.argv[2] ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type Result = { name: string; ok: boolean; ms: number; detail?: string };
const results: Result[] = [];

async function run(name: string, fn: () => Promise<void>) {
  const t0 = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - t0 });
    console.log(`  ✓ ${name} (${Date.now() - t0}ms)`);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    results.push({ name, ok: false, ms: Date.now() - t0, detail });
    console.log(`  ✗ ${name}: ${detail}`);
  }
}

async function expectJson(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${url} → ${text.slice(0, 200)}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`non-JSON response from ${url}: ${text.slice(0, 200)}`);
  }
}

async function expectHtml(path: string, mustContain: string) {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  const body = await res.text();
  if (!body.includes(mustContain))
    throw new Error(`${path} missing "${mustContain}"`);
}

async function main() {
  console.log(`\nQA against ${base}\n`);

  console.log("PAGES (server-rendered HTML)");
  await run("/dashboard", () => expectHtml("/dashboard", "Your training"));
  await run("/activities", () => expectHtml("/activities", "Activities"));
  await run("/plan", () => expectHtml("/plan", "Calendar"));
  await run("/plan/build", () => expectHtml("/plan/build", "Build workout"));
  await run("/plan/goal", () => expectHtml("/plan/goal", "Analyze goal"));
  await run("/plan/race-sim", () => expectHtml("/plan/race-sim", "Race day simulator"));
  await run("/insights", () => expectHtml("/insights", "Insights"));
  await run("/insights/community", () => expectHtml("/insights/community", "Community"));
  await run("/teams", () => expectHtml("/teams", "Teams"));
  await run("/teams/coach-portal", () =>
    expectHtml("/teams/coach-portal", "Coach portal"),
  );
  await run("/activities/routes", () => expectHtml("/activities/routes", "Routes"));
  await run("/coach", () => expectHtml("/coach", "got your training history"));
  await run("/breathing", () => expectHtml("/breathing", "Breathing coach"));
  await run("/onboarding", () => expectHtml("/onboarding", "Onboarding"));

  console.log("\nREDIRECTS");
  for (const [from, to] of [
    ["/workout-builder", "/plan/build"],
    ["/goal", "/plan/goal"],
    ["/race-sim", "/plan/race-sim"],
    ["/community", "/insights/community"],
    ["/coach-portal", "/teams/coach-portal"],
    ["/routes", "/activities/routes"],
    ["/tools", "/dashboard"],
  ] as const) {
    await run(`${from} → ${to}`, async () => {
      const res = await fetch(`${base}${from}`, { redirect: "manual" });
      if (res.status !== 307 && res.status !== 308)
        throw new Error(`expected redirect, got ${res.status}`);
      const loc = res.headers.get("location") ?? "";
      if (!loc.endsWith(to)) throw new Error(`→ ${loc}, expected ${to}`);
    });
  }

  console.log("\nAPI ROUTES");
  await run("GET /api/onboarding", async () => {
    const json = (await expectJson(`${base}/api/onboarding`)) as {
      questions: unknown[];
    };
    if (!Array.isArray(json.questions) || json.questions.length === 0)
      throw new Error("no questions returned");
  });

  await run("POST /api/coach (RAG + Claude)", async () => {
    const json = (await expectJson(`${base}/api/coach`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: "Give me a one-sentence read on my last week. Just one sentence.",
      }),
    })) as { reply: string };
    if (!json.reply || json.reply.length < 10)
      throw new Error(`short reply: ${json.reply?.slice(0, 80)}`);
  });

  await run("POST /api/race-sim", async () => {
    const json = (await expectJson(`${base}/api/race-sim`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ distance_m: 21097.5, temperature_c: 18, humidity_pct: 60 }),
    })) as { predicted_time_seconds: number };
    if (
      !json.predicted_time_seconds ||
      json.predicted_time_seconds < 3000 ||
      json.predicted_time_seconds > 15000
    )
      throw new Error(`unrealistic prediction ${json.predicted_time_seconds}s`);
  });

  await run("POST /api/goal", async () => {
    const json = (await expectJson(`${base}/api/goal`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ target_distance_m: 21097.5, target_time_s: 5400 }),
    })) as { target_vdot: number; assessment: string };
    if (!json.target_vdot) throw new Error("missing target_vdot");
    if (!json.assessment) throw new Error("missing assessment");
  });

  await run("POST /api/workouts/build", async () => {
    const json = (await expectJson(`${base}/api/workouts/build`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ description: "4x1km at threshold with 90s jog recovery" }),
    })) as { structure: unknown[] };
    if (!Array.isArray(json.structure) || json.structure.length === 0)
      throw new Error("missing structure");
  });

  await run("POST /api/activities/:id/notes", async () => {
    const json = (await expectJson(`${base}/api/activities/18159314938/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ raw_text: "QA probe note — ignore." }),
    })) as { note_id: string };
    if (!json.note_id) throw new Error("no note_id");
  });

  await run("POST /api/plans validation", async () => {
    const res = await fetch(`${base}/api/plans`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.status !== 400) throw new Error(`expected 400, got ${res.status}`);
  });

  await run("GET /api/strava/webhook verify", async () => {
    const res = await fetch(
      `${base}/api/strava/webhook?hub.mode=subscribe&hub.verify_token=cadence-verify&hub.challenge=abc`,
    );
    if (!res.ok) throw new Error(`${res.status}`);
    const json = (await res.json()) as { "hub.challenge": string };
    if (json["hub.challenge"] !== "abc") throw new Error("bad challenge");
  });

  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;
  console.log(`\n${passed}/${results.length} passed, ${failed} failed`);
  if (failed > 0) {
    console.log("\nFailures:");
    for (const r of results.filter((x) => !x.ok)) {
      console.log(`  ✗ ${r.name}: ${r.detail}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
