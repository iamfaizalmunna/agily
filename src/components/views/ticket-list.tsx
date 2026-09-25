import Link from "next/link";
import { AssigneeMarks } from "@/components/items/assignee-marks";
import { LabelBadges } from "@/components/labels/label-badges";
import type { LabelChip } from "@/lib/labels/labels";
import type { SubtaskRow } from "@/lib/subtasks/subtasks";
import { TicketListChecklist } from "@/components/views/ticket-list-checklist";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PRIORITY_LABEL, type ItemPriority } from "@/lib/items/priority";
import { STATUS_LABEL, type ItemStatus } from "@/lib/items/status";
import { formatIssueKey } from "@/lib/items/issue-key";
import { formatDueOn } from "@/lib/items/validate";
import { priorityTone } from "@/lib/ui/priority-tone";
import { cn } from "@/lib/cn";

export type TicketListItem = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueOn: Date | null;
  href: string;
  people: { id: string; name: string }[];
  position?: number;
  projectSlug?: string;
  groupName?: string;
  active?: boolean;
  labels?: LabelChip[];
  subtasks?: SubtaskRow[];
};

export function TicketList({
  items,
  selectedId,
}: {
  items: TicketListItem[];
  selectedId?: string;
}) {
  return (
    <ScrollArea className="h-[min(70vh,720px)] rounded-lg border border-border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Ticket</th>
            <th className="px-4 py-2.5 font-medium">Priority</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Due</th>
            <th className="px-4 py-2.5 font-medium">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? (
            items.map((item) => {
              const on = selectedId === item.id || item.active;
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b border-border/60 transition-colors hover:bg-muted/40",
                    on && "bg-primary/5",
                  )}
                >
                  <td className="px-4 py-3">
                    <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
                      {formatIssueKey(item.projectSlug ?? "board", item.position ?? 0)}
                    </p>
                    <Link href={item.href} className="font-medium hover:text-primary">
                      {item.title}
                    </Link>
                    {item.groupName ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.groupName}
                      </p>
                    ) : null}
                    {item.labels?.length ? (
                      <LabelBadges labels={item.labels} compact className="mt-1.5" />
                    ) : null}
                    {item.subtasks?.length ? (
                      <TicketListChecklist subtasks={item.subtasks} />
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          priorityTone(item.priority).dot,
                        )}
                      />
                      {PRIORITY_LABEL[item.priority as ItemPriority] ?? item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">
                      {STATUS_LABEL[item.status as ItemStatus] ?? item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.dueOn ? formatDueOn(item.dueOn) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <AssigneeMarks people={item.people} />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                No tickets match this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </ScrollArea>
  );
}
