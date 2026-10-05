import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildActivityFeed } from "@/lib/activity/feed";

describe("revamp R5 activity feed", () => {
  it("merges events and comments newest first", () => {
    const feed = buildActivityFeed(
      [
        {
          id: "e1",
          kind: "status",
          fromValue: "backlog",
          toValue: "doing",
          createdAt: new Date("2026-09-28T10:00:00Z"),
          user: { name: "Ada" },
        },
      ],
      [
        {
          id: "c1",
          body: "Ship it",
          parentId: null,
          createdAt: new Date("2026-09-28T11:00:00Z"),
          user: { name: "Lee" },
        },
      ],
    );
    assert.equal(feed.length, 2);
    assert.equal(feed[0].kind, "comment");
    assert.match(feed[0].line, /Lee commented/);
  });

  it("includes reply rows", () => {
    const feed = buildActivityFeed(
      [],
      [
        {
          id: "r1",
          body: "Yep",
          parentId: "c1",
          createdAt: new Date("2026-09-28T12:00:00Z"),
          user: { name: "Ada" },
        },
      ],
    );
    assert.equal(feed[0].kind, "reply");
  });

  it("labels system events without an actor", () => {
    const feed = buildActivityFeed(
      [
        {
          id: "e2",
          kind: "status",
          fromValue: "backlog",
          toValue: "doing",
          createdAt: new Date("2026-09-28T09:00:00Z"),
          user: null,
        },
      ],
      [],
    );
    assert.equal(feed.length, 1);
    assert.match(feed[0].line, /^System /);
  });

  it("skips unknown event kinds", () => {
    const feed = buildActivityFeed(
      [
        {
          id: "bad",
          kind: "unknown",
          fromValue: null,
          toValue: null,
          createdAt: new Date(),
          user: null,
        },
      ],
      [],
    );
    assert.equal(feed.length, 0);
  });
});
