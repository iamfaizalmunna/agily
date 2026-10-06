"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectGantt } from "@/components/views/project-gantt";
import { timelineAgendaRows, type GanttSourceRow } from "@/lib/views/gantt";
import { STATUS_LABEL, type ItemStatus } from "@/lib/items/status";
import { formatDueOn } from "@/lib/items/validate";
import { Badge } from "@/components/ui/badge";
import { useMdDown } from "@/lib/ui/use-md-down";
export function TimelineMobileView({
  slug,
  projectSlug,
  items,
  canWrite,
}: {
  slug: string;
  projectSlug: string;
  items: GanttSourceRow[];
  canWrite: boolean;
}) {
  const isMobile = useMdDown();
  const [showGantt, setShowGantt] = useState(false);
  const agenda = timelineAgendaRows(items);

  if (!isMobile) {
    return (
      <div className="min-w-0 w-full">
        <ProjectGantt
          slug={slug}
          projectSlug={projectSlug}
          items={items}
          canWrite={canWrite}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Upcoming</h2>
        <button
          type="button"
          className="min-h-11 rounded-md border border-border px-3 text-sm font-medium"
          onClick={() => setShowGantt((value) => !value)}
        >
          {showGantt ? "Agenda" : "Gantt"}
        </button>
      </div>
      {showGantt ? (
        <div className="overflow-x-auto">
          <ProjectGantt
            slug={slug}
            projectSlug={projectSlug}
            items={items}
            canWrite={canWrite}
          />
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {agenda.map((row) => (
            <li key={row.id}>
              <Link
                href={row.href}
                className="flex min-h-14 flex-col justify-center rounded-lg border border-border bg-card px-4 py-3"
              >
                <span className="font-medium">{row.title}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">
                    {STATUS_LABEL[row.status as ItemStatus] ?? row.status}
                  </Badge>
                  {row.dueOn ? <span>Due {formatDueOn(row.dueOn)}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
