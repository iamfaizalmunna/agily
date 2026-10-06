import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSafeHttpUrl, parseSafeHttpUrl } from "@/lib/security/safe-url";

describe("security/safe-url", () => {
  it("allows http and https", () => {
    assert.equal(isSafeHttpUrl("https://example.com/x"), true);
    assert.deepEqual(parseSafeHttpUrl("http://a.b"), { url: "http://a.b" });
  });

  it("rejects empty and malformed URLs", () => {
    assert.equal(isSafeHttpUrl(""), false);
    assert.equal(isSafeHttpUrl("   "), false);
    assert.equal(isSafeHttpUrl("not-a-url"), false);
    assert.equal(isSafeHttpUrl("ftp://files.example"), false);
  });

  it("blocks javascript and data URLs", () => {
    assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);
    assert.equal(isSafeHttpUrl("data:text/html,hi"), false);
    assert.equal(parseSafeHttpUrl("vbscript:x").error, "Link must be http or https");
  });
});
