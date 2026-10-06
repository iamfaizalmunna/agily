import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import {
  clearSignInFailures,
  isSignInLocked,
  recordSignInFailure,
  resetSignInThrottle,
  signInLockStatus,
} from "@/lib/auth/sign-in-throttle";
import { formatAuthLockMessage } from "@/lib/auth/auth-throttle";

describe("auth/sign-in-throttle", () => {
  afterEach(() => {
    resetSignInThrottle();
  });

  it("locks after repeated failures", () => {
    const now = 1_000_000;
    for (let i = 0; i < 10; i++) {
      recordSignInFailure("owner@agily.com", undefined, now);
    }
    assert.equal(isSignInLocked("owner@agily.com", undefined, now), true);
    clearSignInFailures("owner@agily.com");
    assert.equal(isSignInLocked("owner@agily.com", undefined, now), false);
  });

  it("surfaces retry-after when locked", () => {
    const now = 0;
    for (let i = 0; i < 10; i++) {
      recordSignInFailure("a@b.com", "1.1.1.1", now);
    }
    const status = signInLockStatus("a@b.com", "1.1.1.1", now);
    assert.equal(status.locked, true);
    assert.ok(status.retryAfterSeconds > 0);
    assert.ok(formatAuthLockMessage(status.retryAfterSeconds).length > 10);
  });

  it("wraps clear and record helpers", () => {
    recordSignInFailure("wrap@test.com", "8.8.8.8", 1);
    clearSignInFailures("wrap@test.com", "8.8.8.8");
    assert.equal(isSignInLocked("wrap@test.com", "8.8.8.8", 1), false);
  });

  it("resets the window after WINDOW_MS", () => {
    const start = 0;
    for (let i = 0; i < 10; i++) {
      recordSignInFailure("a@b.com", undefined, start);
    }
    assert.equal(isSignInLocked("a@b.com", undefined, start + 15 * 60 * 1000 + 1), false);
  });
});
