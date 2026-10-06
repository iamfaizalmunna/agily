"use client";

import { useState } from "react";
import { mobileBottomNavClass } from "@/lib/ui/mobile";
import { unreadBadge } from "@/lib/notices/notices";
import {
  mobileBoardsHref,
  mobileNavBoardsActive,
  mobileNavHomeActive,
  mobileNavInboxActive,
} from "@/lib/chrome/mobile-nav";
import { MobileNavItem } from "@/components/chrome/mobile-nav-item";
import { MobileCreateSheet } from "@/components/chrome/mobile-create-sheet";
import { MobileMoreSheet } from "@/components/chrome/mobile-more-sheet";
import type { QuickCreateTarget } from "@/lib/create/quick-create";
import type { TeamRole } from "@/lib/rbac/roles";

type TeamMark = { name: string; slug: string; role: TeamRole };

export function MobileBottomNav({
  path,
  slug,
  projectSlug,
  unread,
  noticesHref,
  teams,
  userName,
  userEmail,
  onOpenLens,
  quickCreateProjects,
  canCreateBoard,
}: {
  path: string;
  slug?: string;
  projectSlug?: string;
  unread: number;
  noticesHref: string;
  teams: TeamMark[];
  userName: string;
  userEmail: string;
  onOpenLens: () => void;
  quickCreateProjects: QuickCreateTarget[];
  canCreateBoard: boolean;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const badge = unreadBadge(unread);
  const homeHref = slug ? `/t/${slug}` : "/home";
  const boardsHref = slug ? mobileBoardsHref(slug) : "/home";
  return (
    <>
      <nav className={mobileBottomNavClass()} aria-label="Main">
        <MobileNavItem
          href={homeHref}
          label="Home"
          icon="nav.home"
          active={mobileNavHomeActive(path, slug)}
        />
        {slug ? (
          <MobileNavItem
            href={boardsHref}
            label="Boards"
            icon="nav.board"
            active={mobileNavBoardsActive(path, slug)}
          />
        ) : null}
        {slug ? (
          <MobileNavItem
            label="Create"
            icon="action.plus"
            onClick={() => setCreateOpen(true)}
          />
        ) : null}
        <MobileNavItem
          href={noticesHref}
          label="Inbox"
          icon="nav.inbox"
          active={mobileNavInboxActive(path)}
          badge={badge}
        />
        <MobileNavItem
          label="More"
          icon="nav.more"
          onClick={() => setMoreOpen(true)}
        />
      </nav>
      {slug ? (
        <MobileCreateSheet
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          slug={slug}
          projects={quickCreateProjects}
          canCreateBoard={canCreateBoard}
          currentProjectSlug={projectSlug}
        />
      ) : null}
      <MobileMoreSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        slug={slug}
        teams={teams}
        userName={userName}
        userEmail={userEmail}
        onOpenLens={() => {
          setMoreOpen(false);
          onOpenLens();
        }}
      />
    </>
  );
}
