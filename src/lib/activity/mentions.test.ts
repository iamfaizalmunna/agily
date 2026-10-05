import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mentionSuggestions,
  mentionTokens,
  parseMentionUserIds,
  type MentionMember,
} from "@/lib/activity/mentions";

const members: MentionMember[] = [
  { id: "o", name: "Owner", email: "owner@agily.com" },
  { id: "m", name: "Member", email: "member@agily.com" },
];

describe("revamp R5 mentions", () => {
  it("parses @handles for studio members", () => {
    assert.deepEqual(parseMentionUserIds("Hey @owner check this", members), ["o"]);
    assert.deepEqual(parseMentionUserIds("@Member and @owner", members), ["m", "o"]);
    assert.deepEqual(parseMentionUserIds("no mentions", members), []);
  });

  it("filters autocomplete suggestions", () => {
    assert.equal(mentionSuggestions(members, "mem").length, 1);
    assert.equal(mentionSuggestions(members, "")[0]?.id, "o");
    const noLocal = mentionTokens([
      { id: "x", name: "X", email: "@invalid" },
      { id: "y", name: "Y", email: "nodomain" },
    ]);
    assert.ok(noLocal.some((row) => row.token === "x"));
    assert.equal(
      mentionSuggestions(
        [{ id: "c", name: "Casey Jones", email: "casey@agily.com" }],
        "caseyjones",
      ).length,
      1,
    );
    assert.equal(
      mentionSuggestions(
        [{ id: "z", name: "Zed Zep", email: "other@agily.com" }],
        "zedzep",
      ).length,
      1,
    );
    assert.ok(
      mentionTokens([{ id: "e", name: "E", email: "" }]).some(
        (row) => row.token === "e",
      ),
    );
    assert.ok(
      mentionTokens([{ id: "a", name: "Ada", email: "ada@agily.com" }]).some(
        (row) => row.token === "ada",
      ),
    );
    assert.equal(
      mentionSuggestions(
        [{ id: "m", name: "Mo Jo", email: "other@agily.com" }],
        "mojo",
      ).length,
      1,
    );
  });
});
