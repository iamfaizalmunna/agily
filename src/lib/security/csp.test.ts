import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildContentSecurityPolicy,
  themeBootScriptSha256,
} from "@/lib/security/csp";

describe("security/csp", () => {
  it("hashes the theme boot script", () => {
    const hash = themeBootScriptSha256("console.log(1)");
    assert.match(hash, /^sha256-[A-Za-z0-9+/]+=*$/);
    assert.equal(themeBootScriptSha256("console.log(1)"), hash);
  });

  it("uses report-only CSP in development", () => {
    const { value, reportOnly } = buildContentSecurityPolicy({
      nodeEnv: "development",
    });
    assert.equal(reportOnly, true);
    assert.match(value, /script-src/);
    assert.match(value, /unsafe-eval/);
    assert.match(value, /frame-ancestors 'none'/);
  });

  it("enforces CSP in production", () => {
    const { reportOnly } = buildContentSecurityPolicy({
      nodeEnv: "production",
    });
    assert.equal(reportOnly, false);
  });

  it("enforces when SECURITY_CSP_ENFORCE is set in dev", () => {
    const prev = process.env.SECURITY_CSP_ENFORCE;
    process.env.SECURITY_CSP_ENFORCE = "true";
    try {
      const { reportOnly } = buildContentSecurityPolicy({
        nodeEnv: "development",
        enforce: true,
      });
      assert.equal(reportOnly, false);
    } finally {
      if (prev === undefined) delete process.env.SECURITY_CSP_ENFORCE;
      else process.env.SECURITY_CSP_ENFORCE = prev;
    }
  });
});
