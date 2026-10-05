import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatSubtaskProgress,
  hasOpenSubtasks,
  parseSubtaskTitle,
  subtaskProgress,
} from "./subtasks";

describe("subtasks", () => {
  it("parses titles", () => {
    assert.deepEqual(parseSubtaskTitle("  Ship it "), { title: "Ship it" });
    assert.equal(parseSubtaskTitle("").error, "Checklist item needs text");
    assert.equal(parseSubtaskTitle("x".repeat(121)).error, "Too long");
  });

  it("computes progress", () => {
    assert.deepEqual(subtaskProgress([]), {
      done: 0,
      total: 0,
      open: 0,
      percent: 0,
    });
    const rows = [{ done: true }, { done: false }, { done: true }];
    assert.deepEqual(subtaskProgress(rows), {
      done: 2,
      total: 3,
      open: 1,
      percent: 67,
    });
    assert.equal(formatSubtaskProgress(2, 5), "2/5");
    assert.equal(formatSubtaskProgress(0, 0), "");
    assert.equal(hasOpenSubtasks(rows), true);
    assert.equal(hasOpenSubtasks([{ done: true }]), false);
  });
});
