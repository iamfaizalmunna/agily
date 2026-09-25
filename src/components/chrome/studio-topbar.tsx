"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SignOutButton } from "@/components/chrome/sign-out-button";
import { studioCrumbs } from "@/lib/nav/breadcrumbs";
import { projectSlugFromPath, teamSlugFromPath } from "@/lib/nav/studio";

export function StudioTopbar({
  userEmail,
  role,
  teamName,
  projectName,
  pageLabel,
}: {
  userEmail: string;
  role?: string;
  teamName?: string;
  projectName?: string;
  pageLabel?: string;
}) {
  const path = usePathname();
  const crumbs = studioCrumbs(path, {
    team: teamName,
    project: projectName,
    page: pageLabel,
  });

  return (
    <header className="flex flex-col gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <nav className="flex min-w-0 flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <span>/</span> : null}
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
        <div className="flex items-center gap-2">
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
