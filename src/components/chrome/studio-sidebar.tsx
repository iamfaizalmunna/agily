"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NoticeBell } from "@/components/chrome/notice-bell";
import { listProjectsForStudio } from "@/lib/studio/nav";
import { cn } from "@/lib/cn";
import { projectSlugFromPath, studioMark, teamSlugFromPath } from "@/lib/nav/studio";

type ProjectMark = { name: string; slug: string; count: number };

export function StudioSidebar({
  teamName,
  slug,
  unread,
}: {
  teamName?: string;
  slug?: string;
  unread: number;
}) {
  const path = usePathname();
  const activeSlug = slug ?? teamSlugFromPath(path);
  const activeProject = projectSlugFromPath(path);
  const [projects, setProjects] = useState<ProjectMark[]>([]);

  useEffect(() => {
    if (!activeSlug) {
      setProjects([]);
      return;
    }
    listProjectsForStudio(activeSlug).then(setProjects);
  }, [activeSlug]);

  const mark = studioMark(teamName);
  const noticesHref = activeSlug ? `/t/${activeSlug}/notices` : "/home";

  return (
    <aside
      className="hidden w-60 shrink-0 flex-col bg-[var(--sidebar)] text-[var(--sidebar-foreground)] md:flex"
    >
      <div className="border-b border-white/10 px-4 py-4">
        <Link href={activeSlug ? `/t/${activeSlug}` : "/home"} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15 text-sm font-semibold">
            {mark}
          </span>
          <span className="truncate text-sm font-semibold">{teamName ?? "Agily"}</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3 text-sm">
        {activeSlug ? (
          <>
            <NavLink href={`/t/${activeSlug}`} on={path === `/t/${activeSlug}`}>
              Pulse
            </NavLink>
            <NavLink href={`/t/${activeSlug}/people`} on={path.endsWith("/people")}>
              People
            </NavLink>
            <NavLink href={noticesHref} on={path.endsWith("/notices")}>
              Notices
            </NavLink>
            <NavLink href={`/t/${activeSlug}/settings`} on={path.endsWith("/settings")}>
              Settings
            </NavLink>

            <p className="mt-4 px-3 text-[0.65rem] font-semibold uppercase tracking-wide text-white/50">
              Boards
            </p>
            {projects.map((project) => (
              <NavLink
                key={project.slug}
                href={`/t/${activeSlug}/p/${project.slug}`}
                on={activeProject === project.slug}
                sub
              >
                <span className="truncate">{project.name}</span>
                <span className="text-white/45">{project.count}</span>
              </NavLink>
            ))}
          </>
        ) : (
          <NavLink href="/home" on={path === "/home"}>Your studios</NavLink>
        )}
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <NoticeBell href={noticesHref} count={unread} on={path.endsWith("/notices")} />
      </div>
    </aside>
  );
}

function NavLink({
  href,
  on,
  sub,
  children,
}: {
  href: string;
  on: boolean;
  sub?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2 transition-colors",
        sub ? "text-[0.85rem]" : "font-medium",
        on ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}
