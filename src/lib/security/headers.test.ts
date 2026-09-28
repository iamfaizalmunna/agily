import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { securityResponseHeaders } from "@/lib/security/headers";

describe("security/headers", () => {
  it("returns baseline hardening headers", () => {
    const headers = securityResponseHeaders();
    assert.equal(headers["X-Frame-Options"], "DENY");
    assert.equal(headers["X-Content-Type-Options"], "nosniff");
    assert.match(headers["Referrer-Policy"], /origin/);
    assert.match(headers["Permissions-Policy"], /camera=\(\)/);
  });
});
