import {
  ITEM_PRIORITIES,
  PRIORITY_LABEL,
  type ItemPriority,
} from "@/lib/items/priority";
import { ITEM_STATUSES, STATUS_LABEL, type ItemStatus } from "@/lib/items/status";
import { startOfUtcDay, isOverdue } from "@/lib/views/views";

export type SummaryRow = {
  id: string;
  title: string;
  status: string;
  priority?: string;
  dueOn: Date | null;
  updatedAt: Date;
  createdAt: Date;
};

export function countByStatus(items: SummaryRow[]) {
  const counts = Object.fromEntries(
    ITEM_STATUSES.map((status) => [status, 0]),
  ) as Record<ItemStatus, number>;
  for (const item of items) {
    if (item.status in counts) {
      counts[item.status as ItemStatus] += 1;
    }
  }
  return counts;
}

export function countCompletedSince(items: SummaryRow[], since: Date) {
  const floor = since.getTime();
  return items.filter(
    (item) => item.status === "done" && item.updatedAt.getTime() >= floor,
  ).length;
}

export function statusBreakdown(items: SummaryRow[]) {
  const counts = countByStatus(items);
  const total = items.length || 1;
  return ITEM_STATUSES.map((status) => ({
    status,
    label: STATUS_LABEL[status],
    count: counts[status],
    percent: Math.round((counts[status] / total) * 100),
  }));
}

export function weekStart(now: Date) {
  const day = startOfUtcDay(now);
  return new Date(
    Date.UTC(
      day.getUTCFullYear(),
      day.getUTCMonth(),
      day.getUTCDate() - day.getUTCDay(),
    ),
  );
}

export function recentUpdates(items: SummaryRow[], limit = 6) {
  return items
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit);
}

export function priorityBreakdown(items: SummaryRow[]) {
  const counts = Object.fromEntries(
    ITEM_PRIORITIES.map((priority) => [priority, 0]),
  ) as Record<ItemPriority, number>;
  for (const item of items) {
    const key = item.priority as ItemPriority;
    if (key in counts) counts[key] += 1;
  }
  const total = items.length || 1;
  return ITEM_PRIORITIES.map((priority) => ({
    priority,
    label: PRIORITY_LABEL[priority],
    count: counts[priority],
    percent: Math.round((counts[priority] / total) * 100),
  }));
}

export function summaryStats(items: SummaryRow[], now: Date) {
  const open = items.filter((item) => item.status !== "done").length;
  const overdue = items.filter(
    (item) => isOverdue(item.dueOn, item.status, now),
  ).length;
  const critical = items.filter((item) => item.priority === "critical").length;
  const done = items.filter((item) => item.status === "done").length;
  return { total: items.length, open, overdue, critical, done };
}
