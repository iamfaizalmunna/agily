import {
  itemMatchesLabelFilter,
  labelIdsQueryValue,
  parseLabelIdsQuery,
  toggleLabelFilter,
} from "@/lib/labels/labels";
import { hasOpenSubtasks } from "@/lib/subtasks/subtasks";
import { isItemPriority, type ItemPriority } from "@/lib/items/priority";
import { isItemStatus, type ItemStatus } from "@/lib/items/status";
import { dueDayKey, isOverdue, startOfUtcDay } from "@/lib/views/views";

export const LENS_KINDS = [
  "mine",
  "overdue",
  "unassigned",
  "week",
  "checklist",
] as const;
export type LensKind = (typeof LENS_KINDS)[number];

export const LENS_KIND_LABEL: Record<LensKind, string> = {
  mine: "Mine",
  overdue: "Overdue",
  unassigned: "Unassigned",
  week: "This week",
  checklist: "Open checklists",
};

export type LensSpec = {
  kind?: LensKind;
  status?: ItemStatus;
  personId?: string;
  priority?: ItemPriority;
  find?: string;
  labelIds?: string[];
};

export type LensItem = {
  title: string;
  status: string;
  priority: string;
  dueOn: Date | null;
  assigneeIds: string[];
  labelIds: string[];
  subtasks: { done: boolean }[];
};

export function isLensKind(value: string | undefined | null): value is LensKind {
  return (LENS_KINDS as readonly string[]).includes(value ?? "");
}

export function sanitizeLensSpec(raw: Partial<LensSpec> | null | undefined): LensSpec {
  const spec: LensSpec = {};
  if (raw && isLensKind(raw.kind)) spec.kind = raw.kind;
  if (raw && typeof raw.status === "string" && isItemStatus(raw.status)) {
    spec.status = raw.status;
  }
  if (raw && typeof raw.personId === "string" && raw.personId.trim()) {
    spec.personId = raw.personId.trim();
  }
  if (raw && typeof raw.priority === "string" && isItemPriority(raw.priority)) {
    spec.priority = raw.priority;
  }
  if (raw && typeof raw.find === "string" && raw.find.trim()) {
    spec.find = raw.find.trim().slice(0, 80);
  }
  if (raw && Array.isArray(raw.labelIds)) {
    const labelIds = raw.labelIds
      .filter((id): id is string => typeof id === "string" && Boolean(id.trim()))
      .map((id) => id.trim())
      .slice(0, 12);
    if (labelIds.length) spec.labelIds = labelIds;
  }
  return spec;
}

export function parseLensSpec(raw: string | undefined | null): LensSpec {
  if (!raw?.trim()) return {};
  try {
    return sanitizeLensSpec(JSON.parse(raw) as Partial<LensSpec>);
  } catch {
    return {};
  }
}

export function stringifyLensSpec(spec: LensSpec) {
  return JSON.stringify(sanitizeLensSpec(spec));
}

export function isEmptyLens(spec: LensSpec) {
  const clean = sanitizeLensSpec(spec);
  return (
    !clean.kind &&
    !clean.status &&
    !clean.personId &&
    !clean.priority &&
    !clean.find &&
    !clean.labelIds?.length
  );
}

export function sameLensSpec(a: LensSpec, b: LensSpec) {
  const left = sanitizeLensSpec(a);
  const right = sanitizeLensSpec(b);
  return (
    left.kind === right.kind &&
    left.status === right.status &&
    left.personId === right.personId &&
    left.priority === right.priority &&
    left.find === right.find &&
    JSON.stringify(left.labelIds ?? []) === JSON.stringify(right.labelIds ?? [])
  );
}

export function parseLensName(raw: string) {
  const name = raw.trim();
  if (!name) return { error: "Lens needs a name" as const };
  if (name.length > 40) return { error: "Name is too long" as const };
  return { name };
}

export function parseLensQuery(input: {
  q?: string | undefined;
  status?: string | undefined;
  who?: string | undefined;
  priority?: string | undefined;
  find?: string | undefined;
  labels?: string | undefined;
}): LensSpec {
  return sanitizeLensSpec({
    kind: isLensKind(input.q) ? input.q : undefined,
    status: input.status as ItemStatus | undefined,
    personId: input.who,
    priority: input.priority as ItemPriority | undefined,
    find: input.find,
    labelIds: parseLabelIdsQuery(input.labels),
  });
}

export function lensQueryRecord(
  spec: LensSpec,
  savedId?: string,
): Record<string, string> {
  if (savedId) return { lens: savedId };
  const clean = sanitizeLensSpec(spec);
  const out: Record<string, string> = {};
  if (clean.kind) out.q = clean.kind;
  if (clean.status) out.status = clean.status;
  if (clean.personId) out.who = clean.personId;
  if (clean.priority) out.priority = clean.priority;
  if (clean.find) out.find = clean.find;
  const labels = labelIdsQueryValue(clean.labelIds);
  if (labels) out.labels = labels;
  return out;
}

export function toggleLensKind(spec: LensSpec, kind: LensKind): LensSpec {
  return sanitizeLensSpec({
    ...spec,
    kind: spec.kind === kind ? undefined : kind,
  });
}

export function toggleLensStatus(spec: LensSpec, status: ItemStatus): LensSpec {
  return sanitizeLensSpec({
    ...spec,
    status: spec.status === status ? undefined : status,
  });
}

export function toggleLensPerson(spec: LensSpec, personId: string): LensSpec {
  return sanitizeLensSpec({
    ...spec,
    personId: spec.personId === personId ? undefined : personId,
  });
}

export function pickLensKind(spec: LensSpec, kind?: LensKind): LensSpec {
  return sanitizeLensSpec({ ...spec, kind });
}

export function pickLensStatus(spec: LensSpec, status?: ItemStatus): LensSpec {
  return sanitizeLensSpec({ ...spec, status });
}

export function pickLensPerson(spec: LensSpec, personId?: string): LensSpec {
  return sanitizeLensSpec({ ...spec, personId });
}

export function pickLensPriority(
  spec: LensSpec,
  priority?: ItemPriority,
): LensSpec {
  return sanitizeLensSpec({ ...spec, priority });
}

export function toggleLensLabel(spec: LensSpec, labelId: string): LensSpec {
  const next = toggleLabelFilter(spec.labelIds, labelId);
  return sanitizeLensSpec({
    ...spec,
    labelIds: next.length ? next : undefined,
  });
}

export function withLensFind(spec: LensSpec, find: string): LensSpec {
  const trimmed = find.trim();
  return sanitizeLensSpec({
    ...spec,
    find: trimmed ? trimmed.slice(0, 80) : undefined,
  });
}

export function startOfUtcWeek(now: Date) {
  const day = startOfUtcDay(now);
  return new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() - day.getUTCDay()),
  );
}

export function endOfUtcWeek(now: Date) {
  const start = startOfUtcWeek(now);
  return new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + 6),
  );
}

export function isDueThisWeek(dueOn: Date | null | undefined, now: Date) {
  if (!dueOn) return false;
  const key = dueDayKey(dueOn)!;
  const start = startOfUtcWeek(now).toISOString().slice(0, 10);
  const end = endOfUtcWeek(now).toISOString().slice(0, 10);
  return key >= start && key <= end;
}

export function titleMatchesFind(title: string, find: string) {
  return title.toLowerCase().includes(find.toLowerCase());
}

export function itemMatchesLens(
  item: LensItem,
  spec: LensSpec,
  ctx: { userId: string; now: Date },
) {
  const clean = sanitizeLensSpec(spec);
  if (clean.kind === "mine" && !item.assigneeIds.includes(ctx.userId)) {
    return false;
  }
  if (clean.kind === "overdue" && !isOverdue(item.dueOn, item.status, ctx.now)) {
    return false;
  }
  if (clean.kind === "unassigned" && item.assigneeIds.length > 0) {
    return false;
  }
  if (clean.kind === "week" && !isDueThisWeek(item.dueOn, ctx.now)) {
    return false;
  }
  if (clean.kind === "checklist" && !hasOpenSubtasks(item.subtasks)) {
    return false;
  }
  if (clean.status && item.status !== clean.status) return false;
  if (clean.personId && !item.assigneeIds.includes(clean.personId)) return false;
  if (clean.priority && item.priority !== clean.priority) return false;
  if (clean.find && !titleMatchesFind(item.title, clean.find)) return false;
  if (!itemMatchesLabelFilter(item.labelIds, clean.labelIds)) return false;
  return true;
}

export function filterItemsByLens<T extends LensItem>(
  items: T[],
  spec: LensSpec,
  ctx: { userId: string; now: Date },
) {
  if (isEmptyLens(sanitizeLensSpec(spec))) return items;
  return items.filter((item) => itemMatchesLens(item, spec, ctx));
}
