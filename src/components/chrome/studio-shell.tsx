"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NoticeBell } from "@/components/chrome/notice-bell";
import { SignOutButton } from "@/components/chrome/sign-out-button";
import { LensPanel, LensTrigger } from "@/components/lens/lens-panel";
import { cn } from "@/lib/cn";
import { studioMark, teamSlugFromPath } from "@/lib/nav/studio";
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
  const mark = studioMark(current?.name);
  const unread = current ? (unreadBySlug[current.slug] ?? 0) : 0;
  const noticesHref = current ? `/t/${current.slug}/notices` : "/home";
  const onBell = path.endsWith("/notices");

  return (
    <div className="flex min-h-dvh flex-1 flex-col md:flex-row">
      <header className="flex items-center justify-between gap-3 border-b border-paper/8 px-4 py-3 md:hidden">
        <Link
          href={current ? `/t/${current.slug}` : "/home"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-copper/20 font-display text-sm text-copper"
        >
          {mark}
        </Link>
        <p className="min-w-0 flex-1 truncate text-sm text-paper/70">
          {current?.name ?? "Agily"}
        </p>
        <LensTrigger />
        <NoticeBell href={noticesHref} count={unread} on={onBell} compact />
        <SignOutButton />
      </header>

      <aside className="hidden w-[4.5rem] flex-col items-center gap-6 border-r border-paper/8 py-6 md:flex">
        <Link
          href={current ? `/t/${current.slug}` : "/home"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-copper/20 font-display text-sm text-copper"
          title={current?.name ?? "Agily"}
        >
          {mark}
        </Link>
        <nav className="flex flex-1 flex-col items-center gap-5 text-[0.65rem] uppercase tracking-[0.18em] text-paper/35">
          <Link
            href={current ? `/t/${current.slug}` : "/home"}
            className={cn(
              "hover:text-paper",
              path === "/home" || path === `/t/${slug}` ? "text-paper" : "",
            )}
          >
            Pulse
          </Link>
          {slug ? (
            <Link
              href={`/t/${slug}/people`}
              className={cn(
                "hover:text-paper",
                path.endsWith("/people") ? "text-paper" : "",
              )}
            >
              People
            </Link>
          ) : null}
          {slug ? (
            <NoticeBell href={noticesHref} count={unread} on={onBell} compact />
          ) : null}
          <LensTrigger />
        </nav>
        <SignOutButton />
      </aside>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="hidden items-center justify-between px-8 py-5 md:flex">
          <p className="text-sm text-paper/45">
            {userEmail}
            {current ? ` · ${current.role}` : ""}
          </p>
        </div>
        <div className="flex-1 px-4 pb-24 pt-4 md:px-8 md:pb-10 md:pt-0">
          {children}
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-paper/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <Link
          href={current ? `/t/${current.slug}` : "/home"}
          className={cn(
            "flex min-h-14 flex-1 items-center justify-center text-xs uppercase tracking-[0.16em]",
            path === "/home" || path === `/t/${slug}`
              ? "text-paper"
              : "text-paper/50",
          )}
        >
          Pulse
        </Link>
        {slug ? (
          <Link
            href={`/t/${slug}/people`}
            className={cn(
              "flex min-h-14 flex-1 items-center justify-center text-xs uppercase tracking-[0.16em]",
              path.endsWith("/people") ? "text-paper" : "text-paper/50",
            )}
          >
            People
          </Link>
        ) : (
          <span className="flex min-h-14 flex-1 items-center justify-center text-xs uppercase tracking-[0.16em] text-paper/25">
            People
          </span>
        )}
        <NoticeBell href={noticesHref} count={unread} on={onBell} />
        <span className="hidden">{userName}</span>
      </nav>
      <Suspense fallback={null}>
        <LensPanel slug={slug} />
      </Suspense>
    </div>
  );
}
