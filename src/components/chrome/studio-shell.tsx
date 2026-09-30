"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { StudioSidebar } from "@/components/chrome/studio-sidebar";
import { StudioTopbar } from "@/components/chrome/studio-topbar";
import { CommandPaletteProvider } from "@/components/chrome/command-palette-provider";
import { KeyboardProvider } from "@/components/chrome/keyboard-provider";
import { LensPanel } from "@/components/lens/lens-panel";
import { MobileBottomNav } from "@/components/chrome/mobile-bottom-nav";
import { MobileShellHeader } from "@/components/chrome/mobile-shell-header";
import { useLensStore } from "@/lib/lens/store";
import { mobileStudioMainClass } from "@/lib/ui/mobile";
import { projectSlugFromPath, teamSlugFromPath } from "@/lib/nav/studio";

import type { QuickCreateTarget } from "@/lib/create/quick-create";
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
  createBySlug,
  children,
}: {
  userName: string;
  userEmail: string;
  teams: TeamMark[];
  unreadBySlug: Record<string, number>;
  createBySlug: Record<
    string,
    { projects: QuickCreateTarget[]; canCreateBoard: boolean }
  >;
  children: ReactNode;
}) {
  const path = usePathname();
  const slug = teamSlugFromPath(path) ?? teams[0]?.slug;
  const current = teams.find((t) => t.slug === slug) ?? teams[0];
  const unread = current ? (unreadBySlug[current.slug] ?? 0) : 0;
  const noticesHref = current ? `/t/${current.slug}/notices` : "/home";
  const onBell = path.endsWith("/notices");
  const projectSlug = projectSlugFromPath(path) ?? undefined;
  const pageLabel = path.endsWith("/people")
    ? "People"
    : path.endsWith("/notices")
      ? "Notices"
      : path.endsWith("/settings")
        ? "Settings"
        : projectSlug
          ? "Board"
          : slug
            ? "Pulse"
            : undefined;
  const headerTitle = current?.name ?? "Agily";
  const setLensOpen = useLensStore((s) => s.setOpen);
  const createCtx = slug ? createBySlug[slug] : undefined;

  return (
    <div className="flex min-h-dvh flex-1 flex-col md:flex-row">
      <MobileShellHeader
        teams={teams}
        current={current}
        unread={unread}
        noticesHref={noticesHref}
        onBell={onBell}
        title={headerTitle}
      />

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
            projectSlug={projectSlug}
            projectName={
              projectSlug
                ?.replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
            }
            pageLabel={pageLabel}
          />
        </div>

        <main className={mobileStudioMainClass()}>{children}</main>
      </div>

      <MobileBottomNav
        path={path}
        slug={slug}
        projectSlug={projectSlug}
        unread={unread}
        noticesHref={noticesHref}
        teams={teams}
        userName={userName}
        userEmail={userEmail}
        onOpenLens={() => setLensOpen(true)}
        quickCreateProjects={createCtx?.projects ?? []}
        canCreateBoard={createCtx?.canCreateBoard ?? false}
      />

      <Suspense fallback={null}>
        <KeyboardProvider slug={slug} />
        <CommandPaletteProvider slug={slug} />
        <LensPanel slug={slug} />
      </Suspense>
    </div>
  );
}
