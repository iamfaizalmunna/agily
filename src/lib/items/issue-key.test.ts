import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatIssueKey, issueKeyPrefix } from "@/lib/items/issue-key";

describe("issue key", () => {
  it("builds a short project prefix", () => {
    assert.equal(issueKeyPrefix("atlas"), "ATL");
    assert.equal(issueKeyPrefix("mobile-app"), "MA");
    assert.equal(formatIssueKey("atlas", 0), "ATL-1");
    assert.equal(formatIssueKey("mobile-app", 4), "MA-5");
  });
});
