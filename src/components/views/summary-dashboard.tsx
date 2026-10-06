import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { STATUS_LABEL, type ItemStatus } from "@/lib/items/status";
import { priorityTone } from "@/lib/ui/priority-tone";
import type { HierarchyNode } from "@/lib/items/hierarchy";
import { SummaryEpics } from "@/components/views/summary-epics";
import { BurndownChart } from "@/components/charts/burndown-chart";
import { Sparkline } from "@/components/charts/sparkline";
import { StatusDonut } from "@/components/charts/status-donut";
import {
  burndownSeries,
  completedPerDay,
  statusDonutSegments,
  velocityLite,
} from "@/lib/views/analytics";
import {
  countCompletedSince,
  priorityBreakdown,
  recentUpdates,
  summaryStats,
  weekStart,
  type SummaryRow,
} from "@/lib/views/summary";
import { storyPointTotals } from "@/lib/items/story-points";
import { cn } from "@/lib/cn";
import { dataSurfaceScrollClass } from "@/lib/ui/layout-contract";

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
  const donut = statusDonutSegments(items);
  const priorities = priorityBreakdown(items);
  const completed = countCompletedSince(items, weekStart(now));
  const completedDays = completedPerDay(items, now);
  const velocity = velocityLite(completedDays);
  const burndown = burndownSeries(items, now);
  const recent = recentUpdates(items);
  const stats = summaryStats(items, now);
  const points = storyPointTotals(items);
  const hierarchyItems: HierarchyNode[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    status: item.status,
    type: item.type ?? "task",
    parentId: item.parentId ?? null,
  }));

  return (
    <div className="flex min-w-0 w-full flex-col gap-4">
      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total tickets" value={stats.total} />
        <StatCard label="Open" value={stats.open} />
        <StatCard label="Overdue" value={stats.overdue} tone="destructive" />
        <StatCard label="Done this week" value={completed} tone="success" />
        <StatCard
          label="Story points"
          value={points.scope}
          hint={
            points.estimated
              ? `${points.open} open · ${points.done} done`
              : "Add points on tickets"
          }
        />
      </div>

      <SummaryEpics items={hierarchyItems} focusHref={focusHref} />

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className={cn("min-h-[12rem] min-w-0 p-4", dataSurfaceScrollClass())}>
          <p className="mb-1 text-sm font-medium">Burndown (14 days)</p>
          <p className="mb-3 text-xs text-muted-foreground">
            Scope {burndown.scope} · velocity {velocity}/day
          </p>
          <BurndownChart points={burndown.points} scope={burndown.scope} />
        </Card>

        <Card className={cn("min-h-[10rem] min-w-0 p-4", dataSurfaceScrollClass())}>
          <p className="mb-1 text-sm font-medium">Completed this week</p>
          <p className="mb-3 text-xs text-muted-foreground">
            {completed} done since Sunday UTC
          </p>
          <Sparkline
            values={completedDays.map((row) => row.count)}
            labels={completedDays.map((row) => row.label)}
          />
        </Card>

        <Card className={cn("min-h-[12rem] min-w-0 p-4", dataSurfaceScrollClass())}>
          <p className="mb-3 text-sm font-medium">Status distribution</p>
          <StatusDonut segments={donut} />
        </Card>

        <Card className="min-w-0 p-4">
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
  hint,
}: {
  label: string;
  value: number;
  tone?: "destructive" | "success";
  hint?: string;
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
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </Card>
  );
}
