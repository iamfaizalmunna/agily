import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultGroupSeed, DEFAULT_GROUP_NAMES } from "@/lib/items/defaults";

describe("phase 3 default groups", () => {
  it("seeds Now / Next / Later in order", () => {
    assert.deepEqual(DEFAULT_GROUP_NAMES, ["Now", "Next", "Later"]);
    assert.deepEqual(defaultGroupSeed(), [
      { name: "Now", position: 0 },
      { name: "Next", position: 1 },
      { name: "Later", position: 2 },
    ]);
  });
});
