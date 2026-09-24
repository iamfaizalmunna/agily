import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampNoticeTake,
  isNoticeKind,
  isUnread,
  noticeCopy,
  noticeHref,
  recipientsExcept,
  unreadBadge,
  unreadCount,
} from "@/lib/notices/notices";

describe("phase 8 notices", () => {
  it("keeps kinds and drops the actor", () => {
    assert.equal(isNoticeKind("assigned"), true);
    assert.equal(isNoticeKind("note"), true);
    assert.equal(isNoticeKind("email"), false);
    assert.deepEqual(recipientsExcept(["a", "a", "b", ""], "a"), ["b"]);
    assert.deepEqual(recipientsExcept(["me"], "me"), []);
  });

  it("builds a focus href and copy", () => {
    assert.equal(
      noticeHref("north", "atlas", "item-1"),
      "/t/north/p/atlas?focus=item-1",
    );
    assert.deepEqual(noticeCopy("assigned", "Ada", "Ship lenses"), {
      title: "Ada assigned you",
      body: "Ship lenses",
    });
    assert.deepEqual(noticeCopy("note", "Lee", "Late review"), {
      title: "Lee left a note",
      body: "Late review",
    });
  });

  it("counts unread and clamps the list", () => {
    assert.equal(isUnread(null), true);
    assert.equal(isUnread(new Date()), false);
    assert.equal(
      unreadCount([{ readAt: null }, { readAt: new Date() }, { readAt: null }]),
      2,
    );
    assert.equal(unreadBadge(0), "");
    assert.equal(unreadBadge(3), "3");
    assert.equal(unreadBadge(12), "9+");
    assert.equal(clampNoticeTake(undefined), 20);
    assert.equal(clampNoticeTake(Number.NaN), 20);
    assert.equal(clampNoticeTake(0), 1);
    assert.equal(clampNoticeTake(80), 50);
  });
});
