import { ITEM_STATUSES, isItemStatus, type ItemStatus } from "@/lib/items/status";

export const BOARD_VIEWS = [
  "summary",
  "list",
  "flow",
  "orbit",
  "timeline",
] as const;
export type BoardView = (typeof BOARD_VIEWS)[number];

export const BOARD_VIEW_LABEL: Record<BoardView, string> = {
  summary: "Summary",
  list: "List",
  flow: "Board",
  orbit: "Calendar",
  timeline: "Timeline",
};

export function safeStudioNext(
  slug: string,
  fallback: string,
  raw: string | undefined | null,
) {
  if (raw && raw.startsWith(`/t/${slug}`)) return raw;
  return fallback;
}

export function parseBoardView(raw: string | undefined | null): BoardView {
  if (raw === "summary") return "summary";
  if (raw === "list" || raw === "ledger") return "list";
  if (raw === "flow") return "flow";
  if (raw === "orbit") return "orbit";
  if (raw === "timeline") return "timeline";
  return "summary";
}

export function boardViewHref(
  slug: string,
  projectSlug: string,
  view: BoardView,
  yearMonth?: string,
  extra?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  if (view !== "summary") params.set("view", view);
  if (view === "orbit" && yearMonth) params.set("ym", yearMonth);
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
  }
  const q = params.toString();
  return q
    ? `/t/${slug}/p/${projectSlug}?${q}`
    : `/t/${slug}/p/${projectSlug}`;
}

export function startOfUtcDay(now: Date) {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export function dueDayKey(dueOn: Date | null | undefined) {
  if (!dueOn) return null;
  return dueOn.toISOString().slice(0, 10);
}

export function isOverdue(
  dueOn: Date | null | undefined,
  status: string,
  now: Date,
) {
  if (!dueOn || status === "done") return false;
  return dueDayKey(dueOn)! < startOfUtcDay(now).toISOString().slice(0, 10);
}

export type ViewItem = {
  id: string;
  title: string;
  status: string;
  dueOn: Date | null;
  updatedAt: Date;
  assigneeIds: string[];
};

export function pulseBuckets(items: ViewItem[], userId: string, now: Date) {
  const mine = items.filter(
    (item) => item.assigneeIds.includes(userId) && item.status !== "done",
  );
  const overdue = items.filter((item) =>
    isOverdue(item.dueOn, item.status, now),
  );
  const recent = items
    .filter((item) => item.assigneeIds.includes(userId))
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 8);
  return { mine, overdue, recent };
}

export function groupByStatus<T extends { status: string }>(items: T[]) {
  const columns = Object.fromEntries(
    ITEM_STATUSES.map((status) => [status, [] as T[]]),
  ) as Record<ItemStatus, T[]>;
  for (const item of items) {
    if (isItemStatus(item.status)) columns[item.status].push(item);
  }
  return columns;
}

export function flattenBoardItems<T>(groups: { items: T[] }[]) {
  return groups.flatMap((group) => group.items);
}

export function unscheduled<T extends { dueOn: Date | null }>(items: T[]) {
  return items.filter((item) => !item.dueOn);
}

export function itemsOnDay<T extends { dueOn: Date | null }>(
  items: T[],
  key: string,
) {
  return items.filter((item) => dueDayKey(item.dueOn) === key);
}

export function parseYearMonth(raw: string | undefined | null, now = new Date()) {
  const match = raw?.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
  }
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (month < 0 || month > 11) {
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
  }
  return { year, month };
}

export function formatYearMonth(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(Date.UTC(year, month + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

export type MonthCell = {
  key: string;
  day: number;
  inMonth: boolean;
};

export function monthGrid(year: number, month: number): MonthCell[] {
  const first = new Date(Date.UTC(year, month, 1));
  const startPad = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: MonthCell[] = [];
  for (let i = 0; i < startPad; i += 1) {
    const date = new Date(Date.UTC(year, month, -startPad + i + 1));
    cells.push({
      key: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      inMonth: false,
    });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(Date.UTC(year, month, day));
    cells.push({
      key: date.toISOString().slice(0, 10),
      day,
      inMonth: true,
    });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]!;
    const [y, m, d] = last.key.split("-").map(Number);
    const date = new Date(Date.UTC(y!, m! - 1, d! + 1));
    cells.push({
      key: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      inMonth: false,
    });
  }
  return cells;
}
