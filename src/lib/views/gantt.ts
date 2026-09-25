import type { Task } from "gantt-task-react";
import type { ItemStatus } from "@/lib/items/status";

export type GanttSourceRow = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  dueOn: Date | null;
  href: string;
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

export function itemsToGanttTasks(items: GanttSourceRow[]): Task[] {
  return items.map((item) => {
    const status = item.status as ItemStatus;
    const progress = STATUS_PROGRESS[status] ?? 20;
    const color = STATUS_COLOR[status] ?? "#0052cc";
    const start = new Date(item.createdAt);
    let end = barEnd(item);
    if (end.getTime() <= start.getTime()) {
      end = new Date(start.getTime() + 2 * DAY_MS);
    }

    return {
      id: item.id,
      type: "task",
      name: item.title,
      start,
      end,
      progress,
      styles: {
        backgroundColor: color,
        backgroundSelectedColor: color,
        progressColor: "#0747a6",
        progressSelectedColor: "#0747a6",
      },
    };
  });
}
