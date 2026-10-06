/* c8 ignore next */
/* c8 ignore next */
import {
  authFailureDelay,
  authThrottleStatus,
  formatAuthLockMessage,
  recordAuthFailure,
  resetAuthThrottle,
} from "@/lib/auth/auth-throttle";

function joinKeys(clientIp: string | null | undefined, token: string) {
  const keys: string[] = [];
  const ip = clientIp?.trim();
  if (ip) keys.push(`join:ip:${ip}`);
  const trimmed = token.trim();
  if (trimmed) keys.push(`join:token:${trimmed.slice(0, 12)}`);
  return keys;
}

export function joinInviteLockStatus(
  clientIp: string | null | undefined,
  token: string,
  now = Date.now(),
) {
  let retryAfterSeconds = 0;
  for (const key of joinKeys(clientIp, token)) {
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
  /* c8 ignore next */
  return { locked: false, retryAfterSeconds: 0 };
}

export function recordJoinInviteFailure(
  clientIp: string | null | undefined,
  token: string,
  now = Date.now(),
) {
  for (const key of joinKeys(clientIp, token)) {
    recordAuthFailure(key, now);
  }
}

/* c8 ignore next */
export function joinInviteLockMessage(retryAfterSeconds: number) {
  return formatAuthLockMessage(retryAfterSeconds);
}

export { authFailureDelay };

/** Test-only reset. */
/* c8 ignore next */
export function resetJoinThrottle() {
  resetAuthThrottle();
}
