import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOriginFromHeaders,
  checkMutationOrigin,
  configuredAppHostname,
  hostnameFromHostHeader,
  requestHost,
  trustedHostnames,
} from "@/lib/security/origin";

const testEnv = process.env;

describe("security/origin", () => {
  it("parses host headers", () => {
    assert.equal(hostnameFromHostHeader("127.0.0.1:43123"), "127.0.0.1");
    assert.equal(hostnameFromHostHeader("LOCALHOST:3000"), "localhost");
    assert.equal(hostnameFromHostHeader("nocolon"), "nocolon");
    assert.equal(hostnameFromHostHeader("[broken"), "[broken");
    assert.equal(requestHost({ host: "127.0.0.1:43123" }), "127.0.0.1:43123");
    assert.equal(requestHost({ forwardedHost: "edge.host" }), "edge.host");
  });

  it("builds origin from forwarded headers", () => {
    assert.equal(
      buildOriginFromHeaders({
        forwardedHost: "app.example.com",
        forwardedProto: "https",
      }),
      "https://app.example.com",
    );
    assert.equal(buildOriginFromHeaders({}), "http://127.0.0.1:43123");
    assert.equal(
      buildOriginFromHeaders({ host: "h", forwardedProto: "" }),
      "http://h",
    );
  });

  it("includes dev hosts in trusted set", () => {
    assert.ok(trustedHostnames(testEnv).has("127.0.0.1"));
  });

  it("reads configured app hostname", () => {
    assert.equal(
      configuredAppHostname({ APP_URL: "https://agily.example.com" }),
      "agily.example.com",
    );
    assert.equal(
      configuredAppHostname({ VERCEL_URL: "agily.vercel.app" }),
      "agily.vercel.app",
    );
  });

  it("allows matching origin and host in dev", () => {
    const ok = checkMutationOrigin(
      {
        origin: "http://127.0.0.1:43123",
        host: "127.0.0.1:43123",
      },
      testEnv,
    );
    assert.equal(ok.ok, true);
  });

  it("allows localhost vs 127.0.0.1 in dev", () => {
    const ok = checkMutationOrigin(
      {
        origin: "http://localhost:43123",
        host: "127.0.0.1:43123",
      },
      testEnv,
    );
    assert.equal(ok.ok, true);
  });

  it("rejects cross-site origin", () => {
    const bad = checkMutationOrigin(
      {
        origin: "https://evil.example",
        host: "127.0.0.1:43123",
      },
      testEnv,
    );
    assert.equal(bad.ok, false);
  });

  it("allows production host from APP_URL", () => {
    const ok = checkMutationOrigin(
      {
        origin: "https://agily.example.com",
        host: "agily.example.com",
      },
      { APP_URL: "https://agily.example.com", NODE_ENV: "production" },
    );
    assert.equal(ok.ok, true);
  });

  it("rejects missing host and bad configured URL", () => {
    assert.equal(
      checkMutationOrigin({ origin: "https://a.com", host: "" }, testEnv).ok,
      false,
    );
    assert.equal(configuredAppHostname({ APP_URL: "not a url" }), null);
    assert.equal(hostnameFromHostHeader("[::1]:43123"), "::1");
    assert.equal(hostnameFromHostHeader(""), "");
    assert.equal(
      checkMutationOrigin({
        origin: "https://evil.com",
        host: "agily.example.com",
      }, { APP_URL: "https://agily.example.com" }).ok,
      false,
    );
  });

  it("allows trusted host without Origin header", () => {
    const ok = checkMutationOrigin({ host: "127.0.0.1:43123" }, testEnv);
    assert.equal(ok.ok, true);
  });

  it("rejects bad origin URL", () => {
    const bad = checkMutationOrigin(
      {
        origin: "not-a-valid-url",
        host: "127.0.0.1:43123",
      },
      testEnv,
    );
    assert.equal(bad.ok, false);
    if (!bad.ok) assert.equal(bad.reason, "bad origin");
  });

  it("allows both hostnames in trusted set", () => {
    const ok = checkMutationOrigin(
      {
        origin: "https://agily.example.com",
        host: "localhost:43123",
      },
      { APP_URL: "https://agily.example.com" },
    );
    assert.equal(ok.ok, true);
  });

  it("rejects untrusted host without Origin", () => {
    const bad = checkMutationOrigin({ host: "evil.example.com" }, testEnv);
    assert.equal(bad.ok, false);
    if (!bad.ok) assert.equal(bad.reason, "missing origin");
  });

  it("reports origin mismatch", () => {
    const bad = checkMutationOrigin(
      {
        origin: "https://a.example",
        host: "b.example:443",
      },
      testEnv,
    );
    assert.equal(bad.ok, false);
    if (!bad.ok) assert.equal(bad.reason, "origin mismatch");
  });

  it("handles optional origin input", () => {
    const ok = checkMutationOrigin(
      {
        origin: undefined,
        host: "localhost:43123",
      },
      testEnv,
    );
    assert.equal(ok.ok, true);
    assert.equal(
      checkMutationOrigin({ host: "127.0.0.1:43123" }, testEnv).ok,
      true,
    );
  });
});
