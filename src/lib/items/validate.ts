/* c8 ignore next */
export function parseItemTitle(raw: string) {
  const title = raw.trim();
  if (!title) return { error: "Title is required" as const };
  if (title.length > 160) return { error: "Title is too long" as const };
  return { title };
}

export function parseDueOn(raw: string | null | undefined) {
  if (!raw || !raw.trim()) return { dueOn: null };
  const value = raw.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return { error: "Due date must be YYYY-MM-DD" as const };
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const dueOn = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  if (
    dueOn.getUTCFullYear() !== year ||
    dueOn.getUTCMonth() !== month - 1 ||
    dueOn.getUTCDate() !== day
  ) {
    return { error: "Due date is not a real day" as const };
  }
  return { dueOn };
}

/* c8 ignore next */
export function formatDueOn(dueOn: Date | null | undefined) {
  if (!dueOn) return "";
  return dueOn.toISOString().slice(0, 10);
}
