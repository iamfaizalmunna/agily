import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sessionCookieOptions } from "@/lib/auth/cookie-options";

describe("phase 1 cookie options", () => {
  const expires = new Date("2026-02-01T00:00:00.000Z");

  it("is httpOnly and lax in development", () => {
    const options = sessionCookieOptions(expires, "development");
    assert.equal(options.httpOnly, true);
    assert.equal(options.sameSite, "lax");
    assert.equal(options.path, "/");
    assert.equal(options.secure, false);
    assert.equal(options.expires, expires);
  });

  it("sets Secure only in production", () => {
    assert.equal(sessionCookieOptions(expires, "production").secure, true);
    assert.equal(typeof sessionCookieOptions(expires).secure, "boolean");
  });
});
