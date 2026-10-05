import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isValidSessionTokenFormat,
  mintSessionToken,
  SESSION_TOKEN_BYTES,
} from "@/lib/auth/session-token";

describe("auth/session-token", () => {
  it("mints hex session tokens", () => {
    const token = mintSessionToken();
    assert.equal(token.length, SESSION_TOKEN_BYTES * 2);
    assert.equal(isValidSessionTokenFormat(token), true);
    assert.equal(isValidSessionTokenFormat("short"), false);
    assert.equal(isValidSessionTokenFormat("g".repeat(64)), false);
  });
});
