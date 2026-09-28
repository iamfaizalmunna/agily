import { formatIssueKey } from "@/lib/items/issue-key";

export type SearchableTicket = {
  id: string;
  title: string;
  projectSlug: string;
  position: number;
  labelNames: string[];
};

export function normalizeSearchQuery(raw: string) {
  return raw.trim().toLowerCase();
}

export function ticketIssueKey(row: SearchableTicket) {
  return formatIssueKey(row.projectSlug, row.position);
}

export function matchesTicketSearch(
  query: string,
  row: SearchableTicket,
) {
  const q = normalizeSearchQuery(query);
  if (!q) return true;
  const key = ticketIssueKey(row).toLowerCase();
  if (row.title.toLowerCase().includes(q)) return true;
  if (key.includes(q)) return true;
  return row.labelNames.some((name) => name.toLowerCase().includes(q));
}

export function rankSearchHits(query: string, rows: SearchableTicket[]) {
  const q = normalizeSearchQuery(query);
  if (!q) return rows;
  const scored = rows
    .filter((row) => matchesTicketSearch(q, row))
    .map((row) => {
      const key = ticketIssueKey(row).toLowerCase();
      const title = row.title.toLowerCase();
      let score = 0;
      if (key === q) score += 100;
      else if (key.startsWith(q)) score += 60;
      if (title === q) score += 80;
      else if (title.startsWith(q)) score += 40;
      else if (title.includes(q)) score += 20;
      if (row.labelNames.some((name) => name.toLowerCase().includes(q))) {
        score += 15;
      }
      return { row, score };
    });
  return scored
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.row);
}

export function matchesActionLabel(query: string, label: string) {
  const q = normalizeSearchQuery(query);
  if (!q) return true;
  return label.toLowerCase().includes(q);
}
