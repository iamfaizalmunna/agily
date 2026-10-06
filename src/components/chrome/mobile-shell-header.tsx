"use client";

import { useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/appearance/app-icon";
import { CommandPaletteTrigger } from "@/components/chrome/command-palette-trigger";
import { NoticeBell } from "@/components/chrome/notice-bell";
import { MobileBottomSheet } from "@/components/chrome/mobile-bottom-sheet";
import { studioMark } from "@/lib/nav/studio";
import type { TeamRole } from "@/lib/rbac/roles";

type TeamMark = { name: string; slug: string; role: TeamRole };

export function MobileShellHeader({
  teams,
  current,
  unread,
  noticesHref,
  onBell,
  title,
}: {
  teams: TeamMark[];
  current?: TeamMark;
  unread: number;
  noticesHref: string;
  onBell: boolean;
  title: string;
}) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const mark = studioMark(current?.name);

  return (
    <>
      <header className="flex items-center gap-2 border-b border-border bg-card px-4 py-3 md:hidden">
        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary"
          aria-label="Switch studio"
          onClick={() => teams.length > 1 && setSwitcherOpen(true)}
        >
          {mark}
        </button>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-1 text-left"
          onClick={() => teams.length > 1 && setSwitcherOpen(true)}
          aria-label="Studio name"
        >
          <span className="truncate text-sm font-medium">{title}</span>
          {teams.length > 1 ? (
            <AppIcon name="action.chevron-down" className="size-4 shrink-0 text-muted-foreground" />
          ) : null}
        </button>
        <CommandPaletteTrigger compact />
        <NoticeBell href={noticesHref} count={unread} on={onBell} compact />
      </header>
      <MobileBottomSheet
        open={switcherOpen}
        title="Switch studio"
        onClose={() => setSwitcherOpen(false)}
      >
        <ul className="flex flex-col gap-1">
          {teams.map((team) => (
            <li key={team.slug}>
              <Link
                href={`/t/${team.slug}`}
                className="flex min-h-11 items-center rounded-md px-3 hover:bg-muted"
                onClick={() => setSwitcherOpen(false)}
              >
                {team.name}
                {team.slug === current?.slug ? (
                  <span className="ml-2 text-xs text-muted-foreground">Current</span>
                ) : null}
              </Link>
            </li>
          ))}
          <li className="border-t border-border pt-2 mt-2">
            <Link
              href="/home"
              className="flex min-h-11 items-center rounded-md px-3 hover:bg-muted"
              onClick={() => setSwitcherOpen(false)}
            >
              All studios
            </Link>
          </li>
        </ul>
      </MobileBottomSheet>
    </>
  );
}
