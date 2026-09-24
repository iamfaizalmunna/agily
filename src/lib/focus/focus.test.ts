import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatCommentAt,
  noteLabel,
  parseCommentBody,
  parseFocusId,
  withFocus,
} from "@/lib/focus/focus";

describe("phase 7 focus", () => {
  it("parses a focus id and keeps other query chips", () => {
    assert.equal(parseFocusId("  item-1  "), "item-1");
    assert.equal(parseFocusId(""), null);
    assert.equal(parseFocusId(undefined), null);
    assert.equal(parseFocusId("x".repeat(41)), null);
    assert.deepEqual(withFocus({ q: "mine", focus: "old" }, "new"), {
      q: "mine",
      focus: "new",
    });
    assert.deepEqual(withFocus({ q: "mine", empty: "" }, null), { q: "mine" });
    assert.deepEqual(withFocus(undefined, "a"), { focus: "a" });
  });

  it("requires a short note", () => {
    assert.deepEqual(parseCommentBody("  Ship it  "), { body: "Ship it" });
    assert.equal(parseCommentBody("").error, "Write a note");
    assert.equal(parseCommentBody("x".repeat(2001)).error, "Note is too long");
  });

  it("labels notes and formats UTC time", () => {
    assert.equal(noteLabel(0), "Open");
    assert.equal(noteLabel(1), "1 note");
    assert.equal(noteLabel(3), "3 notes");
    assert.equal(
      formatCommentAt(new Date("2026-09-24T15:04:00.000Z")),
      "2026-09-24 15:04",
    );
  });
});
