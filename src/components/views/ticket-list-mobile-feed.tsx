import Link from "next/link";
import { AssigneeMarks } from "@/components/items/assignee-marks";
import { LabelBadges } from "@/components/labels/label-badges";
import { TicketListChecklist } from "@/components/views/ticket-list-checklist";
import { Badge } from "@/components/ui/badge";
import { PRIORITY_LABEL, type ItemPriority } from "@/lib/items/priority";
import { STATUS_LABEL, type ItemStatus } from "@/lib/items/status";
import { formatIssueKey } from "@/lib/items/issue-key";
import { formatDueOn } from "@/lib/items/validate";
import { priorityTone } from "@/lib/ui/priority-tone";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";
import { cn } from "@/lib/cn";
import type { TicketListItem } from "@/components/views/ticket-list";

export function TicketListMobileFeed({
  items,
  selectedId,
}: {
  items: TicketListItem[];
  selectedId?: string;
}) {
  if (!items.length) {
    return (
      <p className="rounded-lg border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground md:hidden">
        No tickets match this filter.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2 md:hidden">
      {items.map((item) => {
        const on = selectedId === item.id || item.active;
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              className={cn(
                mobileTouchTargetClass(
                  "block rounded-lg border border-border bg-card p-4 transition-colors",
                ),
                on && "border-primary/50 bg-primary/5",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
                  {formatIssueKey(item.projectSlug ?? "board", item.position ?? 0)}
                </p>
                <Badge variant="outline" className="shrink-0 text-[0.65rem]">
                  {STATUS_LABEL[item.status as ItemStatus] ?? item.status}
                </Badge>
              </div>
              <p className="mt-1 text-base font-medium leading-snug">{item.title}</p>
              {item.groupName ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{item.groupName}</p>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span
                    className={cn("h-2 w-2 rounded-full", priorityTone(item.priority).dot)}
                  />
                  {PRIORITY_LABEL[item.priority as ItemPriority] ?? item.priority}
                </span>
                {item.dueOn ? <span>Due {formatDueOn(item.dueOn)}</span> : null}
              </div>
              {item.labels?.length ? (
                <LabelBadges labels={item.labels} compact className="mt-2" />
              ) : null}
              {item.subtasks?.length ? (
                <TicketListChecklist subtasks={item.subtasks} />
              ) : null}
              {item.people.length ? (
                <div className="mt-2">
                  <AssigneeMarks people={item.people} />
                </div>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
