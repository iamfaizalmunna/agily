export const ITEM_STATUSES = [
  "backlog",
  "ready",
  "doing",
  "review",
  "done",
] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];

export const STATUS_LABEL: Record<ItemStatus, string> = {
  backlog: "Backlog",
  ready: "Ready",
  doing: "Doing",
  review: "Review",
  done: "Done",
};

export function isItemStatus(value: string): value is ItemStatus {
  return (ITEM_STATUSES as readonly string[]).includes(value);
}

export function nextStatus(current: ItemStatus): ItemStatus {
  const index = ITEM_STATUSES.indexOf(current);
  return ITEM_STATUSES[Math.min(index + 1, ITEM_STATUSES.length - 1)]!;
}

export function prevStatus(current: ItemStatus): ItemStatus {
  const index = ITEM_STATUSES.indexOf(current);
  return ITEM_STATUSES[Math.max(index - 1, 0)]!;
}
