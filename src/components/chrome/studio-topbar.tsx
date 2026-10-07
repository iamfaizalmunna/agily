"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIconRow } from "@/components/appearance/nav-icon-row";
import { CommandPaletteTrigger } from "@/components/chrome/command-palette-trigger";
import { StudioCreateMenu } from "@/components/chrome/studio-create-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SignOutButton } from "@/components/chrome/sign-out-button";
import { studioCrumbs } from "@/lib/nav/breadcrumbs";
import { projectSlugFromPath, teamSlugFromPath } from "@/lib/nav/studio";
import type { TeamRole } from "@/lib/rbac/roles";

export function StudioTopbar({
  userEmail,
  role,
  teamName,
  projectName,
  pageLabel,
  slug,
  projectSlug,
}: {
  userEmail: string;
  role?: TeamRole;
  teamName?: string;
  projectName?: string;
  pageLabel?: string;
  slug?: string;
  projectSlug?: string;
}) {
  const path = usePathname();
  const crumbs = studioCrumbs(path, {
    team: teamName,
    project: projectName,
    page: pageLabel,
  });
  const canCreateBoard = role !== "viewer";

  return (
    <header className="flex flex-col gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav
          className="flex min-w-0 flex-wrap items-center gap-1 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <CommandPaletteTrigger compact />
          <StudioCreateMenu
            slug={slug}
            projectSlug={projectSlug}
            canCreateBoard={canCreateBoard}
          />
          <Link
            href="/home/profile"
            className="hidden items-center text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            <NavIconRow icon="nav.profile">Profile</NavIconRow>
          </Link>
          <ThemeToggle compact />
          <SignOutButton />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {userEmail}
        {role ? ` · ${role}` : ""}
        {teamSlugFromPath(path) && projectSlugFromPath(path) ? (
          <span className="hidden sm:inline"> · Board workspace</span>
        ) : null}
      </p>
    </header>
  );
}
