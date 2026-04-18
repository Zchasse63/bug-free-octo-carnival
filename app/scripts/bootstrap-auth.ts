/**
 * Bootstrap script — one-time.
 * Creates the primary Supabase Auth user and seeds the athletes row
 * for Strava athlete 56272355. Password generated strong and saved to
 * docs/bootstrap-secret.local.md (gitignored).
 *
 * Usage: npx tsx scripts/bootstrap-auth.ts
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });

const USER_EMAIL = "zchasse89@gmail.com";
const STRAVA_ATHLETE_ID = 56272355;

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Missing Supabase env vars");

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const strava = {
    accessToken: process.env.STRAVA_ACCESS_TOKEN!,
    refreshToken: process.env.STRAVA_REFRESH_TOKEN!,
    scope: "read,read_all,activity:read_all,activity:write,profile:read_all,profile:write",
  };

  // 1. Check if auth user already exists.
  const { data: existing, error: listErr } = await admin.auth.admin.listUsers();
  if (listErr) throw listErr;
  let authUser = existing.users.find((u) => u.email === USER_EMAIL);
  let password: string | null = null;

  if (!authUser) {
    password = randomBytes(24).toString("base64url");
    const { data, error } = await admin.auth.admin.createUser({
      email: USER_EMAIL,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    authUser = data.user!;
    console.log(`Created auth user ${authUser.id} for ${USER_EMAIL}`);

    const secretDir = resolve(process.cwd(), "..", "docs");
    if (!existsSync(secretDir)) mkdirSync(secretDir, { recursive: true });
    const secretPath = resolve(secretDir, "bootstrap-secret.local.md");
    writeFileSync(
      secretPath,
      `# Bootstrap Secret (gitignored)\n\nEmail: ${USER_EMAIL}\nPassword: ${password}\nAuth user UUID: ${authUser.id}\nGenerated: ${new Date().toISOString()}\n`,
      "utf8",
    );
    console.log(`Password written to ${secretPath}`);
  } else {
    console.log(`Auth user already exists: ${authUser.id}`);
  }

  // 2. Upsert athletes row linked to this auth user.
  const now = new Date().toISOString();
  const tokenExpiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();

  const { error: athleteErr } = await admin.from("athletes").upsert(
    {
      id: STRAVA_ATHLETE_ID,
      strava_id: STRAVA_ATHLETE_ID,
      auth_user_id: authUser.id,
      firstname: "Zach",
      lastname: "Chasse",
      role: "athlete",
      access_token: strava.accessToken,
      refresh_token: strava.refreshToken,
      token_expires_at: tokenExpiresAt,
      token_scope: strava.scope,
      token_status: "valid",
      created_at: now,
      updated_at: now,
    },
    { onConflict: "id" },
  );
  if (athleteErr) throw athleteErr;
  console.log(`Athletes row upserted for Strava ID ${STRAVA_ATHLETE_ID}`);

  // 3. Verify RLS helper returns the correct athlete_id under this auth context.
  // We can't easily impersonate here — just confirm the row is present.
  const { data: check, error: checkErr } = await admin
    .from("athletes")
    .select("id, auth_user_id, firstname")
    .eq("id", STRAVA_ATHLETE_ID)
    .maybeSingle();
  if (checkErr) throw checkErr;
  if (!check || check.auth_user_id !== authUser.id) {
    throw new Error("Athletes row not linked to auth user correctly");
  }
  console.log("Verified athlete ↔ auth_user_id link");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
