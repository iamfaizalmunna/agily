import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  boardViewFromDigit,
  isTypingTarget,
  nextChordBuffer,
  normalizeKey,
  resolveKeyboardChord,
} from "@/lib/chrome/keyboard";

describe("phase 10 keyboard", () => {
  it("ignores non-elements and normalizes keys", () => {
    assert.equal(isTypingTarget(null), false);
    assert.equal(isTypingTarget({} as EventTarget), false);
    assert.equal(
      isTypingTarget({ tagName: "INPUT" } as EventTarget),
      true,
    );
    assert.equal(
      isTypingTarget({ tagName: "DIV", isContentEditable: true } as EventTarget),
      true,
    );
    assert.equal(normalizeKey({ key: "P", metaKey: false, ctrlKey: false, altKey: false }), "p");
    assert.equal(normalizeKey({ key: "?", metaKey: false, ctrlKey: false, altKey: false, shiftKey: true }), "?");
    assert.equal(normalizeKey({ key: "/", metaKey: false, ctrlKey: false, altKey: false, shiftKey: true }), "?");
    assert.equal(normalizeKey({ key: "p", metaKey: true, ctrlKey: false, altKey: false }), "");
  });

  it("maps digits to board views", () => {
    assert.equal(boardViewFromDigit("1"), "ledger");
    assert.equal(boardViewFromDigit("2"), "flow");
    assert.equal(boardViewFromDigit("3"), "orbit");
    assert.equal(boardViewFromDigit("4"), null);
  });

  it("builds two-key chords", () => {
    assert.equal(nextChordBuffer("", "g"), "g");
    assert.equal(nextChordBuffer("g", "p"), "g p");
    assert.equal(nextChordBuffer("g p", "x"), "p x");
  });

  it("resolves studio shortcuts", () => {
    assert.deepEqual(resolveKeyboardChord("?", {}), { type: "show-help" });
    assert.deepEqual(resolveKeyboardChord("/", {}), { type: "toggle-lens" });
    assert.deepEqual(resolveKeyboardChord("g h", {}), { type: "go-home" });
    assert.deepEqual(resolveKeyboardChord("g p", { slug: "north" }), {
      type: "go-pulse",
      slug: "north",
    });
    assert.deepEqual(resolveKeyboardChord("g e", { slug: "north" }), {
      type: "go-people",
      slug: "north",
    });
    assert.deepEqual(
      resolveKeyboardChord("Escape", { helpOpen: true }),
      { type: "close-overlay" },
    );
    assert.equal(resolveKeyboardChord("Escape", {}), null);
    assert.deepEqual(
      resolveKeyboardChord("2", { onBoard: true }),
      { type: "switch-view", view: "flow" },
    );
    assert.equal(resolveKeyboardChord("2", { onBoard: false }), null);
  });
});
