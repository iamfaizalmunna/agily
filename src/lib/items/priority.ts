export const ITEM_PRIORITIES = [
  "trivial",
  "minor",
  "major",
  "critical",
] as const;

export type ItemPriority = (typeof ITEM_PRIORITIES)[number];

export const DEFAULT_ITEM_PRIORITY: ItemPriority = "minor";

export const PRIORITY_LABEL: Record<ItemPriority, string> = {
  trivial: "Trivial",
  minor: "Minor",
  major: "Major",
  critical: "Critical",
};

export function isItemPriority(value: string): value is ItemPriority {
  return (ITEM_PRIORITIES as readonly string[]).includes(value);
}

export function parseItemPriority(
  raw: string | null | undefined,
): ItemPriority {
  if (raw && isItemPriority(raw)) return raw;
  return DEFAULT_ITEM_PRIORITY;
}
