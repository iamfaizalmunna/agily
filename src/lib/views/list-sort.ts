import {
  isItemPriority,
  ITEM_PRIORITIES,
  type ItemPriority,
} from "@/lib/items/priority";

export const LIST_SORT_FIELDS = ["due", "priority", "updated", "key"] as const;
export type ListSortField = (typeof LIST_SORT_FIELDS)[number];

export const LIST_SORT_DIRS = ["asc", "desc"] as const;
export type ListSortDir = (typeof LIST_SORT_DIRS)[number];

export const LIST_SORT_LABEL: Record<ListSortField, string> = {
  due: "Due date",
  priority: "Priority",
  updated: "Updated",
  key: "Issue key",
};

export type ListSortConfig = {
  field: ListSortField;
  dir: ListSortDir;
};

export type ListSortItem = {
  id: string;
  position: number;
  priority: string;
  dueOn: Date | null;
  updatedAt: Date;
};

const PRIORITY_RANK = Object.fromEntries(
  ITEM_PRIORITIES.map((level, index) => [level, index]),
) as Record<ItemPriority, number>;

export function isListSortField(value: string): value is ListSortField {
  return (LIST_SORT_FIELDS as readonly string[]).includes(value);
}

export function isListSortDir(value: string): value is ListSortDir {
  return (LIST_SORT_DIRS as readonly string[]).includes(value);
}

export function parseListSort(
  sort: string | undefined | null,
  sortDir: string | undefined | null,
): ListSortConfig | null {
  const field = String(sort ?? "").trim();
  if (!field) return null;
  if (!isListSortField(field)) return null;
  const dirRaw = String(sortDir ?? "").trim();
  const dir = isListSortDir(dirRaw) ? dirRaw : defaultListSortDir(field);
  return { field, dir };
}

export function defaultListSortDir(field: ListSortField): ListSortDir {
  if (field === "priority" || field === "updated") return "desc";
  return "asc";
}

export function nextListSortToggle(
  current: ListSortConfig | null,
  field: ListSortField,
): ListSortConfig {
  if (current?.field === field) {
    return { field, dir: current.dir === "asc" ? "desc" : "asc" };
  }
  return { field, dir: defaultListSortDir(field) };
}

export function listSortQuery(
  config: ListSortConfig | null,
): Record<string, string> {
  if (!config) return {};
  return { sort: config.field, sortDir: config.dir };
}

function priorityValue(raw: string) {
  return isItemPriority(raw) ? PRIORITY_RANK[raw] : -1;
}

function dueValue(dueOn: Date | null) {
  return dueOn ? dueOn.getTime() : Number.POSITIVE_INFINITY;
}

export function sortListItems<T extends ListSortItem>(
  items: T[],
  config: ListSortConfig,
): T[] {
  const dir = config.dir === "asc" ? 1 : -1;
  return items.slice().sort((a, b) => {
    let cmp = 0;
    switch (config.field) {
      case "due":
        cmp = dueValue(a.dueOn) - dueValue(b.dueOn);
        break;
      case "priority":
        cmp = priorityValue(a.priority) - priorityValue(b.priority);
        break;
      case "updated":
        cmp = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      case "key":
        cmp = a.position - b.position;
        break;
    }
    if (cmp === 0) cmp = a.position - b.position;
    return cmp * dir;
  });
}
