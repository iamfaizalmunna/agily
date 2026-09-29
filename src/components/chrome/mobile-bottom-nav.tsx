"use client";

import { useState } from "react";
import {
  Home,
  LayoutGrid,
  Plus,
  Inbox,
  MoreHorizontal,
} from "lucide-react";
import { mobileBottomNavClass } from "@/lib/ui/mobile";
import { unreadBadge } from "@/lib/notices/notices";
import {
  mobileBoardsHref,
  mobileCreateHref,
  mobileNavBoardsActive,
  mobileNavHomeActive,
  mobileNavInboxActive,
} from "@/lib/chrome/mobile-nav";
import { MobileNavItem } from "@/components/chrome/mobile-nav-item";
import { MobileMoreSheet } from "@/components/chrome/mobile-more-sheet";
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
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const badge = unreadBadge(unread);
  const homeHref = slug ? `/t/${slug}` : "/home";
  const boardsHref = slug ? mobileBoardsHref(slug) : "/home";
  const createHref = slug ? mobileCreateHref(slug, projectSlug) : "/home";

  return (
    <>
      <nav className={mobileBottomNavClass()} aria-label="Main">
        <MobileNavItem
          href={homeHref}
          label="Home"
          icon={Home}
          active={mobileNavHomeActive(path, slug)}
        />
        {slug ? (
          <MobileNavItem
            href={boardsHref}
            label="Boards"
            icon={LayoutGrid}
            active={mobileNavBoardsActive(path, slug)}
          />
        ) : null}
        {slug ? (
          <MobileNavItem href={createHref} label="Create" icon={Plus} />
        ) : null}
        <MobileNavItem
          href={noticesHref}
          label="Inbox"
          icon={Inbox}
          active={mobileNavInboxActive(path)}
          badge={badge}
        />
        <MobileNavItem
          label="More"
          icon={MoreHorizontal}
          onClick={() => setMoreOpen(true)}
        />
      </nav>
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
