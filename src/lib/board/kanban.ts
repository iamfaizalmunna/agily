import {
  ITEM_STATUSES,
  isItemStatus,
  type ItemStatus,
} from "@/lib/items/status";
import { PRIORITY_LABEL, isItemPriority, type ItemPriority } from "@/lib/items/priority";
import {
  defaultWorkflow,
  isWorkflowStatus,
  visibleWorkflowStatuses,
  type Workflow,
} from "@/lib/workflow/workflow";

export const SWIMLANE_MODES = ["none", "assignee", "priority"] as const;
export type SwimlaneMode = (typeof SWIMLANE_MODES)[number];

export const UNASSIGNED_LANE = "__unassigned__";

/** Soft WIP limits per status column (R1 defaults). */
export const DEFAULT_WIP_LIMITS: Partial<Record<ItemStatus, number>> = {
  doing: 4,
  review: 3,
};

export type BoardDisplayPrefs = {
  swimlane: SwimlaneMode;
  hideDone: boolean;
  compact: boolean;
};

export type KanbanTicket = {
  id: string;
  status: string;
  position: number;
  priority: string;
  people: { id: string; name: string }[];
};

export function parseSwimlaneMode(raw: string | undefined | null): SwimlaneMode {
  if (raw === "assignee" || raw === "priority") return raw;
  return "none";
}

export function parseBoardDisplayPrefs(
  query: Record<string, string | undefined>,
): BoardDisplayPrefs {
  return {
    swimlane: parseSwimlaneMode(query.lane),
    hideDone: query.hideDone === "1",
    compact: query.compact === "1",
  };
}

export function boardDisplayQuery(prefs: BoardDisplayPrefs): Record<string, string> {
  const out: Record<string, string> = {};
  if (prefs.swimlane !== "none") out.lane = prefs.swimlane;
  if (prefs.hideDone) out.hideDone = "1";
  if (prefs.compact) out.compact = "1";
  return out;
}

export function visibleKanbanStatuses(
  hideDone: boolean,
  workflow: Workflow = defaultWorkflow(),
): readonly string[] {
  return visibleWorkflowStatuses(workflow, hideDone);
}

export function sortKanbanColumn<T extends { position: number; id: string }>(
  items: T[],
): T[] {
  return items.slice().sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return a.id.localeCompare(b.id);
  });
}

export function groupByWorkflowSorted<T extends KanbanTicket>(
  items: T[],
  workflow: Workflow = defaultWorkflow(),
) {
  const statuses = workflow.statuses.map((row) => row.id);
  const columns = Object.fromEntries(
    statuses.map((status) => [status, [] as T[]]),
  ) as Record<string, T[]>;
  for (const item of items) {
    if (isWorkflowStatus(workflow, item.status)) {
      columns[item.status].push(item);
    }
  }
  for (const status of statuses) {
    columns[status] = sortKanbanColumn(columns[status]);
  }
  return columns;
}

export function groupByStatusSorted<T extends KanbanTicket>(items: T[]) {
  return groupByWorkflowSorted(items, defaultWorkflow());
}

export function wipLimitFor(
  status: string,
  limits: Partial<Record<string, number>> = DEFAULT_WIP_LIMITS,
) {
  return limits[status];
}

export function isOverWip(count: number, limit: number | undefined) {
  if (limit === undefined) return false;
  return count > limit;
}

export function swimlaneKey(item: KanbanTicket, mode: SwimlaneMode): string {
  if (mode === "none") return "";
  if (mode === "priority") {
    return isItemPriority(item.priority) ? item.priority : "minor";
  }
  const first = item.people[0];
  return first?.id ?? UNASSIGNED_LANE;
}

export function swimlaneLabel(key: string, mode: SwimlaneMode): string {
  if (mode === "priority") {
    return isItemPriority(key) ? PRIORITY_LABEL[key as ItemPriority] : key;
  }
  if (key === UNASSIGNED_LANE) return "Unassigned";
  return key;
}

export type SwimlaneRow<T extends KanbanTicket> = {
  key: string;
  label: string;
  items: T[];
};

export function groupSwimlanes<T extends KanbanTicket>(
  items: T[],
  mode: SwimlaneMode,
  nameByUserId?: Map<string, string>,
): SwimlaneRow<T>[] {
  if (mode === "none") {
    return [{ key: "", label: "", items }];
  }
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = swimlaneKey(item, mode);
    const bucket = map.get(key);
    if (bucket) bucket.push(item);
    else map.set(key, [item]);
  }
  const rows: SwimlaneRow<T>[] = [];
  for (const [key, laneItems] of map) {
    const label =
      mode === "assignee" && key !== UNASSIGNED_LANE
        ? (nameByUserId?.get(key) ?? key)
        : swimlaneLabel(key, mode);
    rows.push({ key, label, items: laneItems });
  }
  rows.sort((a, b) => a.label.localeCompare(b.label));
  const unassigned = rows.findIndex((row) => row.key === UNASSIGNED_LANE);
  if (unassigned > 0) {
    const [row] = rows.splice(unassigned, 1);
    rows.unshift(row);
  }
  return rows;
}
