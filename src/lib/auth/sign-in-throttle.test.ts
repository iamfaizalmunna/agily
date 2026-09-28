import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import {
  clearSignInFailures,
  isSignInLocked,
  recordSignInFailure,
  resetSignInThrottle,
} from "@/lib/auth/sign-in-throttle";

describe("auth/sign-in-throttle", () => {
  afterEach(() => {
    resetSignInThrottle();
  });

  it("locks after repeated failures", () => {
    const now = 1_000_000;
    for (let i = 0; i < 10; i++) {
      recordSignInFailure("owner@agily.com", now);
    }
    assert.equal(isSignInLocked("owner@agily.com", now), true);
    clearSignInFailures("owner@agily.com");
    assert.equal(isSignInLocked("owner@agily.com", now), false);
  });

  it("resets the window after WINDOW_MS", () => {
    const start = 0;
    for (let i = 0; i < 10; i++) {
      recordSignInFailure("a@b.com", start);
    }
    assert.equal(isSignInLocked("a@b.com", start + 15 * 60 * 1000 + 1), false);
  });
});
