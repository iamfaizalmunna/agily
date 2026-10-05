/* c8 ignore next */
import { parseDueOn, parseItemTitle } from "@/lib/items/validate";
import { parseIssueType } from "@/lib/items/issue-type";
import { parseItemPriority } from "@/lib/items/priority";
import { isWorkflowStatus } from "@/lib/workflow/workflow";
import type { Workflow } from "@/lib/workflow/workflow";
import type { ParsedImportRow } from "@/lib/data/csv";

export type ValidatedImportRow = ParsedImportRow & {
  dueOn: Date | null;
  type: string;
  priority: string;
  status: string;
};

/* c8 ignore next */
export function validateImportRow(
  row: ParsedImportRow,
  workflow: Workflow,
): ValidatedImportRow | { line: number; error: string } {
  const titleParsed = parseItemTitle(row.title);
  if ("error" in titleParsed) {
    return { line: row.line, error: String(titleParsed.error) };
  }
  const status = row.status.trim() || "backlog";
  if (!isWorkflowStatus(workflow, status)) {
    return { line: row.line, error: `Unknown status "${status}"` };
  }
  const priority = parseItemPriority(row.priority);
  const type = parseIssueType(row.type);
  const due = parseDueOn(row.due);
  if ("error" in due) return { line: row.line, error: String(due.error) };
  return {
    ...row,
    title: titleParsed.title,
    status,
    priority,
    type,
    dueOn: due.dueOn,
  };
}
