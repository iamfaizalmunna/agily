"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/appearance/app-icon";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/chrome/empty-state";
import { Input } from "@/components/ui/input";
import {
  filterHubProjects,
  lastBoardViewForProject,
  type HubProject,
  type RecentBoard,
} from "@/lib/hub/board-hub";
import { boardViewHref } from "@/lib/views/views";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";
import { cn } from "@/lib/cn";

export function MobileBoardHub({
  slug,
  projects,
  recentBoards,
  mayCreate,
}: {
  slug: string;
  projects: HubProject[];
  recentBoards: RecentBoard[];
  mayCreate: boolean;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => filterHubProjects(projects, query),
    [projects, query],
  );
  const recent = useMemo(() => {
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    return recentBoards
      .filter((row) => bySlug.has(row.projectSlug))
      .map((row) => ({
        ...row,
        projectName: bySlug.get(row.projectSlug)?.name ?? row.projectName,
        ticketCount: bySlug.get(row.projectSlug)?.ticketCount ?? 0,
      }));
  }, [projects, recentBoards]);

  const projectHref = (projectSlug: string) => {
    const view = lastBoardViewForProject(recentBoards, slug, projectSlug);
    return boardViewHref(slug, projectSlug, view ?? "summary");
  };

  return (
    <section
      id="studio-boards"
      className="flex scroll-mt-6 flex-col gap-4"
      aria-labelledby="studio-boards-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="studio-boards-title" className="text-lg font-semibold">
            Your boards
          </h2>
          <p className="text-sm text-muted-foreground md:hidden">
            Search and open a board — we remember your last view.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {projects.length} board{projects.length === 1 ? "" : "s"}
        </p>
      </div>

      {projects.length > 0 ? (
        <label className="relative block">
          <span className="sr-only">Search boards</span>
          <AppIcon
            name="action.search"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search boards…"
            className="h-11 pl-10"
            autoComplete="off"
          />
        </label>
      ) : null}

      {recent.length > 0 && !query.trim() ? (
        <div className="flex flex-col gap-2 md:hidden">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recent
          </h3>
          <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {recent.map((board) => (
              <li key={board.projectSlug} className="shrink-0">
                <Link
                  href={boardViewHref(slug, board.projectSlug, board.view)}
                  className={cn(
                    mobileTouchTargetClass(
                      "flex min-w-[9rem] flex-col rounded-lg border border-border bg-card px-3 py-2",
                    ),
                  )}
                >
                  <span className="truncate text-sm font-medium">
                    {board.projectName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {board.ticketCount} tickets
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {projects.length === 0 ? (
        <EmptyState
          title="No boards yet"
          body={
            mayCreate
              ? "Create your first board below — then open it from this hub anytime."
              : "Ask a studio admin to open a board for you."
          }
        />
      ) : filtered.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((project) => (
            <li key={project.slug}>
              <Link href={projectHref(project.slug)}>
                <Card
                  className="flex min-h-[4.5rem] items-center justify-between p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
                >
                  <span className="font-medium">{project.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {project.ticketCount} tickets
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No boards match &ldquo;{query.trim()}&rdquo;.
        </p>
      )}
    </section>
  );
}
