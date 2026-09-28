import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  burndownSeries,
  completedPerDay,
  remainingAtEndOfDay,
  statusDonutSegments,
  studioOverdueByBoard,
  studioOverdueTotal,
  velocityLite,
} from "@/lib/views/analytics";
import type { SummaryRow } from "@/lib/views/summary";

const now = new Date("2026-09-28T15:00:00.000Z");

function row(partial: Partial<SummaryRow> & Pick<SummaryRow, "id">): SummaryRow {
  return {
    title: partial.title ?? partial.id,
    status: partial.status ?? "doing",
    dueOn: partial.dueOn ?? null,
    updatedAt: partial.updatedAt ?? now,
    createdAt: partial.createdAt ?? now,
    ...partial,
  };
}

describe("revamp R6 analytics", () => {
  it("builds burndown and remaining counts", () => {
    const items = [
      row({
        id: "1",
        status: "done",
        updatedAt: new Date("2026-09-27T10:00:00.000Z"),
      }),
      row({ id: "2", status: "doing" }),
    ];
    const end = new Date("2026-09-28T00:00:00.000Z");
    assert.equal(remainingAtEndOfDay(items, end), 1);
    const { scope, points } = burndownSeries(items, now, 14);
    assert.equal(scope, points[0].remaining);
    assert.equal(points.length, 14);
    assert.ok(points[0].ideal >= points[13].ideal);
  });

  it("counts completed per day and velocity", () => {
    const items = [
      row({
        id: "1",
        status: "done",
        updatedAt: new Date("2026-09-28T08:00:00.000Z"),
      }),
      row({
        id: "2",
        status: "done",
        updatedAt: new Date("2026-09-28T09:00:00.000Z"),
      }),
    ];
    const days = completedPerDay(items, now, 7);
    assert.equal(days.at(-1)?.count, 2);
    assert.equal(velocityLite(days), 0.3);
  });

  it("builds donut segments and studio overdue", () => {
    const items = [
      row({ id: "1", status: "doing" }),
      row({ id: "2", status: "done" }),
    ];
    const segments = statusDonutSegments(items);
    assert.ok(segments.length >= 2);
    const boards = studioOverdueByBoard(
      [
        {
          projectSlug: "atlas",
          projectName: "Atlas",
          status: "doing",
          dueOn: new Date("2026-09-20T00:00:00.000Z"),
        },
      ],
      now,
    );
    assert.equal(boards[0].overdue, 1);
    assert.equal(studioOverdueTotal(boards), 1);
  });
});
