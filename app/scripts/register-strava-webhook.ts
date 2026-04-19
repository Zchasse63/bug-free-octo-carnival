/**
 * Register / inspect / delete a Strava push-subscription via the public API.
 *
 *   list:     npx tsx scripts/register-strava-webhook.ts list
 *   create:   npx tsx scripts/register-strava-webhook.ts create <callback_url>
 *   delete:   npx tsx scripts/register-strava-webhook.ts delete <subscription_id>
 *
 * Callback URL must be publicly reachable and respond to Strava's GET
 * verification with { "hub.challenge": <challenge> }. That's what
 * /app/api/strava/webhook already does.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

const BASE = "https://www.strava.com/api/v3/push_subscriptions";

function creds() {
  const client_id = process.env.STRAVA_CLIENT_ID!;
  const client_secret = process.env.STRAVA_CLIENT_SECRET!;
  const verify_token = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN ?? "cadence-verify";
  if (!client_id || !client_secret) throw new Error("Missing Strava credentials");
  return { client_id, client_secret, verify_token };
}

async function list() {
  const { client_id, client_secret } = creds();
  const qs = new URLSearchParams({ client_id, client_secret });
  const res = await fetch(`${BASE}?${qs}`);
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

async function create(callback_url: string) {
  const { client_id, client_secret, verify_token } = creds();
  const body = new URLSearchParams({
    client_id,
    client_secret,
    callback_url,
    verify_token,
  });
  const res = await fetch(BASE, { method: "POST", body });
  const text = await res.text();
  console.log(res.status, text);
  if (!res.ok) process.exit(1);
}

async function del(id: string) {
  const { client_id, client_secret } = creds();
  const qs = new URLSearchParams({ client_id, client_secret });
  const res = await fetch(`${BASE}/${id}?${qs}`, { method: "DELETE" });
  console.log(res.status, await res.text());
}

async function main() {
  const action = process.argv[2];
  if (action === "list") return list();
  if (action === "create") return create(process.argv[3]);
  if (action === "delete") return del(process.argv[3]);
  console.log("usage: list | create <callback_url> | delete <id>");
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
