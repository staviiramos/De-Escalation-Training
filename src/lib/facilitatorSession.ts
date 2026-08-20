import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

export const FACILITATOR_COOKIE = "chcr_deescalation_facilitator_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) {
    throw new Error("SESSION_SECRET is not configured (see .env.example).");
  }
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Builds a signed, expiring session token: "<expiresAtMs>.<hmac>". */
export function createFacilitatorSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

/** Verifies the token's signature and expiry. */
export function verifyFacilitatorSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export const FACILITATOR_COOKIE_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
