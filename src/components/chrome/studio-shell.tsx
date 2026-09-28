"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CommandPaletteTrigger } from "@/components/chrome/command-palette-trigger";
import { StudioSidebar } from "@/components/chrome/studio-sidebar";
import { StudioTopbar } from "@/components/chrome/studio-topbar";
import { CommandPaletteProvider } from "@/components/chrome/command-palette-provider";
import { KeyboardProvider } from "@/components/chrome/keyboard-provider";
import { LensPanel, LensTrigger } from "@/components/lens/lens-panel";
import { NoticeBell } from "@/components/chrome/notice-bell";
import { SignOutButton } from "@/components/chrome/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { projectSlugFromPath, studioMark, teamSlugFromPath } from "@/lib/nav/studio";
import type { TeamRole } from "@/lib/rbac/roles";

type TeamMark = {
  name: string;
  slug: string;
  role: TeamRole;
};

export function StudioShell({
  userName,
  userEmail,
  teams,
  unreadBySlug,
  children,
}: {
  userName: string;
  userEmail: string;
  teams: TeamMark[];
  unreadBySlug: Record<string, number>;
  children: ReactNode;
}) {
  const path = usePathname();
  const slug = teamSlugFromPath(path) ?? teams[0]?.slug;
  const current = teams.find((t) => t.slug === slug) ?? teams[0];
  const unread = current ? (unreadBySlug[current.slug] ?? 0) : 0;
  const noticesHref = current ? `/t/${current.slug}/notices` : "/home";
  const onBell = path.endsWith("/notices");
  const mark = studioMark(current?.name);
  const pageLabel = path.endsWith("/people")
    ? "People"
    : path.endsWith("/notices")
      ? "Notices"
      : path.endsWith("/settings")
        ? "Settings"
        : projectSlugFromPath(path)
          ? "Board"
          : slug
            ? "Pulse"
            : undefined;

  return (
    <div className="flex min-h-dvh flex-1 flex-col md:flex-row">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
        <Link
          href={current ? `/t/${current.slug}` : "/home"}
          className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary"
        >
          {mark}
        </Link>
        <p className="min-w-0 flex-1 truncate text-sm font-medium">
          {current?.name ?? "Agily"}
        </p>
        <CommandPaletteTrigger compact />
        <LensTrigger />
        <NoticeBell href={noticesHref} count={unread} on={onBell} compact />
        <SignOutButton />
      </header>

      <StudioSidebar
        teamName={current?.name}
        slug={slug}
        unread={unread}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
        <div className="hidden md:block">
          <StudioTopbar
            userEmail={userEmail}
            role={current?.role}
            teamName={current?.name}
            slug={slug}
            projectSlug={projectSlugFromPath(path) ?? undefined}
            projectName={
              projectSlugFromPath(path)
                ?.replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
            }
            pageLabel={pageLabel}
          />
        </div>

        <main className="flex-1 px-4 pb-24 pt-4 md:px-6 md:pb-8 md:pt-6">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
        <Link
          href={current ? `/t/${current.slug}` : "/home"}
          className={cn(
            "flex min-h-14 flex-1 items-center justify-center text-xs font-medium",
            path === "/home" || path === `/t/${slug}`
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          Pulse
        </Link>
        {slug ? (
          <Link
            href={`/t/${slug}/people`}
            className={cn(
              "flex min-h-14 flex-1 items-center justify-center text-xs font-medium",
              path.endsWith("/people") ? "text-primary" : "text-muted-foreground",
            )}
          >
            People
          </Link>
        ) : null}
        <NoticeBell href={noticesHref} count={unread} on={onBell} />
        <ThemeToggle compact />
        <span className="hidden">{userName}</span>
      </nav>

      <Suspense fallback={null}>
        <KeyboardProvider slug={slug} />
        <CommandPaletteProvider slug={slug} />
        <LensPanel slug={slug} />
      </Suspense>
    </div>
  );
}
