import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  countByStatus,
  countCompletedSince,
  recentUpdates,
  statusBreakdown,
  weekStart,
} from "@/lib/views/summary";

const now = new Date("2026-09-24T12:00:00.000Z");

describe("summary view", () => {
  it("counts status and recent updates", () => {
    const rows = [
      {
        id: "1",
        title: "A",
        status: "done",
        dueOn: null,
        updatedAt: new Date("2026-09-24T00:00:00.000Z"),
        createdAt: new Date("2026-09-01T00:00:00.000Z"),
      },
      {
        id: "2",
        title: "B",
        status: "doing",
        dueOn: null,
        updatedAt: new Date("2026-09-20T00:00:00.000Z"),
        createdAt: new Date("2026-09-10T00:00:00.000Z"),
      },
    ];
    assert.equal(countByStatus(rows).done, 1);
    assert.equal(countByStatus(rows).doing, 1);
    assert.equal(
      countCompletedSince(rows, new Date("2026-09-23T00:00:00.000Z")),
      1,
    );
    assert.equal(
      statusBreakdown(rows).find((row) => row.status === "done")?.count,
      1,
    );
    assert.equal(recentUpdates(rows)[0]?.id, "1");
    assert.ok(weekStart(now).getUTCDay() === 0);
  });
});
