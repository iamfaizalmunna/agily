export const LABEL_PALETTE = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
] as const;

export type LabelChip = {
  id: string;
  name: string;
  color: string;
};

export function normalizeLabelColor(raw: string | undefined | null) {
  const hex = String(raw ?? "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toLowerCase();
  return LABEL_PALETTE[0];
}

export function parseLabelName(raw: string) {
  const name = raw.trim();
  if (!name) return { error: "Label needs a name" as const };
  if (name.length > 30) return { error: "Name is too long" as const };
  return { name };
}

export function parseLabelIdsQuery(raw: string | undefined | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function labelIdsQueryValue(ids: string[] | undefined) {
  if (!ids?.length) return undefined;
  return ids.join(",");
}

export function toggleLabelFilter(
  current: string[] | undefined,
  labelId: string,
): string[] {
  const set = new Set(current ?? []);
  if (set.has(labelId)) set.delete(labelId);
  else set.add(labelId);
  return [...set];
}

export function itemMatchesLabelFilter(
  itemLabelIds: string[],
  filterIds: string[] | undefined,
) {
  if (!filterIds?.length) return true;
  return filterIds.some((id) => itemLabelIds.includes(id));
}

export function collectLabelIds(formData: FormData) {
  return formData
    .getAll("labelIds")
    .map((value) => String(value))
    .filter(Boolean);
}

export function mapLabelChips(
  rows: { label: { id: string; name: string; color: string } }[],
): LabelChip[] {
  return rows.map((row) => ({
    id: row.label.id,
    name: row.label.name,
    color: row.label.color,
  }));
}

export function labelIdsFromRows(
  rows: { labelId: string }[],
): string[] {
  return rows.map((row) => row.labelId);
}

export function labelContrastText(color: string) {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return "#ffffff";
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#0f172a" : "#ffffff";
}
