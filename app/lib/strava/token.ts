import { createServiceClient } from "@/lib/supabase/service";
import type { StravaTokenResponse } from "@/lib/strava/types";

const STRAVA_OAUTH = "https://www.strava.com/api/v3/oauth/token";

export type AthleteTokens = {
  athleteId: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};

export async function loadTokens(athleteId: number): Promise<AthleteTokens> {
  const sb = createServiceClient();
  const { data, error } = await sb
    .from("athletes")
    .select("id, access_token, refresh_token, token_expires_at")
    .eq("id", athleteId)
    .single();
  if (error || !data) throw error ?? new Error("Athlete not found");
  return {
    athleteId: data.id,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(data.token_expires_at),
  };
}

export async function refreshTokens(athleteId: number): Promise<AthleteTokens> {
  const current = await loadTokens(athleteId);
  const body = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID!,
    client_secret: process.env.STRAVA_CLIENT_SECRET!,
    grant_type: "refresh_token",
    refresh_token: current.refreshToken,
  });
  const res = await fetch(STRAVA_OAUTH, { method: "POST", body });
  if (!res.ok) throw new Error(`Strava refresh failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as StravaTokenResponse;
  const expiresAt = new Date(json.expires_at * 1000);

  const sb = createServiceClient();
  const { error } = await sb
    .from("athletes")
    .update({
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      token_expires_at: expiresAt.toISOString(),
      token_status: "valid",
      updated_at: new Date().toISOString(),
    })
    .eq("id", athleteId);
  if (error) throw error;

  return {
    athleteId,
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    expiresAt,
  };
}

/** Returns a fresh access token, refreshing if expiry is <5 minutes away. */
export async function getValidAccessToken(athleteId: number): Promise<string> {
  const tokens = await loadTokens(athleteId);
  const fiveMinMs = 5 * 60 * 1000;
  if (tokens.expiresAt.getTime() - Date.now() < fiveMinMs) {
    const refreshed = await refreshTokens(athleteId);
    return refreshed.accessToken;
  }
  return tokens.accessToken;
}
