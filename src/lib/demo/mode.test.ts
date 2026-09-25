import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  demoLoginsEnabled,
  demoLoginsEnabledClient,
  isExampleHost,
} from "@/lib/demo/mode";

describe("demo mode", () => {
  it("treats example.* hosts as public demos", () => {
    assert.equal(isExampleHost("example.zenflowai.com"), true);
    assert.equal(isExampleHost("example.agily.com"), true);
    assert.equal(isExampleHost("app.agily.com"), false);
    assert.equal(isExampleHost(""), false);
  });

  it("enables demo logins in dev, demo flag, or example host", () => {
    assert.equal(
      demoLoginsEnabled({ nodeEnv: "development", demoModeFlag: "false" }),
      true,
    );
    assert.equal(
      demoLoginsEnabled({ nodeEnv: "production", demoModeFlag: "true" }),
      true,
    );
    assert.equal(
      demoLoginsEnabled({
        nodeEnv: "production",
        hostname: "example.agily.com",
      }),
      true,
    );
    assert.equal(
      demoLoginsEnabled({
        nodeEnv: "production",
        demoModeFlag: "0",
        hostname: "agily.com",
      }),
      false,
    );
    assert.equal(
      demoLoginsEnabled({ nodeEnv: "production", demoModeFlag: "yes" }),
      true,
    );
    assert.equal(isExampleHost("example.agily.local"), true);
  });

  it("falls back on the server to development only", () => {
    assert.equal(
      demoLoginsEnabledClient(),
      process.env.NODE_ENV === "development",
    );
  });

  it("reads the browser hostname when provided", () => {
    assert.equal(demoLoginsEnabledClient("example.agily.com"), true);
    assert.equal(
      demoLoginsEnabledClient("app.agily.com"),
      process.env.NODE_ENV === "development",
    );
  });

  it("reads window.location when the browser global exists", () => {
    const priorWindow = (globalThis as { window?: unknown }).window;
    (globalThis as { window?: { location: { hostname: string } } }).window = {
      location: { hostname: "example.agily.com" },
    };
    assert.equal(demoLoginsEnabledClient(), true);
    if (priorWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window?: unknown }).window = priorWindow;
    }
  });
});
