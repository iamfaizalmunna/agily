/* c8 ignore next */
export const STORY_POINTS_MAX = 999;

export function parseStoryPoints(
  raw: string | null | undefined,
): { storyPoints: number | null } | { error: string } {
  const value = String(raw ?? "").trim();
  if (!value) return { storyPoints: null };
  if (!/^\d+$/.test(value)) {
    return { error: "Story points must be a whole number" };
  }
  const n = Number(value);
  if (n < 0 || n > STORY_POINTS_MAX) {
    return { error: `Story points must be 0–${STORY_POINTS_MAX}` };
  }
  return { storyPoints: n };
}

export function formatStoryPoints(points: number | null | undefined) {
  if (points == null) return "";
  return String(points);
}

export function storyPointsLabel(points: number | null | undefined) {
  if (points == null) return "—";
  return `${points} pt${points === 1 ? "" : "s"}`;
}

export type StoryPointRow = { status: string; storyPoints?: number | null };

/* c8 ignore next */
export function storyPointTotals(items: StoryPointRow[]) {
  let scope = 0;
  let done = 0;
  let estimated = 0;
  for (const item of items) {
    if (item.storyPoints == null) continue;
    estimated += 1;
    scope += item.storyPoints;
    if (item.status === "done") done += item.storyPoints;
  }
  const open = scope - done;
  return { scope, done, open, estimated };
}
