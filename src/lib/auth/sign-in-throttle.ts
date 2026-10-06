/* c8 ignore next */
import {
  clearSignInThrottleKeys,
  recordSignInFailures,
  resetAuthThrottle,
  signInLockStatus,
} from "@/lib/auth/auth-throttle";

export {
  formatAuthLockMessage,
  authFailureDelay,
  signInLockStatus,
  recordSignInFailures,
  clearSignInThrottleKeys,
} from "@/lib/auth/auth-throttle";

export function isSignInLocked(
  email: string,
  clientIp?: string | null,
  now = Date.now(),
) {
  return signInLockStatus(email, clientIp, now).locked;
}

export function recordSignInFailure(
  email: string,
  clientIp?: string | null,
  now = Date.now(),
) {
  recordSignInFailures(email, clientIp, now);
}

export function clearSignInFailures(email: string, clientIp?: string | null) {
  clearSignInThrottleKeys(email, clientIp);
}

/** Test-only reset. */
/* c8 ignore next */
export function resetSignInThrottle() {
  resetAuthThrottle();
}
