import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { itemsToGanttTasks } from "@/lib/views/gantt";

describe("gantt mapping", () => {
  it("maps tickets to gantt bars with progress", () => {
    const tasks = itemsToGanttTasks([
      {
        id: "a",
        title: "Ship board",
        status: "doing",
        createdAt: new Date("2026-09-01T12:00:00.000Z"),
        dueOn: new Date("2026-09-20T12:00:00.000Z"),
        href: "/t/northwind/p/atlas?view=timeline&focus=a",
      },
    ]);
    assert.equal(tasks.length, 1);
    assert.equal(tasks[0]?.name, "Ship board");
    assert.equal(tasks[0]?.progress, 55);
    assert.ok(tasks[0]?.end.getTime() > tasks[0]?.start.getTime());
  });
});
