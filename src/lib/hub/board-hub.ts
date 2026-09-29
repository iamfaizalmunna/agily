import { parseBoardView, type BoardView } from "@/lib/views/views";

export const RECENT_BOARDS_KEY = "agily-recent-boards";
export const RECENT_BOARD_LIMIT = 6;

export type RecentBoard = {
  teamSlug: string;
  projectSlug: string;
  projectName: string;
  view: BoardView;
  visitedAt: number;
};

export type HubProject = {
  slug: string;
  name: string;
  ticketCount: number;
};

export function parseRecentBoards(raw: string | null): RecentBoard[] {
  if (!raw) return [];
  try {
    const rows = JSON.parse(raw) as RecentBoard[];
    if (!Array.isArray(rows)) return [];
    return rows
      .filter(
        (row) =>
          row &&
          typeof row.teamSlug === "string" &&
          typeof row.projectSlug === "string" &&
          typeof row.projectName === "string" &&
          typeof row.visitedAt === "number",
      )
      .map((row) => ({
        ...row,
        view: parseBoardView(row.view),
      }))
      .slice(0, RECENT_BOARD_LIMIT);
  } catch {
    return [];
  }
}

export function pushRecentBoard(
  current: RecentBoard[],
  entry: Omit<RecentBoard, "visitedAt">,
) {
  const next: RecentBoard = { ...entry, visitedAt: Date.now() };
  const without = current.filter(
    (row) =>
      !(
        row.teamSlug === entry.teamSlug &&
        row.projectSlug === entry.projectSlug
      ),
  );
  return [next, ...without].slice(0, RECENT_BOARD_LIMIT);
}

export function recentBoardsForTeam(recent: RecentBoard[], teamSlug: string) {
  return recent.filter((row) => row.teamSlug === teamSlug);
}

export function filterHubProjects(projects: HubProject[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return projects;
  return projects.filter(
    (project) =>
      project.name.toLowerCase().includes(needle) ||
      project.slug.toLowerCase().includes(needle),
  );
}

export function lastBoardViewForProject(
  recent: RecentBoard[],
  teamSlug: string,
  projectSlug: string,
): BoardView | undefined {
  const row = recent.find(
    (entry) =>
      entry.teamSlug === teamSlug && entry.projectSlug === projectSlug,
  );
  return row?.view;
}
