import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatStoryPoints,
  parseStoryPoints,
  storyPointTotals,
  storyPointsLabel,
} from "@/lib/items/story-points";

describe("story points", () => {
  it("parses empty as null", () => {
    assert.deepEqual(parseStoryPoints(""), { storyPoints: null });
    assert.deepEqual(parseStoryPoints(undefined), { storyPoints: null });
    assert.deepEqual(parseStoryPoints(null), { storyPoints: null });
  });

  it("parses integers", () => {
    assert.deepEqual(parseStoryPoints("5"), { storyPoints: 5 });
  });

  it("rejects invalid values", () => {
    assert.ok("error" in parseStoryPoints("1.5"));
    assert.ok("error" in parseStoryPoints("-1"));
    assert.ok("error" in parseStoryPoints("1000"));
    assert.ok("error" in parseStoryPoints(String(1000)));
  });

  it("sums scope and done points", () => {
    const totals = storyPointTotals([
      { status: "done", storyPoints: 3 },
      { status: "doing", storyPoints: 5 },
      { status: "backlog", storyPoints: null },
    ]);
    assert.equal(totals.scope, 8);
    assert.equal(totals.done, 3);
    assert.equal(totals.open, 5);
    assert.equal(totals.estimated, 2);
  });

  it("formats labels", () => {
    assert.equal(storyPointsLabel(1), "1 pt");
    assert.equal(storyPointsLabel(3), "3 pts");
    assert.equal(storyPointsLabel(null), "—");
  });

  it("formats values for inputs", () => {
    assert.equal(formatStoryPoints(5), "5");
    assert.equal(formatStoryPoints(null), "");
  });
});
