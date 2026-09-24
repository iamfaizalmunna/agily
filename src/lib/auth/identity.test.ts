import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isSessionFresh,
  normalizeEmail,
  SESSION_DAYS,
  sessionExpiry,
} from "@/lib/auth/identity";

describe("phase 1 identity", () => {
  it("normalizes email as a login key", () => {
    assert.equal(normalizeEmail("  Ada@Studio.LOCAL "), "ada@studio.local");
  });

  it("expires a session after SESSION_DAYS", () => {
    const from = new Date(2026, 0, 1, 12, 0, 0);
    const expires = sessionExpiry(from);
    assert.equal(expires.getTime(), new Date(2026, 0, 31, 12, 0, 0).getTime());
    assert.equal(SESSION_DAYS, 30);
  });

  it("accepts a custom day count", () => {
    const from = new Date(2026, 0, 1, 12, 0, 0);
    assert.equal(
      sessionExpiry(from, 1).getTime(),
      new Date(2026, 0, 2, 12, 0, 0).getTime(),
    );
  });

  it("treats equal timestamps as stale", () => {
    const now = new Date("2026-02-01T00:00:00.000Z");
    assert.equal(isSessionFresh(now, now), false);
    assert.equal(
      isSessionFresh(new Date("2026-02-01T00:00:01.000Z"), now),
      true,
    );
    assert.equal(typeof sessionExpiry().getTime(), "number");
    assert.equal(typeof isSessionFresh(new Date(Date.now() + 60_000)), "boolean");
  });
});
