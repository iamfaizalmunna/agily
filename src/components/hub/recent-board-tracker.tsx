"use client";

import { useEffect } from "react";
import {
  parseRecentBoards,
  pushRecentBoard,
  RECENT_BOARDS_KEY,
} from "@/lib/hub/board-hub";
import type { BoardView } from "@/lib/views/views";

export function RecentBoardTracker({
  teamSlug,
  projectSlug,
  projectName,
  view,
}: {
  teamSlug: string;
  projectSlug: string;
  projectName: string;
  view: BoardView;
}) {
  useEffect(() => {
    const raw = localStorage.getItem(RECENT_BOARDS_KEY);
    const current = parseRecentBoards(raw);
    const next = pushRecentBoard(current, {
      teamSlug,
      projectSlug,
      projectName,
      view,
    });
    localStorage.setItem(RECENT_BOARDS_KEY, JSON.stringify(next));
  }, [teamSlug, projectSlug, projectName, view]);

  return null;
}
