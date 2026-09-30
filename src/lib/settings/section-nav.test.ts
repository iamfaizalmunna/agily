import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveSettingsSection } from "./section-nav.js";

describe("resolveSettingsSection", () => {
  const ids = ["general", "labels", "templates"];

  it("uses default when hash empty", () => {
    assert.equal(resolveSettingsSection("", "general", ids), "general");
  });

  it("strips leading hash", () => {
    assert.equal(resolveSettingsSection("#labels", "general", ids), "labels");
  });

  it("falls back when unknown", () => {
    assert.equal(resolveSettingsSection("nope", "general", ids), "general");
  });
});
