"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchStudioAction, type StudioSearchHit } from "@/lib/search/actions";
import {
  matchesActionLabel,
  normalizeSearchQuery,
} from "@/lib/search/search";
import {
  parseRecentTickets,
  pushRecentTicket,
  RECENT_TICKETS_KEY,
  type RecentTicket,
} from "@/lib/search/recent";
import { AppIcon } from "@/components/appearance/app-icon";
import type { IconName } from "@/lib/appearance/icon-names";
import { useAppearance } from "@/components/appearance/appearance-provider";
import { useCommandPaletteStore } from "@/lib/search/palette-store";
import { persistColorModeAction } from "@/lib/profile/actions";
import { colorModeLabel, nextColorMode } from "@/lib/theme/theme";
import { useTheme } from "@/components/theme/theme-provider";
import {
  BOARD_VIEW_ICON,
  boardViewHref,
  type BoardView,
} from "@/lib/views/views";
import { cn } from "@/lib/cn";

type PaletteAction = {
  id: string;
  label: string;
  hint?: string;
  icon?: IconName;
  run: () => void;
};

const VIEW_ACTIONS: { view: BoardView; label: string }[] = [
  { view: "summary", label: "Open Summary" },
  { view: "list", label: "Open List" },
  { view: "flow", label: "Open Board" },
  { view: "orbit", label: "Open Calendar" },
  { view: "timeline", label: "Open Timeline" },
];

export function CommandPalette({
  slug,
  projectSlug,
}: {
  slug?: string;
  projectSlug?: string;
}) {
  const open = useCommandPaletteStore((state) => state.open);
  const setOpen = useCommandPaletteStore((state) => state.setOpen);
  const router = useRouter();
  const { mode, setMode } = useTheme();
  const { appearance, setAppearance } = useAppearance();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<StudioSearchHit[]>([]);
  const [recent, setRecent] = useState<RecentTicket[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHits([]);
      return;
    }
    setRecent(parseRecentTickets(localStorage.getItem(RECENT_TICKETS_KEY)));
  }, [open]);

  useEffect(() => {
    if (!open || !slug) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setHits([]);
      return;
    }
    const timer = window.setTimeout(() => {
      startTransition(async () => {
        const rows = await searchStudioAction(slug, trimmed);
        setHits(rows);
      });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [open, query, slug]);

  const actions = useMemo(() => {
    const rows: PaletteAction[] = [];
    if (slug) {
      rows.push({
        id: "pulse",
        label: "Go to Pulse",
        icon: "nav.pulse",
        run: () => router.push(`/t/${slug}`),
      });
      rows.push({
        id: "people",
        label: "Go to People",
        icon: "nav.people",
        run: () => router.push(`/t/${slug}/people`),
      });
    }
    if (slug && projectSlug) {
      rows.push({
        id: "new-ticket",
        label: "New ticket on this board",
        icon: "action.plus",
        run: () =>
          router.push(`/t/${slug}/p/${projectSlug}?view=list`),
      });
      for (const entry of VIEW_ACTIONS) {
        rows.push({
          id: `view-${entry.view}`,
          label: entry.label,
          icon: BOARD_VIEW_ICON[entry.view],
          run: () =>
            router.push(boardViewHref(slug, projectSlug, entry.view)),
        });
      }
    }
    const nextMode = nextColorMode(mode);
    rows.push({
      id: "theme",
      label: "Toggle color theme",
      hint: colorModeLabel(mode),
      icon:
        mode === "dark"
          ? "action.moon"
          : mode === "light"
            ? "action.sun"
            : "action.monitor",
      run: () => {
        setMode(nextMode);
        setAppearance({ ...appearance, colorMode: nextMode });
        void persistColorModeAction(nextMode);
      },
    });
    return rows.filter((row) => matchesActionLabel(query, row.label));
  }, [appearance, mode, projectSlug, query, router, setAppearance, setMode, slug]);

  const visit = (entry: {
    id: string;
    title: string;
    href: string;
    key: string;
  }) => {
    const next = pushRecentTicket(recent, entry);
    setRecent(next);
    localStorage.setItem(RECENT_TICKETS_KEY, JSON.stringify(next));
    setOpen(false);
    router.push(entry.href);
  };

  if (!open) return null;

  const q = normalizeSearchQuery(query);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
      <button
        type="button"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        aria-label="Close command palette"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        data-testid="command-palette"
      >
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tickets, boards, actions…"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground"
        />
        <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {!q && recent.length ? (
            <section className="mb-2">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Recent
              </p>
              <ul>
                {recent.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => visit(row)}
                    >
                      <span className="truncate">{row.title}</span>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {row.key}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {q ? (
            <section className="mb-2">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tickets {pending ? "…" : `(${hits.length})`}
              </p>
              {hits.length ? (
                <ul>
                  {hits.map((row) => (
                    <li key={row.id}>
                      <button
                        type="button"
                        className="flex w-full flex-col gap-0.5 rounded-lg px-2 py-2 text-left hover:bg-muted"
                        onClick={() =>
                          visit({
                            id: row.id,
                            title: row.title,
                            href: row.href,
                            key: row.key,
                          })
                        }
                      >
                        <span className="flex items-center justify-between gap-2 text-sm">
                          <span className="truncate font-medium">{row.title}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {row.key}
                          </span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {row.projectName}
                          {row.labelNames.length
                            ? ` · ${row.labelNames.join(", ")}`
                            : ""}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-2 py-2 text-sm text-muted-foreground">
                  No matching tickets.
                </p>
              )}
            </section>
          ) : null}

          <section>
            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Actions
            </p>
            <ul>
              {actions.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm hover:bg-muted",
                    )}
                    onClick={() => {
                      row.run();
                      setOpen(false);
                    }}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {row.icon ? (
                        <AppIcon
                          name={row.icon}
                          className="size-4 shrink-0 text-muted-foreground"
                        />
                      ) : null}
                      <span className="truncate">{row.label}</span>
                    </span>
                    {row.hint ? (
                      <span className="text-xs text-muted-foreground">{row.hint}</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {!slug ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              Open a studio from{" "}
              <Link href="/home" className="text-primary underline" onClick={() => setOpen(false)}>
                home
              </Link>{" "}
              to search tickets.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
