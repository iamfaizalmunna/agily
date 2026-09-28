export const ITEM_EVENT_KINDS = [
  "status",
  "priority",
  "due",
  "assignee",
] as const;

export type ItemEventKind = (typeof ITEM_EVENT_KINDS)[number];

export function isItemEventKind(
  value: string | null | undefined,
): value is ItemEventKind {
  return (ITEM_EVENT_KINDS as readonly string[]).includes(value ?? "");
}

export type ItemSnapshot = {
  status: string;
  priority: string;
  dueOn: Date | null;
  assigneeIds: string[];
};

export type ItemEventDraft = {
  kind: ItemEventKind;
  fromValue: string | null;
  toValue: string | null;
};

export function formatDueValue(dueOn: Date | null) {
  if (!dueOn) return "";
  return dueOn.toISOString().slice(0, 10);
}

export function formatAssigneeValue(ids: string[], nameById: Map<string, string>) {
  if (!ids.length) return "Unassigned";
  return ids
    .map((id) => nameById.get(id) ?? "Someone")
    .sort((a, b) => a.localeCompare(b))
    .join(", ");
}

export function diffItemEvents(
  before: ItemSnapshot,
  after: ItemSnapshot,
  nameById: Map<string, string>,
): ItemEventDraft[] {
  const rows: ItemEventDraft[] = [];
  if (before.status !== after.status) {
    rows.push({
      kind: "status",
      fromValue: before.status,
      toValue: after.status,
    });
  }
  if (before.priority !== after.priority) {
    rows.push({
      kind: "priority",
      fromValue: before.priority,
      toValue: after.priority,
    });
  }
  const beforeDue = formatDueValue(before.dueOn);
  const afterDue = formatDueValue(after.dueOn);
  if (beforeDue !== afterDue) {
    rows.push({
      kind: "due",
      fromValue: beforeDue || null,
      toValue: afterDue || null,
    });
  }
  const beforeAssignees = [...before.assigneeIds].sort().join(",");
  const afterAssignees = [...after.assigneeIds].sort().join(",");
  if (beforeAssignees !== afterAssignees) {
    rows.push({
      kind: "assignee",
      fromValue: formatAssigneeValue(before.assigneeIds, nameById),
      toValue: formatAssigneeValue(after.assigneeIds, nameById),
    });
  }
  return rows;
}

export function eventFieldLabel(kind: ItemEventKind) {
  if (kind === "status") return "Status";
  if (kind === "priority") return "Priority";
  if (kind === "due") return "Due date";
  return "Assignees";
}

export function formatEventSentence(
  actorName: string,
  kind: ItemEventKind,
  fromValue: string | null,
  toValue: string | null,
) {
  const field = eventFieldLabel(kind);
  const from = fromValue?.trim() || "—";
  const to = toValue?.trim() || "—";
  return `${actorName} changed ${field} from ${from} to ${to}`;
}
