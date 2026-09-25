import type { IssueType } from "@/lib/items/issue-type";
import { isIssueType } from "@/lib/items/issue-type";

export type HierarchyNode = {
  id: string;
  parentId: string | null;
  type: string;
  status: string;
  title: string;
};

export function validateParentLink(
  item: { id: string; type: IssueType },
  parent: HierarchyNode | null,
): { ok: true } | { error: string } {
  if (!parent) return { ok: true };
  if (item.type === "epic") {
    return { error: "Epics cannot belong to another ticket" };
  }
  if (!isIssueType(parent.type) || parent.type !== "epic") {
    return { error: "Parent must be an epic" };
  }
  if (parent.parentId) {
    return { error: "Only one level of hierarchy (epic → child)" };
  }
  if (parent.id === item.id) {
    return { error: "A ticket cannot be its own parent" };
  }
  return { ok: true };
}

export function wouldCreateCycle(
  itemId: string,
  parentId: string,
  nodes: Map<string, HierarchyNode>,
) {
  let cursor: string | null = parentId;
  while (cursor) {
    if (cursor === itemId) return true;
    cursor = nodes.get(cursor)?.parentId ?? null;
  }
  return false;
}

export function openChildCount(children: Pick<HierarchyNode, "status">[]) {
  return children.filter((child) => child.status !== "done").length;
}

export type EpicRollup = {
  id: string;
  title: string;
  openChildren: number;
  totalChildren: number;
};

export function epicRollups(items: HierarchyNode[]) {
  const epics = items.filter((item) => item.type === "epic");
  const byParent = new Map<string, HierarchyNode[]>();
  for (const item of items) {
    if (!item.parentId) continue;
    const bucket = byParent.get(item.parentId);
    if (bucket) bucket.push(item);
    else byParent.set(item.parentId, [item]);
  }
  return epics.map((epic) => {
    const children = byParent.get(epic.id) ?? [];
    return {
      id: epic.id,
      title: epic.title,
      openChildren: openChildCount(children),
      totalChildren: children.length,
    };
  });
}

export function itemUnderEpic(item: Pick<HierarchyNode, "parentId">, epicId: string) {
  return item.parentId === epicId;
}
