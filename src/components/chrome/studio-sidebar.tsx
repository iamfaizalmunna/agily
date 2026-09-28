"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  ChevronLeft,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { NoticeBell } from "@/components/chrome/notice-bell";
import { listProjectsForStudio } from "@/lib/studio/nav";
import {
  readSidebarCollapsed,
  writeSidebarCollapsed,
} from "@/lib/chrome/sidebar";
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(readSidebarCollapsed(window.localStorage));
  }, []);

  useEffect(() => {
    if (!activeSlug) {
      setProjects([]);
      return;
    }
    listProjectsForStudio(activeSlug).then(setProjects);
  }, [activeSlug]);

  const toggleCollapsed = () => {
    setCollapsed((value) => {
      const next = !value;
      writeSidebarCollapsed(next, window.localStorage);
      return next;
    });
  };

  const mark = studioMark(teamName);
  const noticesHref = activeSlug ? `/t/${activeSlug}/notices` : "/home";

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:flex",
        collapsed ? "w-[4.25rem]" : "w-60",
      )}
      aria-label="Studio navigation"
    >
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border px-3 py-3",
          collapsed ? "justify-center" : "justify-between gap-2",
        )}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground hover:bg-sidebar-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            aria-expanded={false}
            aria-label="Expand sidebar"
            title={teamName ?? "Agily"}
          >
            {mark}
          </button>
        ) : (
          <>
            <Link
              href={activeSlug ? `/t/${activeSlug}` : "/home"}
              className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              title={teamName ?? "Agily"}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
                {mark}
              </span>
              <span className="truncate text-sm font-semibold">{teamName ?? "Agily"}</span>
            </Link>
            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              aria-expanded={true}
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
          </>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3 text-sm">
        {activeSlug ? (
          <>
            <NavLink
              href={`/t/${activeSlug}`}
              on={path === `/t/${activeSlug}`}
              collapsed={collapsed}
              icon={<LayoutDashboard className="size-4" aria-hidden />}
            >
              Pulse
            </NavLink>
            <NavLink
              href={`/t/${activeSlug}/people`}
              on={path.endsWith("/people")}
              collapsed={collapsed}
              icon={<Users className="size-4" aria-hidden />}
            >
              People
            </NavLink>
            <NavLink
              href={noticesHref}
              on={path.endsWith("/notices")}
              collapsed={collapsed}
              icon={<Bell className="size-4" aria-hidden />}
            >
              Notices
            </NavLink>
            <NavLink
              href={`/t/${activeSlug}/settings`}
              on={path.endsWith("/settings") && !path.includes("/p/")}
              collapsed={collapsed}
              icon={<Settings className="size-4" aria-hidden />}
            >
              Settings
            </NavLink>

            {!collapsed ? (
              <p className="mt-4 px-3 text-[0.65rem] font-semibold uppercase tracking-wide text-sidebar-foreground/50">
                Boards
              </p>
            ) : (
              <div className="my-2 border-t border-sidebar-border" aria-hidden />
            )}
            {projects.map((project) => (
              <NavLink
                key={project.slug}
                href={`/t/${activeSlug}/p/${project.slug}`}
                on={activeProject === project.slug}
                collapsed={collapsed}
                sub
                icon={<FolderKanban className="size-4" aria-hidden />}
              >
                {!collapsed ? (
                  <>
                    <span className="truncate">{project.name}</span>
                    <span className="text-sidebar-foreground/45">{project.count}</span>
                  </>
                ) : (
                  <span className="sr-only">{project.name}</span>
                )}
              </NavLink>
            ))}
          </>
        ) : (
          <NavLink
            href="/home"
            on={path === "/home"}
            collapsed={collapsed}
            icon={<Activity className="size-4" aria-hidden />}
          >
            Your studios
          </NavLink>
        )}
      </nav>

      <div className="border-t border-sidebar-border px-2 py-3">
        <NoticeBell href={noticesHref} count={unread} on={path.endsWith("/notices")} />
      </div>
    </aside>
  );
}

function NavLink({
  href,
  on,
  sub,
  collapsed,
  icon,
  children,
}: {
  href: string;
  on: boolean;
  sub?: boolean;
  collapsed?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? String(children) : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        sub && !collapsed ? "text-[0.85rem]" : "font-medium",
        collapsed && "justify-center px-2",
        on
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
      aria-current={on ? "page" : undefined}
    >
      {icon}
      {!collapsed ? children : null}
    </Link>
  );
}
