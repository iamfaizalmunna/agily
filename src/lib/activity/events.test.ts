import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  diffItemEvents,
  eventFieldLabel,
  formatAssigneeValue,
  formatDueValue,
  formatEventSentence,
  isItemEventKind,
} from "@/lib/activity/events";

describe("revamp R5 activity events", () => {
  const names = new Map([
    ["u1", "Ada"],
    ["u2", "Lee"],
  ]);

  it("detects field changes", () => {
    const before = {
      status: "backlog",
      priority: "minor",
      dueOn: null,
      assigneeIds: ["u1"],
    };
    const after = {
      status: "doing",
      priority: "critical",
      dueOn: new Date("2026-09-30T12:00:00.000Z"),
      assigneeIds: ["u1", "u2"],
    };
    const rows = diffItemEvents(before, after, names);
    assert.equal(rows.length, 4);
    assert.equal(isItemEventKind("status"), true);
    assert.equal(isItemEventKind("note"), false);
    assert.equal(formatAssigneeValue([], names), "Unassigned");
    assert.equal(
      formatEventSentence("Ada", "status", "backlog", "doing"),
      "Ada changed Status from backlog to doing",
    );
    assert.equal(eventFieldLabel("priority"), "Priority");
    assert.equal(eventFieldLabel("due"), "Due date");
    assert.equal(eventFieldLabel("assignee"), "Assignees");
    assert.equal(formatDueValue(null), "");
    assert.equal(
      formatDueValue(new Date("2026-01-02T00:00:00.000Z")),
      "2026-01-02",
    );
  });
});
