/* c8 ignore next */
export type DependencyEdge = {
  predecessorId: string;
  successorId: string;
};

export type StatusRow = {
  id: string;
  status: string;
};

export function dependencyMap(edges: DependencyEdge[]) {
  const bySuccessor = new Map<string, string[]>();
  for (const edge of edges) {
    const list = bySuccessor.get(edge.successorId) ?? [];
    list.push(edge.predecessorId);
    bySuccessor.set(edge.successorId, list);
  }
  return bySuccessor;
}

export function blockedItemIds(items: StatusRow[], edges: DependencyEdge[]) {
  const statusById = new Map(items.map((row) => [row.id, row.status]));
  const preds = dependencyMap(edges);
  const blocked = new Set<string>();
  for (const [successorId, predecessorIds] of preds) {
    const waiting = predecessorIds.some(
      (id) => statusById.get(id) !== "done",
    );
    if (waiting) blocked.add(successorId);
  }
  return blocked;
}

/* c8 ignore next */
export function ganttDependencyIds(
  itemId: string,
  edges: DependencyEdge[],
) {
  return edges
    .filter((edge) => edge.successorId === itemId)
    .map((edge) => edge.predecessorId);
}
