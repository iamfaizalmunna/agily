import type { ItemStatus } from "@/lib/items/status";
import { isOverdue, startOfUtcDay } from "@/lib/views/views";
import type { SummaryRow } from "@/lib/views/summary";
import { statusBreakdown } from "@/lib/views/summary";

export const BURNDOWN_DAYS = 14;
export const SPARKLINE_DAYS = 7;

export type BurndownPoint = {
  dayKey: string;
  label: string;
  remaining: number;
  ideal: number;
};

export type DonutSegment = {
  status: ItemStatus;
  label: string;
  count: number;
  percent: number;
  offset: number;
};

function addUtcDays(day: Date, delta: number) {
  return new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() + delta),
  );
}

function dayKey(day: Date) {
  return day.toISOString().slice(0, 10);
}

function shortLabel(dayKey: string) {
  return dayKey.slice(5);
}

export function remainingAtEndOfDay(items: SummaryRow[], end: Date) {
  const endMs = end.getTime();
  return items.filter((item) => {
    if (item.status !== "done") return true;
    return item.updatedAt.getTime() > endMs;
  }).length;
}

export function burndownSeries(
  items: SummaryRow[],
  now: Date,
  days = BURNDOWN_DAYS,
) {
  const today = startOfUtcDay(now);
  const start = addUtcDays(today, -(days - 1));
  const points: BurndownPoint[] = [];
  for (let i = 0; i < days; i += 1) {
    const day = addUtcDays(start, i);
    const end = addUtcDays(day, 1);
    const remaining = remainingAtEndOfDay(items, end);
    points.push({
      dayKey: dayKey(day),
      label: shortLabel(dayKey(day)),
      remaining,
      ideal: 0,
    });
  }
  const scope = points[0]?.remaining ?? 0;
  const span = Math.max(days - 1, 1);
  for (let i = 0; i < points.length; i += 1) {
    points[i].ideal = Math.round(scope - (scope / span) * i);
  }
  return { scope, points };
}

export function completedPerDay(
  items: SummaryRow[],
  now: Date,
  days = SPARKLINE_DAYS,
) {
  const today = startOfUtcDay(now);
  const start = addUtcDays(today, -(days - 1));
  const counts = new Array<number>(days).fill(0);
  for (const item of items) {
    if (item.status !== "done") continue;
    const doneDay = startOfUtcDay(item.updatedAt);
    if (doneDay < start || doneDay > today) continue;
    const index = Math.floor(
      (doneDay.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (index >= 0 && index < days) counts[index] += 1;
  }
  return counts.map((count, index) => ({
    dayKey: dayKey(addUtcDays(start, index)),
    label: shortLabel(dayKey(addUtcDays(start, index))),
    count,
  }));
}

export function velocityLite(completedDays: { count: number }[]) {
  if (!completedDays.length) return 0;
  const total = completedDays.reduce((sum, row) => sum + row.count, 0);
  return Math.round((total / completedDays.length) * 10) / 10;
}

export function statusDonutSegments(items: SummaryRow[]) {
  const rows = statusBreakdown(items).filter((row) => row.count > 0);
  let offset = 0;
  return rows.map((row) => {
    const segment: DonutSegment = {
      status: row.status,
      label: row.label,
      count: row.count,
      percent: row.percent,
      offset,
    };
    offset += row.percent;
    return segment;
  });
}

export type BoardOverdueRow = {
  projectSlug: string;
  projectName: string;
  overdue: number;
};

export function studioOverdueByBoard(
  rows: {
    projectSlug: string;
    projectName: string;
    dueOn: Date | null;
    status: string;
  }[],
  now: Date,
) {
  const map = new Map<string, BoardOverdueRow>();
  for (const row of rows) {
    if (!isOverdue(row.dueOn, row.status, now)) continue;
    const current = map.get(row.projectSlug) ?? {
      projectSlug: row.projectSlug,
      projectName: row.projectName,
      overdue: 0,
    };
    current.overdue += 1;
    map.set(row.projectSlug, current);
  }
  return [...map.values()].sort((a, b) => b.overdue - a.overdue);
}

export function studioOverdueTotal(boards: BoardOverdueRow[]) {
  return boards.reduce((sum, row) => sum + row.overdue, 0);
}
