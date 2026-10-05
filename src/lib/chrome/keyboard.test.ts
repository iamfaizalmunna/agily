import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  boardViewFromDigit,
  isCommandPaletteKey,
  isTypingTarget,
  nextChordBuffer,
  normalizeKey,
  resolveKeyboardChord,
} from "@/lib/chrome/keyboard";

describe("phase 10 keyboard", () => {
  it("detects command palette shortcut", () => {
    assert.equal(
      isCommandPaletteKey({ key: "k", metaKey: true, ctrlKey: false }),
      true,
    );
    assert.equal(
      isCommandPaletteKey({ key: "k", metaKey: false, ctrlKey: true }),
      true,
    );
    assert.equal(
      isCommandPaletteKey({ key: "k", metaKey: false, ctrlKey: false }),
      false,
    );
  });

  it("ignores non-elements and normalizes keys", () => {
    assert.equal(isTypingTarget(null), false);
    assert.equal(isTypingTarget({} as EventTarget), false);
    assert.equal(
      isTypingTarget({ tagName: "INPUT" } as unknown as EventTarget),
      true,
    );
    assert.equal(
      isTypingTarget({ tagName: "DIV", isContentEditable: true } as unknown as EventTarget),
      true,
    );
    assert.equal(
      normalizeKey({ key: "P", metaKey: false, ctrlKey: false, altKey: false, shiftKey: false }),
      "p",
    );
    assert.equal(
      normalizeKey({ key: "?", metaKey: false, ctrlKey: false, altKey: false, shiftKey: true }),
      "?",
    );
    assert.equal(
      normalizeKey({ key: "/", metaKey: false, ctrlKey: false, altKey: false, shiftKey: true }),
      "?",
    );
    assert.equal(
      normalizeKey({ key: "p", metaKey: true, ctrlKey: false, altKey: false, shiftKey: false }),
      "",
    );
    assert.equal(
      normalizeKey({ key: "Enter", metaKey: false, ctrlKey: false, altKey: false, shiftKey: false }),
      "Enter",
    );
  });

  it("maps digits to board views", () => {
    assert.equal(boardViewFromDigit("1"), "summary");
    assert.equal(boardViewFromDigit("2"), "list");
    assert.equal(boardViewFromDigit("3"), "flow");
    assert.equal(boardViewFromDigit("4"), "orbit");
    assert.equal(boardViewFromDigit("5"), "timeline");
    assert.equal(boardViewFromDigit("6"), null);
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
      resolveKeyboardChord("3", { onBoard: true }),
      { type: "switch-view", view: "flow" },
    );
    assert.equal(resolveKeyboardChord("3", { onBoard: false }), null);
  });
});
