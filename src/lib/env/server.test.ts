import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertServerEnv, validateServerEnv } from "@/lib/env/server";

describe("env/server", () => {
  it("requires DATABASE_URL and SESSION_SECRET in dev", () => {
    const issues = validateServerEnv({
      NODE_ENV: "development",
      DATABASE_URL: "file:./x.db",
    });
    assert.equal(issues.length, 1);
    assert.equal(issues[0]?.key, "SESSION_SECRET");
  });

  it("enforces long SESSION_SECRET in production", () => {
    const issues = validateServerEnv({
      NODE_ENV: "production",
      DATABASE_URL: "file:./x.db",
      SESSION_SECRET: "short",
    });
    assert.equal(issues.length, 1);
    assert.equal(issues[0]?.key, "SESSION_SECRET");
  });

  it("flags missing DATABASE_URL", () => {
    const issues = validateServerEnv({
      NODE_ENV: "development",
      SESSION_SECRET: "secret",
    });
    assert.equal(issues[0]?.key, "DATABASE_URL");
  });

  it("assertServerEnv throws with details", () => {
    assert.throws(
      () => assertServerEnv({ NODE_ENV: "development" }),
      /DATABASE_URL/,
    );
  });

  it("warns on long SESSION_DAYS in production", () => {
    const issues = validateServerEnv({
      NODE_ENV: "production",
      DATABASE_URL: "file:./x.db",
      SESSION_SECRET: "x".repeat(32),
      SESSION_DAYS: "120",
    });
    assert.equal(issues.some((row) => row.key === "SESSION_DAYS"), true);
  });

  it("rejects demo mode and placeholder secrets in production", () => {
    const demo = validateServerEnv({
      NODE_ENV: "production",
      DATABASE_URL: "file:./x.db",
      SESSION_SECRET: "x".repeat(32),
      NEXT_PUBLIC_DEMO_MODE: "true",
    });
    assert.equal(demo.some((row) => row.key === "DEMO_MODE"), true);
    const weak = validateServerEnv({
      NODE_ENV: "production",
      DATABASE_URL: "file:./x.db",
      SESSION_SECRET: "replace-with-a-long-random-string",
    });
    assert.equal(weak.some((row) => row.key === "SESSION_SECRET"), true);
  });

  it("passes when env is valid", () => {
    assert.deepEqual(
      validateServerEnv({
        NODE_ENV: "production",
        DATABASE_URL: "file:./x.db",
        SESSION_SECRET: "x".repeat(32),
      }),
      [],
    );
    assertServerEnv({
      NODE_ENV: "development",
      DATABASE_URL: "file:./x.db",
      SESSION_SECRET: "dev-secret",
    });
    assert.deepEqual(
      validateServerEnv({
        DATABASE_URL: "file:./x.db",
        SESSION_SECRET: "x".repeat(32),
      }),
      [],
    );
  });
});
