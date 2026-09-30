import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { itemsToGanttTasks, timelineAgendaRows } from "@/lib/views/gantt";

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
      {
        id: "b",
        title: "No due date",
        status: "backlog",
        createdAt: new Date("2026-09-01T12:00:00.000Z"),
        dueOn: null,
        href: "/t",
      },
      {
        id: "c",
        title: "Tight window",
        status: "ready",
        createdAt: new Date("2026-09-10T12:00:00.000Z"),
        dueOn: new Date("2026-09-09T12:00:00.000Z"),
        href: "/t",
      },
    ]);
    assert.equal(tasks.length, 3);
    assert.equal(tasks[0]?.name, "Ship board");
    assert.ok(tasks[1]?.end.getTime() > tasks[1]?.start.getTime());
    assert.ok(tasks[2]?.end.getTime() > tasks[2]?.start.getTime());
    assert.equal(tasks[0]?.progress, 55);
    assert.ok(tasks[0]?.end.getTime() > tasks[0]?.start.getTime());
  });

  it("maps milestones and dependency arrows", () => {
    const tasks = itemsToGanttTasks([
      {
        id: "m",
        title: "Launch",
        status: "ready",
        type: "milestone",
        createdAt: new Date("2026-09-01T12:00:00.000Z"),
        dueOn: new Date("2026-09-30T12:00:00.000Z"),
        href: "/t",
        dependencyIds: ["a"],
      },
    ]);
    assert.equal(tasks[0]?.type, "milestone");
    assert.deepEqual(tasks[0]?.dependencies, ["a"]);
  });

  it("sorts timeline agenda by due or created date", () => {
    const rows = timelineAgendaRows([
      {
        id: "b",
        title: "Later",
        status: "backlog",
        createdAt: new Date("2026-09-10T12:00:00.000Z"),
        dueOn: new Date("2026-09-30T12:00:00.000Z"),
        href: "/t",
      },
      {
        id: "a",
        title: "Soon",
        status: "backlog",
        createdAt: new Date("2026-09-01T12:00:00.000Z"),
        dueOn: new Date("2026-09-05T12:00:00.000Z"),
        href: "/t",
      },
    ]);
    assert.equal(rows[0]?.id, "a");
  });
});
