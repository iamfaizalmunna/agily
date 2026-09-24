import { isItemStatus, type ItemStatus } from "@/lib/items/status";
import { dueDayKey, isOverdue, startOfUtcDay } from "@/lib/views/views";

export const LENS_KINDS = ["mine", "overdue", "unassigned", "week"] as const;
export type LensKind = (typeof LENS_KINDS)[number];

export const LENS_KIND_LABEL: Record<LensKind, string> = {
  mine: "Mine",
  overdue: "Overdue",
  unassigned: "Unassigned",
  week: "This week",
};

export type LensSpec = {
  kind?: LensKind;
  status?: ItemStatus;
  personId?: string;
};

export type LensItem = {
  status: string;
  dueOn: Date | null;
  assigneeIds: string[];
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
  return !spec.kind && !spec.status && !spec.personId;
}

export function sameLensSpec(a: LensSpec, b: LensSpec) {
  return a.kind === b.kind && a.status === b.status && a.personId === b.personId;
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
}): LensSpec {
  return sanitizeLensSpec({
    kind: isLensKind(input.q) ? input.q : undefined,
    status: input.status as ItemStatus | undefined,
    personId: input.who,
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
  if (clean.status && item.status !== clean.status) return false;
  if (clean.personId && !item.assigneeIds.includes(clean.personId)) return false;
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
