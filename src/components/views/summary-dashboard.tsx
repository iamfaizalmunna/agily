import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { STATUS_LABEL, type ItemStatus } from "@/lib/items/status";
import { priorityTone } from "@/lib/ui/priority-tone";
import type { HierarchyNode } from "@/lib/items/hierarchy";
import { SummaryEpics } from "@/components/views/summary-epics";
import {
  countCompletedSince,
  priorityBreakdown,
  recentUpdates,
  statusBreakdown,
  summaryStats,
  weekStart,
  type SummaryRow,
} from "@/lib/views/summary";
import { cn } from "@/lib/cn";

const STATUS_BADGE: Record<ItemStatus, "default" | "secondary" | "outline" | "destructive"> = {
  backlog: "secondary",
  ready: "outline",
  doing: "default",
  review: "secondary",
  done: "outline",
};

export function SummaryDashboard({
  items,
  focusHref,
  now,
}: {
  items: SummaryRow[];
  focusHref: (id: string) => string;
  now: Date;
}) {
  const breakdown = statusBreakdown(items);
  const priorities = priorityBreakdown(items);
  const completed = countCompletedSince(items, weekStart(now));
  const recent = recentUpdates(items);
  const stats = summaryStats(items, now);
  const hierarchyItems: HierarchyNode[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    status: item.status,
    type: item.type ?? "task",
    parentId: item.parentId ?? null,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total tickets" value={stats.total} />
        <StatCard label="Open" value={stats.open} />
        <StatCard label="Overdue" value={stats.overdue} tone="destructive" />
        <StatCard label="Done this week" value={completed} tone="success" />
      </div>

      <SummaryEpics items={hierarchyItems} focusHref={focusHref} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <p className="mb-3 text-sm font-medium">Status overview</p>
          <ul className="space-y-2.5">
            {breakdown.map((row) => (
              <li key={row.status} className="flex items-center gap-3">
                <Badge variant={STATUS_BADGE[row.status]} className="shrink-0">
                  {row.label}
                </Badge>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-muted-foreground">
                  {row.count}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <p className="mb-3 text-sm font-medium">Priority mix</p>
          <ul className="space-y-2.5">
            {priorities.map((row) => {
              const tone = priorityTone(row.priority);
              return (
                <li key={row.priority} className="flex items-center gap-3">
                  <span className="flex w-20 items-center gap-1.5 text-xs font-medium">
                    <span className={cn("h-2 w-2 rounded-full", tone.dot)} />
                    {row.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", tone.dot)}
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-muted-foreground">
                    {row.count}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <p className="mb-3 text-sm font-medium">Recent activity</p>
          {recent.length ? (
            <ul className="divide-y divide-border">
              {recent.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <Link
                    href={focusHref(row.id)}
                    className="truncate text-sm font-medium hover:text-primary"
                  >
                    {row.title}
                  </Link>
                  <Badge variant="outline">
                    {STATUS_LABEL[row.status as ItemStatus] ?? row.status}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No tickets yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "destructive" | "success";
}) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-3xl font-semibold tabular-nums",
          tone === "destructive" && value > 0 && "text-destructive",
          tone === "success" && "text-emerald-600",
        )}
      >
        {value}
      </p>
    </Card>
  );
}
