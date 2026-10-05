import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { securityResponseHeaders } from "@/lib/security/headers";

describe("security/headers", () => {
  it("returns baseline hardening headers", () => {
    const headers = securityResponseHeaders({ NODE_ENV: "development" });
    assert.equal(headers["X-Frame-Options"], "DENY");
    assert.equal(headers["X-Content-Type-Options"], "nosniff");
    assert.match(headers["Referrer-Policy"], /origin/);
    assert.match(headers["Permissions-Policy"], /camera=\(\)/);
    assert.equal(headers["Cross-Origin-Opener-Policy"], "same-origin");
    assert.equal(headers["Cross-Origin-Resource-Policy"], "same-site");
    assert.match(
      headers["Content-Security-Policy-Report-Only"] ?? "",
      /default-src 'self'/,
    );
  });

  it("uses enforcing CSP in production", () => {
    const headers = securityResponseHeaders({ NODE_ENV: "production" });
    assert.match(headers["Content-Security-Policy"] ?? "", /script-src/);
    assert.equal(headers["Content-Security-Policy-Report-Only"], undefined);
  });
});
