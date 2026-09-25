import type { ItemStatus } from "@/lib/items/status";

export type StatusTone = {
  dot: string;
  column: string;
  tag: string;
};

/** Jira-style status accents for board columns and tags. */
export const STATUS_TONE: Record<ItemStatus, StatusTone> = {
  backlog: {
    dot: "bg-[var(--status-backlog)]",
    column: "border-t-[var(--status-backlog)]",
    tag: "bg-[color-mix(in_srgb,var(--status-backlog)_14%,transparent)] text-[var(--status-backlog)]",
  },
  ready: {
    dot: "bg-[var(--status-ready)]",
    column: "border-t-[var(--status-ready)]",
    tag: "bg-[color-mix(in_srgb,var(--status-ready)_14%,transparent)] text-[var(--status-ready)]",
  },
  doing: {
    dot: "bg-[var(--status-doing)]",
    column: "border-t-[var(--status-doing)]",
    tag: "bg-[color-mix(in_srgb,var(--status-doing)_14%,transparent)] text-[var(--status-doing)]",
  },
  review: {
    dot: "bg-[var(--status-review)]",
    column: "border-t-[var(--status-review)]",
    tag: "bg-[color-mix(in_srgb,var(--status-review)_14%,transparent)] text-[var(--status-review)]",
  },
  done: {
    dot: "bg-[var(--status-done)]",
    column: "border-t-[var(--status-done)]",
    tag: "bg-[color-mix(in_srgb,var(--status-done)_14%,transparent)] text-[var(--status-done)]",
  },
};

export function statusTone(status: string): StatusTone {
  if (status in STATUS_TONE) {
    return STATUS_TONE[status as ItemStatus];
  }
  return STATUS_TONE.backlog;
}
