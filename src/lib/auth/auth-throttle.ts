/* c8 ignore next */
import { normalizeEmail } from "@/lib/auth/identity";

export const AUTH_WINDOW_MS = 15 * 60 * 1000;
export const AUTH_MAX_FAILURES = 10;
export const AUTH_MIN_FAILURE_DELAY_MS = 350;

type Bucket = { failures: number; windowStart: number };

const buckets = new Map<string, Bucket>();

function bucketFor(key: string, now: number) {
  let bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > AUTH_WINDOW_MS) {
    bucket = { failures: 0, windowStart: now };
    buckets.set(key, bucket);
  }
  return bucket;
}

export type AuthThrottleStatus = {
  locked: boolean;
  retryAfterSeconds: number;
};

export function authThrottleStatus(
  key: string,
  now = Date.now(),
): AuthThrottleStatus {
  const bucket = bucketFor(key, now);
  const locked = bucket.failures >= AUTH_MAX_FAILURES;
  const retryAfterMs = locked
    ? Math.max(0, bucket.windowStart + AUTH_WINDOW_MS - now)
    : 0;
  return {
    locked,
    retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
  };
}

export function recordAuthFailure(key: string, now = Date.now()) {
  bucketFor(key, now).failures += 1;
}

export function clearAuthThrottle(key: string) {
  buckets.delete(key);
}

/** Test-only reset. */
/* c8 ignore next */
export function resetAuthThrottle() {
  buckets.clear();
}

export function signInThrottleKeys(email: string, clientIp?: string | null) {
  const keys = [`email:${normalizeEmail(email)}`];
  const ip = clientIp?.trim();
  if (ip) keys.push(`ip:${ip}`);
  return keys;
}

export function signInLockStatus(
  email: string,
  clientIp?: string | null,
  now = Date.now(),
): AuthThrottleStatus {
  let retryAfterSeconds = 0;
  for (const key of signInThrottleKeys(email, clientIp)) {
    const status = authThrottleStatus(key, now);
    if (status.locked) {
      return {
        locked: true,
        retryAfterSeconds: Math.max(
          retryAfterSeconds,
          status.retryAfterSeconds,
        ),
      };
    }
  }
  return { locked: false, retryAfterSeconds: 0 };
}

export function recordSignInFailures(
  email: string,
  clientIp?: string | null,
  now = Date.now(),
) {
  for (const key of signInThrottleKeys(email, clientIp)) {
    recordAuthFailure(key, now);
  }
}

export function clearSignInThrottleKeys(
  email: string,
  clientIp?: string | null,
) {
  for (const key of signInThrottleKeys(email, clientIp)) {
    clearAuthThrottle(key);
  }
}

export function formatAuthLockMessage(retryAfterSeconds: number) {
  if (retryAfterSeconds <= 0) {
    return "Too many attempts. Wait a few minutes and try again.";
  }
  if (retryAfterSeconds < 60) {
    return `Too many attempts. Try again in ${retryAfterSeconds} seconds.`;
  }
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `Too many attempts. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

/* c8 ignore start */
export async function authFailureDelay() {
  await new Promise((resolve) => {
    setTimeout(resolve, AUTH_MIN_FAILURE_DELAY_MS);
  });
}
/* c8 ignore stop */
