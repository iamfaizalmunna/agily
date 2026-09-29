"use client";

import { useEffect, useState } from "react";
import {
  parseRecentBoards,
  RECENT_BOARDS_KEY,
  recentBoardsForTeam,
  type HubProject,
  type RecentBoard,
} from "@/lib/hub/board-hub";
import { MobileBoardHub } from "@/components/hub/mobile-board-hub";

export function PulseBoardHub({
  slug,
  projects,
  mayCreate,
}: {
  slug: string;
  projects: HubProject[];
  mayCreate: boolean;
}) {
  const [recentBoards, setRecentBoards] = useState<RecentBoard[]>([]);

  useEffect(() => {
    setRecentBoards(
      recentBoardsForTeam(
        parseRecentBoards(localStorage.getItem(RECENT_BOARDS_KEY)),
        slug,
      ),
    );
  }, [slug]);

  return (
    <MobileBoardHub
      slug={slug}
      projects={projects}
      recentBoards={recentBoards}
      mayCreate={mayCreate}
    />
  );
}
