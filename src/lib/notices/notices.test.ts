import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampNoticeTake,
  isNoticeKind,
  isUnread,
  noticeCopy,
  noticeHref,
  recipientsExcept,
  teamMemberUserIds,
  unreadBadge,
  unreadCount,
} from "@/lib/notices/notices";

describe("phase 8 notices", () => {
  it("keeps kinds and drops the actor", () => {
    assert.equal(isNoticeKind("assigned"), true);
    assert.equal(isNoticeKind("note"), true);
    assert.equal(isNoticeKind("mention"), true);
    assert.equal(isNoticeKind("reply"), true);
    assert.equal(isNoticeKind("status_changed"), true);
    assert.equal(isNoticeKind("ticket_created"), true);
    assert.equal(isNoticeKind("email"), false);
    assert.deepEqual(
      teamMemberUserIds([{ userId: "u1" }, { userId: "u2" }]),
      ["u1", "u2"],
    );
    assert.equal(isNoticeKind(null), false);
    assert.equal(isNoticeKind(undefined), false);
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
    assert.deepEqual(noticeCopy("mention", "Ada", "Ticket", "Please review"), {
      title: "Ada mentioned you",
      body: "Please review",
    });
    assert.deepEqual(noticeCopy("reply", "Lee", "Ticket", "Thanks"), {
      title: "Lee replied to your comment",
      body: "Thanks",
    });
    assert.deepEqual(noticeCopy("mention", "Ada", "Ticket"), {
      title: "Ada mentioned you",
      body: "Ticket",
    });
    assert.deepEqual(noticeCopy("reply", "Lee", "Ticket", "  "), {
      title: "Lee replied to your comment",
      body: "Ticket",
    });
    assert.deepEqual(
      noticeCopy("status_changed", "Ada", "Fix login", "In progress"),
      {
        title: "Ada updated the board",
        body: "Fix login — In progress",
      },
    );
    assert.deepEqual(noticeCopy("ticket_created", "Lee", "New task", "Atlas"), {
      title: "Lee added a ticket",
      body: "New task on Atlas",
    });
    assert.deepEqual(noticeCopy("status_changed", "Ada", "Fix login"), {
      title: "Ada updated the board",
      body: "Fix login",
    });
    assert.deepEqual(noticeCopy("ticket_created", "Lee", "New task"), {
      title: "Lee added a ticket",
      body: "New task",
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
