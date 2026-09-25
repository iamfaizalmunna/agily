"use client";

import Link from "next/link";
import { GripVertical } from "lucide-react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { AssigneeMarks } from "@/components/items/assignee-marks";
import { LabelBadges } from "@/components/labels/label-badges";
import type { LabelChip } from "@/lib/labels/labels";
import { formatSubtaskProgress, subtaskProgress } from "@/lib/subtasks/subtasks";
import { formatIssueKey } from "@/lib/items/issue-key";
import { ISSUE_TYPE_LABEL, parseIssueType } from "@/lib/items/issue-type";
import { PRIORITY_LABEL, type ItemPriority } from "@/lib/items/priority";
import { formatDueOn } from "@/lib/items/validate";
import { priorityTone } from "@/lib/ui/priority-tone";
import { cn } from "@/lib/cn";

export type TicketCardData = {
  id: string;
  title: string;
  priority: string;
  dueOn: Date | null;
  href: string;
  people: { id: string; name: string }[];
  position: number;
  projectSlug: string;
  labels?: LabelChip[];
  subtasks?: { done: boolean }[];
  type?: string;
};

export function TicketCard({
  ticket,
  draggable = false,
  dragging = false,
  dragAttributes,
  dragListeners,
  compact = false,
}: {
  ticket: TicketCardData;
  draggable?: boolean;
  dragging?: boolean;
  dragAttributes?: DraggableAttributes;
  dragListeners?: SyntheticListenerMap;
  compact?: boolean;
}) {
  const tone = priorityTone(ticket.priority);
  const key = formatIssueKey(ticket.projectSlug, ticket.position);
  const priority = ticket.priority as ItemPriority;
  const checklist = subtaskProgress(ticket.subtasks ?? []);

  return (
    <div
      className={cn(
        "group rounded-lg border border-border bg-card shadow-sm transition-all",
        dragging && "rotate-1 opacity-95 shadow-lg ring-2 ring-primary/30",
        !dragging && draggable && "hover:shadow-md hover:border-primary/30",
      )}
    >
      <div className={cn("flex items-start gap-1", compact ? "p-2.5" : "p-3")}>
        {draggable ? (
          <button
            type="button"
            className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-0.5 text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
            aria-label="Drag ticket"
            {...dragAttributes}
            {...dragListeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : null}
        <Link href={ticket.href} className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
            <span className={cn("h-2 w-2 rounded-full", tone.dot)} />
            <span>{key}</span>
            <span className="normal-case">
              {ISSUE_TYPE_LABEL[parseIssueType(ticket.type)]}
            </span>
            <span className={tone.label}>
              {PRIORITY_LABEL[priority] ?? ticket.priority}
            </span>
            {checklist.total ? (
              <span className="normal-case text-muted-foreground">
                {formatSubtaskProgress(checklist.done, checklist.total)}
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 text-sm font-medium leading-snug text-foreground">
            {ticket.title}
          </p>
          {ticket.labels?.length ? (
            <LabelBadges labels={ticket.labels} compact={compact} className="mt-2" />
          ) : null}
          {ticket.dueOn ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Due {formatDueOn(ticket.dueOn)}
            </p>
          ) : null}
          {ticket.people.length ? (
            <div className="mt-2">
              <AssigneeMarks people={ticket.people} />
            </div>
          ) : null}
        </Link>
      </div>
    </div>
  );
}
