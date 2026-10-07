"use client";

import Link from "next/link";
import { signOutAction } from "@/lib/auth/actions";
import { NavIconRow } from "@/components/appearance/nav-icon-row";
import { AppIcon } from "@/components/appearance/app-icon";
import { MobileBottomSheet } from "@/components/chrome/mobile-bottom-sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import type { TeamRole } from "@/lib/rbac/roles";

type TeamMark = { name: string; slug: string; role: TeamRole };

export function MobileMoreSheet({
  open,
  onClose,
  slug,
  teams,
  userName,
  userEmail,
  onOpenLens,
}: {
  open: boolean;
  onClose: () => void;
  slug?: string;
  teams: TeamMark[];
  userName: string;
  userEmail: string;
  onOpenLens: () => void;
}) {
  return (
    <MobileBottomSheet open={open} title="More" onClose={onClose}>
      <p className="mb-4 text-sm text-muted-foreground">
        {userName} · {userEmail}
      </p>
      <ul className="flex flex-col gap-1 text-sm">
        {slug ? (
          <>
            <li>
              <Link
                href={`/t/${slug}/settings`}
                className="flex min-h-11 items-center rounded-md px-3 hover:bg-muted"
                onClick={onClose}
              >
                <NavIconRow icon="nav.settings">Studio settings</NavIconRow>
              </Link>
            </li>
            <li>
              <Link
                href={`/t/${slug}/people`}
                className="flex min-h-11 items-center rounded-md px-3 hover:bg-muted"
                onClick={onClose}
              >
                <NavIconRow icon="nav.people">People</NavIconRow>
              </Link>
            </li>
          </>
        ) : null}
        <li>
          <Link
            href="/home/profile"
            className="flex min-h-11 items-center rounded-md px-3 hover:bg-muted"
            onClick={onClose}
          >
            <NavIconRow icon="nav.profile">Profile & appearance</NavIconRow>
          </Link>
        </li>
        <li>
          <Link
            href="/home"
            className="flex min-h-11 items-center rounded-md px-3 hover:bg-muted"
            onClick={onClose}
          >
            <NavIconRow icon="nav.studios">All studios</NavIconRow>
          </Link>
        </li>
        {teams.length > 1 ? (
          <li className="border-t border-border pt-2 mt-2">
            <p className="px-3 pb-1 text-xs font-semibold uppercase text-muted-foreground">
              Switch studio
            </p>
            {teams.map((team) => (
              <Link
                key={team.slug}
                href={`/t/${team.slug}`}
                className="flex min-h-11 items-center rounded-md px-3 hover:bg-muted"
                onClick={onClose}
              >
                {team.name}
              </Link>
            ))}
          </li>
        ) : null}
        <li className="flex min-h-11 items-center justify-between rounded-md px-3">
          <span>Theme</span>
          <ThemeToggle compact />
        </li>
        <li>
          <button
            type="button"
            className="flex min-h-11 w-full items-center rounded-md px-3 text-left hover:bg-muted"
            onClick={() => {
              onClose();
              onOpenLens();
            }}
          >
            <NavIconRow icon="action.lens">Open Lens</NavIconRow>
          </button>
        </li>
        <li className="border-t border-border pt-2 mt-2">
          <form action={signOutAction}>
            <Button type="submit" variant="quiet" className="min-h-11 w-full justify-start gap-3 px-3">
              <AppIcon name="action.sign-out" className="size-4 shrink-0" />
              Sign out
            </Button>
          </form>
        </li>
      </ul>
    </MobileBottomSheet>
  );
}
