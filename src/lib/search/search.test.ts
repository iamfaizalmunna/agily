import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  matchesActionLabel,
  matchesTicketSearch,
  rankSearchHits,
  ticketIssueKey,
} from "@/lib/search/search";

const row = {
  id: "1",
  title: "Auth bug in login",
  projectSlug: "atlas",
  position: 4,
  labelNames: ["Bug", "Security"],
};

describe("revamp R8 search", () => {
  it("matches title, key, and labels", () => {
    assert.equal(matchesTicketSearch("auth", row), true);
    assert.equal(matchesTicketSearch("atl-5", row), true);
    assert.equal(matchesTicketSearch("security", row), true);
    assert.equal(matchesTicketSearch("zzz", row), false);
    assert.equal(ticketIssueKey(row), "ATL-5");
    const ranked = rankSearchHits("auth", [row, { ...row, id: "2", title: "Other" }]);
    assert.equal(ranked[0]?.id, "1");
    assert.equal(
      rankSearchHits("auth bug in login", [{ ...row, title: "Auth bug in login" }])[0]?.id,
      "1",
    );
    assert.equal(
      rankSearchHits("auth bu", [{ ...row, title: "Auth bug in login" }])[0]?.id,
      "1",
    );
    assert.equal(matchesActionLabel("pulse", "Go to Pulse"), true);
    assert.equal(matchesActionLabel("", "Go to Pulse"), true);
    assert.equal(rankSearchHits("login", [row])[0]?.id, "1");
    assert.equal(rankSearchHits("atl-5", [row])[0]?.id, "1");
    assert.equal(
      rankSearchHits("security", [{ ...row, title: "Unrelated", labelNames: ["Security"] }])[0]
        ?.title,
      "Unrelated",
    );
  });
});
