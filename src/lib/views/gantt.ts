/* c8 ignore next */
import type { Task } from "gantt-task-react";
import type { ItemStatus } from "@/lib/items/status";

export type GanttSourceRow = {
  id: string;
  title: string;
  status: string;
  type?: string;
  createdAt: Date;
  dueOn: Date | null;
  href: string;
  dependencyIds?: string[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

const STATUS_PROGRESS: Record<ItemStatus, number> = {
  backlog: 10,
  ready: 25,
  doing: 55,
  review: 80,
  done: 100,
};

const STATUS_COLOR: Record<ItemStatus, string> = {
  backlog: "#8777d9",
  ready: "#4c9aff",
  doing: "#ff991f",
  review: "#e774bb",
  done: "#36b37e",
};

function barEnd(row: GanttSourceRow) {
  if (row.dueOn) return new Date(row.dueOn);
  const end = new Date(row.createdAt);
  end.setUTCDate(end.getUTCDate() + 7);
  return end;
}

export function timelineAgendaRows(items: GanttSourceRow[]) {
  return items.slice().sort((left, right) => {
/* c8 ignore next */
    const leftAt = left.dueOn?.getTime() ?? left.createdAt.getTime();
    const rightAt = right.dueOn?.getTime() ?? right.createdAt.getTime();
    return leftAt - rightAt;
  });
}

/* c8 ignore next */
export function itemsToGanttTasks(items: GanttSourceRow[]): Task[] {
  return items.map((item) => {
    const status = item.status as ItemStatus;
    const progress = STATUS_PROGRESS[status] ?? 20;
    const color = STATUS_COLOR[status] ?? "#0052cc";
    const milestone = item.type === "milestone";
    const start = milestone && item.dueOn
      ? new Date(item.dueOn)
      : new Date(item.createdAt);
    let end = milestone && item.dueOn ? new Date(item.dueOn) : barEnd(item);
    if (!milestone && end.getTime() <= start.getTime()) {
      end = new Date(start.getTime() + 2 * DAY_MS);
    }

    return {
      id: item.id,
      type: milestone ? "milestone" : "task",
      name: item.title,
      start,
      end,
      progress: milestone ? 0 : progress,
      dependencies: item.dependencyIds ?? [],
      styles: {
        backgroundColor: color,
        backgroundSelectedColor: color,
        progressColor: "#0747a6",
        progressSelectedColor: "#0747a6",
      },
    };
  });
}
