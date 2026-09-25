export type SubtaskRow = {
  id: string;
  title: string;
  done: boolean;
  position: number;
};

export function parseSubtaskTitle(raw: string) {
  const title = raw.trim();
  if (!title) return { error: "Checklist item needs text" as const };
  if (title.length > 120) return { error: "Too long" as const };
  return { title };
}

export function subtaskProgress(rows: Pick<SubtaskRow, "done">[]) {
  const total = rows.length;
  if (!total) return { done: 0, total: 0, open: 0, percent: 0 };
  const done = rows.filter((row) => row.done).length;
  const open = total - done;
  const percent = Math.round((done / total) * 100);
  return { done, total, open, percent };
}

export function formatSubtaskProgress(done: number, total: number) {
  if (!total) return "";
  return `${done}/${total}`;
}

export function hasOpenSubtasks(rows: Pick<SubtaskRow, "done">[]) {
  return rows.some((row) => !row.done);
}
