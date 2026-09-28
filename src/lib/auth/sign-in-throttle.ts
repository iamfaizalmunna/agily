import { normalizeEmail } from "@/lib/auth/identity";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

type Bucket = { failures: number; windowStart: number };

const buckets = new Map<string, Bucket>();

function bucketFor(email: string, now: number) {
  const key = normalizeEmail(email);
  let bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    bucket = { failures: 0, windowStart: now };
    buckets.set(key, bucket);
  }
  return bucket;
}

export function isSignInLocked(email: string, now = Date.now()) {
  const bucket = bucketFor(email, now);
  return bucket.failures >= MAX_FAILURES;
}

export function recordSignInFailure(email: string, now = Date.now()) {
  const bucket = bucketFor(email, now);
  bucket.failures += 1;
}

export function clearSignInFailures(email: string) {
  buckets.delete(normalizeEmail(email));
}

/** Test-only reset. */
export function resetSignInThrottle() {
  buckets.clear();
}
