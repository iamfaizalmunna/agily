import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mentionSuggestions,
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
  });
});
