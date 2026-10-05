/* c8 ignore next */
export const ISSUE_TYPES = ["task", "bug", "story", "epic", "milestone"] as const;
export type IssueType = (typeof ISSUE_TYPES)[number];

export const ISSUE_TYPE_LABEL: Record<IssueType, string> = {
  task: "Task",
  bug: "Bug",
  story: "Story",
  epic: "Epic",
  milestone: "Milestone",
};

export const DEFAULT_ISSUE_TYPE: IssueType = "task";

export function isIssueType(value: string): value is IssueType {
  return (ISSUE_TYPES as readonly string[]).includes(value);
}

/* c8 ignore next */
export function parseIssueType(raw: string | undefined | null): IssueType {
  if (raw && isIssueType(raw)) return raw;
  return DEFAULT_ISSUE_TYPE;
}
