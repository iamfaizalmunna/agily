import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseQuickCreateType,
  quickCreateFocusHref,
} from "@/lib/create/quick-create";

describe("create/quick-create", () => {
  it("builds focus href after quick create", () => {
    const href = quickCreateFocusHref("northwind", "atlas", "item-1");
    assert.match(href, /\/t\/northwind\/p\/atlas/);
    assert.match(href, /focus=item-1/);
    assert.match(href, /view=list/);
  });

  it("parses issue type for quick create", () => {
    assert.equal(parseQuickCreateType("bug"), "bug");
    assert.equal(parseQuickCreateType(undefined), "task");
  });
});
