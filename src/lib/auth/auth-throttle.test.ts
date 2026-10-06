import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import {
  authFailureDelay,
  authThrottleStatus,
  clearAuthThrottle,
  clearSignInThrottleKeys,
  formatAuthLockMessage,
  recordAuthFailure,
  recordSignInFailures,
  resetAuthThrottle,
  signInLockStatus,
  signInThrottleKeys,
} from "@/lib/auth/auth-throttle";

describe("auth/auth-throttle", () => {
  afterEach(() => {
    resetAuthThrottle();
  });

  it("locks after max failures", () => {
    const now = 1000;
    const key = signInThrottleKeys("a@b.com", "1.2.3.4")[0];
    for (let i = 0; i < 10; i++) recordAuthFailure(key, now);
    assert.equal(authThrottleStatus(key, now).locked, true);
    assert.ok(formatAuthLockMessage(90).includes("minute"));
  });

  it("locks when either email or IP bucket is full", () => {
    const now = 0;
    const ipKey = signInThrottleKeys("x@y.com", "9.9.9.9")[1]!;
    for (let i = 0; i < 10; i++) recordAuthFailure(ipKey, now);
    assert.equal(signInLockStatus("other@y.com", "9.9.9.9", now).locked, true);
  });

  it("clears buckets and formats fallback lock message", () => {
    const key = "email:z@z.com";
    recordAuthFailure(key, 1);
    clearAuthThrottle(key);
    assert.equal(authThrottleStatus(key, 1).locked, false);
    assert.ok(formatAuthLockMessage(0).includes("Wait"));
    assert.ok(formatAuthLockMessage(60).includes("1 minute"));
    assert.ok(formatAuthLockMessage(125).includes("minutes"));
    clearSignInThrottleKeys("z@z.com", "1.1.1.1");
    recordSignInFailures("z@z.com", "1.1.1.1", 2);
    assert.equal(signInThrottleKeys("a@b.com").length, 1);
  });

  it("waits on auth failure delay", async () => {
    const start = Date.now();
    await authFailureDelay();
    assert.ok(Date.now() - start >= 300);
  });

  it("resets window after AUTH_WINDOW_MS", () => {
    const now = 0;
    const key = signInThrottleKeys("w@z.com")[0];
    for (let i = 0; i < 10; i++) recordAuthFailure(key, now);
    assert.equal(
      authThrottleStatus(key, now + 15 * 60 * 1000 + 1).locked,
      false,
    );
  });
});
