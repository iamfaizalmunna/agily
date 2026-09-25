import type { ItemPriority } from "@/lib/items/priority";

export type PriorityTone = {
  dot: string;
  label: string;
  ring: string;
};

export const PRIORITY_TONE: Record<ItemPriority, PriorityTone> = {
  trivial: {
    dot: "bg-slate-400",
    label: "text-slate-600",
    ring: "ring-slate-300",
  },
  minor: {
    dot: "bg-blue-500",
    label: "text-blue-700",
    ring: "ring-blue-200",
  },
  major: {
    dot: "bg-amber-500",
    label: "text-amber-700",
    ring: "ring-amber-200",
  },
  critical: {
    dot: "bg-red-500",
    label: "text-red-700",
    ring: "ring-red-200",
  },
};

export function priorityTone(priority: string): PriorityTone {
  if (priority in PRIORITY_TONE) {
    return PRIORITY_TONE[priority as ItemPriority];
  }
  return PRIORITY_TONE.minor;
}
