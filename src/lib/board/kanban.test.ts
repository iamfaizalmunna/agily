import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultWorkflow } from "@/lib/workflow/workflow";
import {
  boardDisplayQuery,
  groupByStatusSorted,
  groupByWorkflowSorted,
  groupSwimlanes,
  isOverWip,
  parseBoardDisplayPrefs,
  parseSwimlaneMode,
  sortKanbanColumn,
  swimlaneKey,
  visibleKanbanStatuses,
  wipLimitFor,
  UNASSIGNED_LANE,
} from "./kanban";

describe("board/kanban", () => {
  it("parses swimlane and board display prefs", () => {
    assert.equal(parseSwimlaneMode("assignee"), "assignee");
    assert.equal(parseSwimlaneMode("nope"), "none");
    assert.deepEqual(
      parseBoardDisplayPrefs({ lane: "priority", hideDone: "1", compact: "1" }),
      { swimlane: "priority", hideDone: true, compact: true },
    );
    assert.deepEqual(boardDisplayQuery({ swimlane: "none", hideDone: false, compact: false }), {});
    assert.deepEqual(
      boardDisplayQuery({ swimlane: "assignee", hideDone: true, compact: true }),
      { lane: "assignee", hideDone: "1", compact: "1" },
    );
  });

  it("sorts columns and hides done when requested", () => {
    const sorted = sortKanbanColumn([
      { id: "b", position: 1 },
      { id: "a", position: 0 },
    ]);
    assert.deepEqual(sorted.map((row) => row.id), ["a", "b"]);
    const columns = groupByStatusSorted([
      {
        id: "1",
        status: "doing",
        position: 2,
        priority: "minor",
        people: [],
      },
      {
        id: "2",
        status: "doing",
        position: 0,
        priority: "major",
        people: [],
      },
    ]);
    assert.deepEqual(columns.doing.map((row) => row.id), ["2", "1"]);
    assert.equal(visibleKanbanStatuses(false).includes("done"), true);
    assert.equal(visibleKanbanStatuses(true).includes("done"), false);
    const custom = defaultWorkflow();
    custom.statuses.push({
      id: "qa",
      label: "QA",
      color: "#abcdef",
    });
    const customCols = groupByWorkflowSorted(
      [
        {
          id: "9",
          status: "qa",
          position: 0,
          priority: "minor",
          people: [],
        },
      ],
      custom,
    );
    assert.equal(customCols.qa.length, 1);
  });

  it("computes WIP hints", () => {
    assert.equal(wipLimitFor("doing"), 4);
    assert.equal(isOverWip(3, 4), false);
    assert.equal(isOverWip(5, 4), true);
    assert.equal(isOverWip(10, undefined), false);
  });

  it("returns a single row when swimlanes are off", () => {
    const flat = groupSwimlanes(
      [
        {
          id: "x",
          status: "backlog",
          position: 0,
          priority: "minor",
          people: [],
        },
      ],
      "none",
    );
    assert.equal(flat.length, 1);
    assert.equal(flat[0].label, "");
  });

  it("groups swimlanes by assignee and priority", () => {
    const items = [
      {
        id: "a",
        status: "doing",
        position: 0,
        priority: "critical",
        people: [{ id: "u1", name: "Ada" }],
      },
      {
        id: "b",
        status: "doing",
        position: 1,
        priority: "minor",
        people: [],
      },
    ];
    assert.equal(swimlaneKey(items[0], "assignee"), "u1");
    assert.equal(swimlaneKey(items[1], "assignee"), UNASSIGNED_LANE);
    const byAssignee = groupSwimlanes(items, "assignee", new Map([["u1", "Ada"]]));
    assert.equal(byAssignee.length, 2);
    assert.equal(byAssignee[0].label, "Unassigned");
    const byPriority = groupSwimlanes(items, "priority");
    assert.equal(byPriority.length, 2);
    const stacked = groupSwimlanes(
      [
        items[0],
        {
          id: "c",
          status: "doing",
          position: 2,
          priority: "major",
          people: [{ id: "u1", name: "Ada" }],
        },
      ],
      "assignee",
      new Map([["u1", "Ada"]]),
    );
    assert.equal(stacked.find((row) => row.key === "u1")?.items.length, 2);
  });

  it("groups 100 tickets into workflow columns quickly", () => {
    const workflow = defaultWorkflow();
    const statuses = workflow.statuses.map((row) => row.id);
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: `load-${i}`,
      status: statuses[i % statuses.length],
      position: i,
      priority: "minor",
      people: [],
    }));
    const start = performance.now();
    const columns = groupByWorkflowSorted(items, workflow);
    const elapsed = performance.now() - start;
    const total = Object.values(columns).reduce((sum, col) => sum + col.length, 0);
    assert.equal(total, 100);
    assert.ok(elapsed < 100, `groupByWorkflowSorted took ${elapsed}ms`);
  });
});
