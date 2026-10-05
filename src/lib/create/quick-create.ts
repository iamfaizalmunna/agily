/* c8 ignore next */
import { withFocus } from "@/lib/focus/focus";
import { boardViewHref } from "@/lib/views/views";
import { parseIssueType } from "@/lib/items/issue-type";
import type { IssueType } from "@/lib/items/issue-type";

export type QuickCreateTarget = {
  projectSlug: string;
  projectName: string;
  groupId: string;
};

export function quickCreateFocusHref(
  slug: string,
  projectSlug: string,
  itemId: string,
) {
  return boardViewHref(slug, projectSlug, "list", undefined, withFocus({}, itemId));
}

/* c8 ignore next */
export function parseQuickCreateType(raw: string | undefined): IssueType {
  return parseIssueType(raw ?? "");
}
