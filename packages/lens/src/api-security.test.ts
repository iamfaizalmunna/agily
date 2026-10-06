import assert from "node:assert/strict";
import { describe, it, afterEach } from "node:test";
import {
  LENS_ASK_BODY_BYTES,
  LENS_ASK_MAX_PER_WINDOW,
  applyLensCors,
  clientIpFromRequest,
  isLensKbHttpEnabled,
  lensAskKeys,
  lensAskThrottleStatus,
  lensAskTimeoutMs,
  lensCorsAllowlist,
  publicLensHealthPayload,
  recordLensAsk,
  resetLensAskThrottle,
  safeKbBasename,
} from "./api-security";

describe("lens/api-security", () => {
  afterEach(() => {
    resetLensAskThrottle();
  });

  it("throttles burst lens asks", () => {
    const now = 1;
    const userId = "user-1";
    for (let i = 0; i < LENS_ASK_MAX_PER_WINDOW; i++) {
      recordLensAsk(userId, "9.9.9.9", now);
    }
    const status = lensAskThrottleStatus(userId, "9.9.9.9", now);
    assert.equal(status.throttled, true);
    assert.ok(status.retryAfterSeconds > 0);
  });

  it("resets throttle window", () => {
    const start = 0;
    const userId = "u2";
    for (let i = 0; i < LENS_ASK_MAX_PER_WINDOW; i++) {
      recordLensAsk(userId, null, start);
    }
    assert.equal(
      lensAskThrottleStatus(userId, null, start + 15 * 60 * 1000 + 1).throttled,
      false,
    );
  });

  it("blocks path traversal in KB names", () => {
    assert.equal(safeKbBasename("ok.md"), "ok.md");
    assert.equal(safeKbBasename("../secrets.md"), null);
    assert.equal(safeKbBasename("nested/evil.md"), "evil.md");
    assert.equal(safeKbBasename("readme.txt"), null);
    assert.equal(safeKbBasename(""), null);
    assert.equal(safeKbBasename("bad..name.md"), null);
  });

  it("disables KB HTTP in production by default", () => {
    assert.equal(isLensKbHttpEnabled({ NODE_ENV: "production" }), false);
    assert.equal(
      isLensKbHttpEnabled({ NODE_ENV: "production", LENS_KB_HTTP: "true" }),
      true,
    );
    assert.equal(isLensKbHttpEnabled({ NODE_ENV: "development" }), true);
    assert.equal(isLensKbHttpEnabled({}), true);
    assert.equal(
      isLensKbHttpEnabled({ NODE_ENV: "development", LENS_KB_HTTP: "false" }),
      false,
    );
  });

  it("sanitizes health payloads", () => {
    const prod = publicLensHealthPayload(
      { NODE_ENV: "production" },
      { ollama: true, model: "m", base: "http://127.0.0.1:11434" },
    );
    assert.equal("base" in prod, false);
    const dev = publicLensHealthPayload(
      { NODE_ENV: "development" },
      { ollama: true, model: "m", base: "http://127.0.0.1:11434" },
    );
    assert.equal(dev.base, "http://127.0.0.1:11434");
    const err = publicLensHealthPayload(
      { NODE_ENV: "production" },
      { ollama: false, model: "m", error: "leak" },
    );
    assert.equal(err.error, "Lens backend unavailable");
  });

  it("defaults CORS to deny", () => {
    assert.equal(applyLensCors("https://evil.com", []), null);
    assert.equal(applyLensCors(null, ["https://app.example"]), null);
    assert.equal(
      applyLensCors("https://app.example", ["https://app.example"]),
      "https://app.example",
    );
    assert.equal(
      applyLensCors("https://other", ["https://app.example"]),
      null,
    );
    assert.deepEqual(
      lensCorsAllowlist({ LENS_CORS_ORIGINS: " https://a.com , " }),
      ["https://a.com"],
    );
    assert.deepEqual(lensCorsAllowlist({}), []);
  });

  it("reads client IP headers", () => {
    assert.equal(
      clientIpFromRequest({
        get: (name) =>
          name === "x-forwarded-for" ? "1.2.3.4, 5.6.7.8" : null,
      }),
      "1.2.3.4",
    );
    assert.equal(
      clientIpFromRequest({
        get: (name) => (name === "x-real-ip" ? "9.9.9.9" : null),
      }),
      "9.9.9.9",
    );
    assert.equal(clientIpFromRequest({ get: () => null }), null);
  });

  it("exposes limits and keys", () => {
    assert.equal(LENS_ASK_BODY_BYTES, 32 * 1024);
    assert.equal(lensAskTimeoutMs(), 12_000);
    assert.equal(lensAskKeys("id")[0], "lens:user:id");
    assert.equal(lensAskThrottleStatus("fresh", "1.1.1.1").throttled, false);
  });
});
