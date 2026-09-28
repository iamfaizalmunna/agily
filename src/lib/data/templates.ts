import { isIssueType, type IssueType } from "@/lib/items/issue-type";
import { isItemPriority, type ItemPriority } from "@/lib/items/priority";

export type TicketTemplate = {
  id: string;
  name: string;
  type: IssueType;
  title: string;
  body: string;
  priority: ItemPriority;
};

export const DEFAULT_TICKET_TEMPLATES: TicketTemplate[] = [
  {
    id: "tpl_bug",
    name: "Bug report",
    type: "bug",
    title: "Bug: ",
    body: "## Steps\n\n1. \n\n## Expected\n\n## Actual\n",
    priority: "major",
  },
  {
    id: "tpl_story",
    name: "Story",
    type: "story",
    title: "",
    body: "## User story\n\nAs a … I want … so that …\n\n## Acceptance\n\n- [ ] \n",
    priority: "minor",
  },
];

export function resolveTicketTemplates(
  custom: TicketTemplate[] | undefined,
): TicketTemplate[] {
  if (custom?.length) return custom;
  return DEFAULT_TICKET_TEMPLATES;
}

export function findTicketTemplate(
  id: string,
  templates: TicketTemplate[],
): TicketTemplate | undefined {
  return templates.find((row) => row.id === id);
}

export function ticketTemplatesFromTeamSettings(
  settingsJson: string,
): TicketTemplate[] {
  try {
    const parsed = JSON.parse(settingsJson) as { ticketTemplates?: unknown };
    const custom = parseTicketTemplatesFromJson(parsed.ticketTemplates);
    return resolveTicketTemplates(custom ?? undefined);
  } catch {
    return resolveTicketTemplates(undefined);
  }
}

export function parseTicketTemplatesFromJson(raw: unknown): TicketTemplate[] | null {
  if (!Array.isArray(raw)) return null;
  const out: TicketTemplate[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") return null;
    const id = String((row as { id?: unknown }).id ?? "").trim();
    const name = String((row as { name?: unknown }).name ?? "").trim();
    const title = String((row as { title?: unknown }).title ?? "");
    const body = String((row as { body?: unknown }).body ?? "");
    const typeRaw = String((row as { type?: unknown }).type ?? "").trim();
    const priorityRaw = String((row as { priority?: unknown }).priority ?? "").trim();
    if (!isIssueType(typeRaw) || !isItemPriority(priorityRaw)) return null;
    const type = typeRaw;
    const priority = priorityRaw;
    if (!id || !name) return null;
    out.push({ id, name, type, title, body, priority });
  }
  return out.length ? out : null;
}
