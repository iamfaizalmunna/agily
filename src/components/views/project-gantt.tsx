"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Gantt, ViewMode, type Task } from "gantt-task-react";
import { itemsToGanttTasks, type GanttSourceRow } from "@/lib/views/gantt";
import "gantt-task-react/dist/index.css";

export function ProjectGantt({ items }: { items: GanttSourceRow[] }) {
  const router = useRouter();
  const tasks = useMemo(() => itemsToGanttTasks(items), [items]);
  const hrefById = useMemo(
    () => new Map(items.map((item) => [item.id, item.href])),
    [items],
  );

  if (!tasks.length) {
    return (
      <p className="rounded-lg border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        No scheduled tickets in this lens.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card [&_.bar]:!rounded-md [&_.calendar]:!fill-muted-foreground [&_.gridRow]:!fill-card [&_.today]:!stroke-destructive">
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Week}
        listCellWidth="220px"
        columnWidth={56}
        barFill={62}
        rowHeight={44}
        fontFamily="var(--font-sans), system-ui, sans-serif"
        fontSize="12px"
        todayColor="rgba(222, 53, 11, 0.12)"
        onClick={(task: Task) => {
          const href = hrefById.get(task.id);
          if (href) router.push(href);
        }}
      />
    </div>
  );
}
