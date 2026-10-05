/* c8 ignore next */
import type { Workflow } from "@/lib/workflow/workflow";
import { workflowStatusLabel } from "@/lib/workflow/workflow";

/** Tailwind `md` breakpoint — board mobile layout below this width. */
export const KANBAN_MOBILE_MAX_PX = 768;

export function effectiveKanbanCompact(
  compactQuery: string | undefined,
  isMobile: boolean,
): boolean {
  if (compactQuery === "1") return true;
  if (compactQuery === "0") return false;
  return isMobile;
}

export function kanbanColumnStripClass(extra?: string) {
  return [
    "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2",
    "md:mx-0 md:snap-none md:overflow-visible md:px-0",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function kanbanColumnClass(extra?: string) {
  return [
    "w-[min(85vw,18rem)] shrink-0 snap-center md:w-72",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export type MoveStatusChoice = { id: string; label: string };

/* c8 ignore next */
export function kanbanMoveTargets(
  workflow: Workflow,
  statuses: readonly string[],
  currentStatus: string,
): MoveStatusChoice[] {
  return statuses
    .filter((id) => id !== currentStatus)
    .map((id) => ({
      id,
      label: workflowStatusLabel(workflow, id),
    }));
}
