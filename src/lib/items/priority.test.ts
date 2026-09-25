import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_ITEM_PRIORITY,
  isItemPriority,
  parseItemPriority,
  PRIORITY_LABEL,
} from "@/lib/items/priority";

describe("item priority", () => {
  it("parses jira-like priority levels", () => {
    assert.equal(DEFAULT_ITEM_PRIORITY, "minor");
    assert.equal(isItemPriority("major"), true);
    assert.equal(isItemPriority("high"), false);
    assert.equal(parseItemPriority("critical"), "critical");
    assert.equal(parseItemPriority("nope"), "minor");
    assert.equal(PRIORITY_LABEL.critical, "Critical");
  });
});
