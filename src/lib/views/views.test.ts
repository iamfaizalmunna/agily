import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  boardViewHref,
  safeStudioNext,
  flattenBoardItems,
  formatYearMonth,
  groupByStatus,
  isOverdue,
  itemsOnDay,
  monthGrid,
  parseBoardView,
  parseYearMonth,
  pulseBuckets,
  shiftMonth,
  startOfUtcDay,
  unscheduled,
} from "@/lib/views/views";

const now = new Date("2026-09-24T15:00:00.000Z");

function item(
  partial: Partial<{
    id: string;
    title: string;
    status: string;
    dueOn: Date | null;
    updatedAt: Date;
    assigneeIds: string[];
  }>,
) {
  return {
    id: "1",
    title: "Work",
    status: "doing",
    dueOn: null,
    updatedAt: now,
    assigneeIds: [],
    ...partial,
  };
}

describe("phase 5 views", () => {
  it("parses board views and builds hrefs", () => {
    assert.equal(parseBoardView("summary"), "summary");
    assert.equal(parseBoardView("list"), "list");
    assert.equal(parseBoardView("flow"), "flow");
    assert.equal(parseBoardView("orbit"), "orbit");
    assert.equal(parseBoardView("timeline"), "timeline");
    assert.equal(parseBoardView("ledger"), "list");
    assert.equal(parseBoardView("nope"), "summary");
    assert.equal(parseBoardView(undefined), "summary");
    assert.equal(safeStudioNext("n", "/t/n", "/t/n/p/p?view=flow"), "/t/n/p/p?view=flow");
    assert.equal(safeStudioNext("n", "/t/n", "https://evil"), "/t/n");
    assert.equal(boardViewHref("n", "p", "summary"), "/t/n/p/p");
    assert.equal(boardViewHref("n", "p", "list"), "/t/n/p/p?view=list");
    assert.equal(boardViewHref("n", "p", "flow"), "/t/n/p/p?view=flow");
    assert.equal(boardViewHref("n", "p", "orbit"), "/t/n/p/p?view=orbit");
    assert.equal(boardViewHref("n", "p", "timeline"), "/t/n/p/p?view=timeline");
    assert.equal(safeStudioNext("n", "/t/n", ""), "/t/n");
    assert.equal(
      boardViewHref("n", "p", "orbit", "2026-09"),
      "/t/n/p/p?view=orbit&ym=2026-09",
    );
    assert.equal(
      boardViewHref("n", "p", "flow", undefined, { q: "mine", empty: "" }),
      "/t/n/p/p?view=flow&q=mine",
    );
  });

  it("marks overdue only before today and not done", () => {
    const yesterday = new Date("2026-09-23T12:00:00.000Z");
    const today = new Date("2026-09-24T12:00:00.000Z");
    assert.equal(isOverdue(yesterday, "doing", now), true);
    assert.equal(isOverdue(today, "doing", now), false);
    assert.equal(isOverdue(yesterday, "done", now), false);
    assert.equal(isOverdue(null, "doing", now), false);
    assert.equal(startOfUtcDay(now).toISOString(), "2026-09-24T00:00:00.000Z");
  });

  it("buckets pulse from one item list", () => {
    const rows = [
      item({
        id: "mine",
        assigneeIds: ["u1"],
        status: "doing",
        updatedAt: new Date("2026-09-20T00:00:00.000Z"),
      }),
      item({
        id: "late",
        dueOn: new Date("2026-09-01T12:00:00.000Z"),
        status: "ready",
      }),
      item({
        id: "old",
        assigneeIds: ["u1"],
        status: "done",
        updatedAt: new Date("2026-09-23T00:00:00.000Z"),
      }),
    ];
    const buckets = pulseBuckets(rows, "u1", now);
    assert.deepEqual(
      buckets.mine.map((r) => r.id),
      ["mine"],
    );
    assert.deepEqual(
      buckets.overdue.map((r) => r.id),
      ["late"],
    );
    assert.deepEqual(
      buckets.recent.map((r) => r.id),
      ["old", "mine"],
    );
  });

  it("groups flow columns and flattens groups", () => {
    const columns = groupByStatus([
      { status: "doing" },
      { status: "nope" },
      { status: "backlog" },
    ]);
    assert.equal(columns.doing.length, 1);
    assert.equal(columns.backlog.length, 1);
    assert.equal(columns.done.length, 0);
    assert.equal(
      flattenBoardItems([{ items: [1, 2] }, { items: [3] }]).length,
      3,
    );
  });

  it("splits orbit into days and an unscheduled lane", () => {
    const rows = [
      item({ id: "a", dueOn: new Date("2026-09-24T12:00:00.000Z") }),
      item({ id: "b", dueOn: null }),
    ];
    assert.equal(itemsOnDay(rows, "2026-09-24").length, 1);
    assert.equal(unscheduled(rows).length, 1);
  });

  it("builds a month grid and shifts months", () => {
    assert.deepEqual(parseYearMonth("2026-09"), { year: 2026, month: 8 });
    assert.equal(parseYearMonth(undefined, now).month, 8);
    assert.equal(parseYearMonth(null, now).year, 2026);
    assert.equal(parseYearMonth("nope", now).year, 2026);
    assert.equal(parseYearMonth("2026-13", now).month, 8);
    assert.equal(formatYearMonth(2026, 8), "2026-09");
    assert.deepEqual(shiftMonth(2026, 11, 1), { year: 2027, month: 0 });
    const grid = monthGrid(2026, 8);
    assert.equal(grid.length % 7, 0);
    assert.ok(grid.some((c) => c.key === "2026-09-01" && c.inMonth));
    assert.ok(grid.some((c) => !c.inMonth));
  });
});
