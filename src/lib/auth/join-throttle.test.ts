import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import {
  joinInviteLockStatus,
  recordJoinInviteFailure,
  resetJoinThrottle,
} from "@/lib/auth/join-throttle";

describe("auth/join-throttle", () => {
  afterEach(() => {
    resetJoinThrottle();
  });

  it("stays unlocked with no failures", () => {
    assert.equal(joinInviteLockStatus("1.1.1.1", "fresh-token", 0).locked, false);
  });

  it("tracks token-only keys when IP missing", () => {
    const now = 0;
    for (let i = 0; i < 10; i++) {
      recordJoinInviteFailure(null, "tok", now);
    }
    assert.equal(joinInviteLockStatus(null, "tok", now).locked, true);
  });

  it("locks repeated bad join attempts", () => {
    const now = 500;
    const token = "abc123token";
    for (let i = 0; i < 10; i++) {
      recordJoinInviteFailure("10.0.0.1", token, now);
    }
    assert.equal(joinInviteLockStatus("10.0.0.1", token, now).locked, true);
  });
});
