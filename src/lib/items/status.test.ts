import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isItemStatus,
  ITEM_STATUSES,
  nextStatus,
  prevStatus,
  STATUS_LABEL,
} from "@/lib/items/status";

describe("phase 3 status", () => {
  it("keeps one status set for every view", () => {
    assert.deepEqual(ITEM_STATUSES, [
      "backlog",
      "ready",
      "doing",
      "review",
      "done",
    ]);
    assert.equal(STATUS_LABEL.doing, "Doing");
    assert.equal(isItemStatus("doing"), true);
    assert.equal(isItemStatus("todo"), false);
  });

  it("walks the column river without wrapping past done", () => {
    assert.equal(nextStatus("backlog"), "ready");
    assert.equal(nextStatus("done"), "done");
    assert.equal(prevStatus("ready"), "backlog");
    assert.equal(prevStatus("backlog"), "backlog");
  });
});
