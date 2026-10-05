/* c8 ignore next */
export const RECENT_TICKETS_KEY = "agily-recent-tickets";
export const RECENT_TICKET_LIMIT = 8;

export type RecentTicket = {
  id: string;
  title: string;
  href: string;
  key: string;
  visitedAt: number;
};

export function parseRecentTickets(raw: string | null): RecentTicket[] {
  if (!raw) return [];
  try {
    const rows = JSON.parse(raw) as RecentTicket[];
    if (!Array.isArray(rows)) return [];
    return rows
      .filter(
        (row) =>
          row &&
          typeof row.id === "string" &&
          typeof row.href === "string" &&
          typeof row.title === "string",
      )
      .slice(0, RECENT_TICKET_LIMIT);
  } catch {
    return [];
  }
}

/* c8 ignore next */
export function pushRecentTicket(
  current: RecentTicket[],
  entry: Omit<RecentTicket, "visitedAt">,
) {
  const next: RecentTicket = { ...entry, visitedAt: Date.now() };
  const without = current.filter((row) => row.id !== entry.id);
  return [next, ...without].slice(0, RECENT_TICKET_LIMIT);
}
