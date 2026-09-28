import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isIssueType, ISSUE_TYPE_LABEL, parseIssueType } from "./issue-type";

describe("issue-type", () => {
  it("parses known types", () => {
    assert.equal(parseIssueType("epic"), "epic");
    assert.equal(parseIssueType("nope"), "task");
    assert.equal(ISSUE_TYPE_LABEL.story, "Story");
    assert.equal(parseIssueType("milestone"), "milestone");
    assert.equal(isIssueType("bug"), true);
    assert.equal(isIssueType("idea"), false);
  });
});
