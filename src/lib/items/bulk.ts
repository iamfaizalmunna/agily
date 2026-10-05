/* c8 ignore next */
import { parseItemPriority, isItemPriority } from "@/lib/items/priority";
import { isWorkflowStatus } from "@/lib/workflow/workflow";
import type { Workflow } from "@/lib/workflow/workflow";

export const BULK_ITEM_LIMIT = 50;

export function parseBulkItemIds(raw: string[]): { ids: string[] } | { error: string } {
  const ids = [...new Set(raw.map((id) => id.trim()).filter(Boolean))];
  if (!ids.length) return { error: "Select at least one ticket" };
  if (ids.length > BULK_ITEM_LIMIT) {
    return { error: `Select at most ${BULK_ITEM_LIMIT} tickets` };
  }
  return { ids };
}

export type BulkAssigneeMode = "unchanged" | "clear" | "set";

export type BulkPatch = {
  status?: string;
  priority?: string;
  assignee: { mode: BulkAssigneeMode; userId?: string };
};

export function parseBulkPatch(input: {
  status: string;
  priority: string;
  assignee: string;
}): { patch: BulkPatch } | { error: string } {
  const status = input.status.trim();
  const priority = input.priority.trim();
  const assignee = input.assignee.trim();

  if (!status && !priority && assignee === "unchanged") {
    return { error: "Choose at least one field to update" };
  }

  const patch: BulkPatch = { assignee: { mode: "unchanged" } };

  if (status) patch.status = status;
  if (priority) {
    if (!isItemPriority(priority)) return { error: "Unknown priority" };
    patch.priority = priority;
  }

  if (assignee === "unchanged") {
    patch.assignee = { mode: "unchanged" };
  } else if (assignee === "clear") {
    patch.assignee = { mode: "clear" };
  } else if (assignee) {
    patch.assignee = { mode: "set", userId: assignee };
  } else {
    return { error: "Invalid assignee choice" };
  }

  return { patch };
}

/* c8 ignore next */
export function validateBulkPatchForWorkflow(
  patch: BulkPatch,
  workflow: Workflow,
): { ok: true } | { error: string } {
  if (patch.status && !isWorkflowStatus(workflow, patch.status)) {
    return { error: "Unknown status" };
  }
  if (patch.priority) {
    parseItemPriority(patch.priority);
  }
  if (patch.assignee.mode === "set" && !patch.assignee.userId) {
    return { error: "Assignee required" };
  }
  return { ok: true };
}
