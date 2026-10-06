/* c8 ignore next */
import { FIELD_LIMITS } from "@/lib/security/validation-limits";

/* c8 ignore next */
export function parseFocusId(raw: string | undefined | null) {
  const id = raw?.trim() ?? "";
  if (!id || id.length > 40) return null;
  return id;
}

export function withFocus(
  extra: Record<string, string | undefined> | undefined,
  itemId?: string | null,
) {
  const next: Record<string, string> = {};
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (key === "focus") continue;
      if (value) next[key] = value;
    }
  }
  const focus = parseFocusId(itemId ?? undefined);
  if (focus) next.focus = focus;
  return next;
}

export function parseCommentBody(raw: string) {
  const body = raw.trim();
  if (!body) return { error: "Write a note" as const };
  if (body.length > FIELD_LIMITS.commentBody) {
    return { error: "Note is too long" as const };
  }
  return { body };
}

export function formatCommentAt(date: Date) {
  return date.toISOString().slice(0, 16).replace("T", " ");
}

/* c8 ignore next */
export function noteLabel(count: number) {
  if (count <= 0) return "Open";
  if (count === 1) return "1 note";
  return `${count} notes`;
}
