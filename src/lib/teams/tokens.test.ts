import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  inviteExpiry,
  newInviteToken,
  parseJoinToken,
  slugifyTeamName,
  uniqueSlug,
} from "@/lib/teams/tokens";

describe("phase 2 tokens", () => {
  it("slugifies names and falls back to studio", () => {
    assert.equal(slugifyTeamName("North Wind!"), "north-wind");
    assert.equal(slugifyTeamName("***"), "studio");
    assert.equal(slugifyTeamName("  "), "studio");
  });

  it("caps long names", () => {
    const slug = slugifyTeamName("a".repeat(80));
    assert.equal(slug.length, 40);
  });

  it("appends a hex suffix for uniqueness", () => {
    const slug = uniqueSlug("North");
    assert.match(slug, /^north-[0-9a-f]{6}$/);
  });

  it("mints a 36-char invite token", () => {
    assert.match(newInviteToken(), /^[0-9a-f]{36}$/);
  });

  it("pulls a token from a full join URL or a raw value", () => {
    assert.equal(parseJoinToken(""), "");
    assert.equal(parseJoinToken("  abc  "), "abc");
    assert.equal(
      parseJoinToken("http://127.0.0.1:43123/join/deadbeef"),
      "deadbeef",
    );
    assert.equal(parseJoinToken("http://127.0.0.1:43123/home"), "home");
    assert.equal(parseJoinToken("/join/cafe"), "cafe");
    assert.equal(parseJoinToken("http://127.0.0.1:43123/join/"), "join");
    assert.equal(parseJoinToken("not a url at all"), "not a url at all");
  });

  it("expires invites in fourteen days by default", () => {
    const now = Date.now();
    const expires = inviteExpiry();
    const days = (expires.getTime() - now) / 86400000;
    assert.ok(days > 13.9 && days < 14.1);
    const custom = inviteExpiry(2);
    assert.ok((custom.getTime() - now) / 86400000 > 1.9);
  });
});
