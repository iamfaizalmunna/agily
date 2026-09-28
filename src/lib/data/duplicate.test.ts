import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { suggestDuplicateProjectName } from "./duplicate";

describe("data/duplicate", () => {
  it("suggests copy names", () => {
    assert.equal(suggestDuplicateProjectName("Atlas"), "Atlas (copy)");
    assert.equal(suggestDuplicateProjectName("Atlas (copy)"), "Atlas (copy 2)");
    assert.equal(suggestDuplicateProjectName("Atlas (copy 2)"), "Atlas (copy 3)");
  });
});
