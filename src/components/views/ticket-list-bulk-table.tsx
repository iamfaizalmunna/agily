"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AssigneeMarks } from "@/components/items/assignee-marks";
import { LabelBadges } from "@/components/labels/label-badges";
import { TicketListChecklist } from "@/components/views/ticket-list-checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { bulkUpdateItemsAction } from "@/lib/items/actions";
import { PRIORITY_LABEL, type ItemPriority } from "@/lib/items/priority";
import { STATUS_LABEL, type ItemStatus } from "@/lib/items/status";
import { formatIssueKey } from "@/lib/items/issue-key";
import { formatDueOn } from "@/lib/items/validate";
import { storyPointsLabel } from "@/lib/items/story-points";
import { priorityTone } from "@/lib/ui/priority-tone";
import { cn } from "@/lib/cn";
import { listTableScrollClass } from "@/lib/ui/layout-contract";
import type { TicketListItem } from "@/components/views/ticket-list";

type StatusOption = { id: string; label: string };

export function TicketListBulkTable({
  items,
  selectedId,
  slug,
  projectSlug,
  listNext,
  statuses,
  members,
}: {
  items: TicketListItem[];
  selectedId?: string;
  slug: string;
  projectSlug: string;
  listNext: string;
  statuses: StatusOption[];
  members: { id: string; name: string }[];
}) {
  const allIds = useMemo(() => items.map((item) => item.id), [items]);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0, top: 0 });
  }, [items]);

  const allOn = selected.size > 0 && selected.size === allIds.length;
  const someOn = selected.size > 0 && selected.size < allIds.length;

  function toggleAll() {
    setSelected(allOn ? new Set() : new Set(allIds));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      {selected.size ? (
        <form
          action={bulkUpdateItemsAction}
          className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-3 md:flex-row md:flex-wrap md:items-end"
        >
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="next" value={listNext} />
          {[...selected].map((id) => (
            <input key={id} type="hidden" name="itemId" value={id} />
          ))}
          <p className="text-sm font-medium text-foreground md:mr-2">
            {selected.size} selected
          </p>
          <label className="flex min-w-[9rem] flex-col gap-1 text-xs text-muted-foreground">
            Status
            <Select name="bulkStatus" className="min-h-11 text-sm" defaultValue="">
              <option value="">No change</option>
              {statuses.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.label}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex min-w-[9rem] flex-col gap-1 text-xs text-muted-foreground">
            Priority
            <Select name="bulkPriority" className="min-h-11 text-sm" defaultValue="">
              <option value="">No change</option>
              {(Object.keys(PRIORITY_LABEL) as ItemPriority[]).map((key) => (
                <option key={key} value={key}>
                  {PRIORITY_LABEL[key]}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex min-w-[10rem] flex-col gap-1 text-xs text-muted-foreground">
            Assignee
            <Select
              name="bulkAssignee"
              className="min-h-11 text-sm"
              defaultValue="unchanged"
            >
              <option value="unchanged">No change</option>
              <option value="clear">Unassign all</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </Select>
          </label>
          <Button type="submit" className="min-h-11">
            Apply
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="min-h-11"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </Button>
        </form>
      ) : null}

      <div
        ref={scrollRef}
        className={listTableScrollClass()}
        tabIndex={0}
        aria-label="Ticket list"
      >
        <table className="w-full min-w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="w-10 px-2 py-2.5">
                <input
                  type="checkbox"
                  className="size-4 rounded border-border"
                  aria-label="Select all tickets"
                  checked={allOn}
                  ref={(el) => {
                    if (el) el.indeterminate = someOn;
                  }}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-2.5 font-medium">Ticket</th>
              <th className="hidden whitespace-nowrap px-4 py-2.5 font-medium sm:table-cell">
                Priority
              </th>
              <th className="hidden whitespace-nowrap px-4 py-2.5 font-medium lg:table-cell">
                Pts
              </th>
              <th className="whitespace-nowrap px-4 py-2.5 font-medium">Status</th>
              <th className="hidden whitespace-nowrap px-4 py-2.5 font-medium md:table-cell">
                Due
              </th>
              <th className="whitespace-nowrap px-4 py-2.5 font-medium text-right">
                Assignee
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item) => {
                const on = selectedId === item.id || item.active;
                const picked = selected.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={cn(
                      "border-b border-border/60 transition-colors hover:bg-muted/40",
                      (on || picked) && "bg-primary/5",
                    )}
                  >
                    <td className="px-2 py-3">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-border"
                        aria-label={`Select ${item.title}`}
                        checked={picked}
                        onChange={() => toggleOne(item.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="truncate text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
                        {formatIssueKey(
                          item.projectSlug ?? "board",
                          item.position ?? 0,
                        )}
                      </p>
                      <Link
                        href={item.href}
                        className="block truncate font-medium hover:text-primary"
                        title={item.title}
                      >
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
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="inline-flex max-w-full items-center gap-1.5 truncate text-muted-foreground">
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full",
                            priorityTone(item.priority).dot,
                          )}
                        />
                        {PRIORITY_LABEL[item.priority as ItemPriority] ??
                          item.priority}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {storyPointsLabel(item.storyPoints)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">
                        {STATUS_LABEL[item.status as ItemStatus] ?? item.status}
                      </Badge>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {item.dueOn ? formatDueOn(item.dueOn) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AssigneeMarks people={item.people} />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No tickets match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
