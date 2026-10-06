"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/appearance/app-icon";
import { FilterBarPanels } from "@/components/lenses/filter-bar-panels";
import {
  countActiveLensFilters,
  lensQueryRecord,
  type LensSpec,
} from "@/lib/lenses/lenses";
import type { LabelChip } from "@/lib/labels/labels";
import { shouldExpandFiltersDesktop } from "@/lib/ui/layout-contract";
import { boardViewHref, type BoardView } from "@/lib/views/views";
import { cn } from "@/lib/cn";

const FILTERS_EXPANDED_KEY = "agily:filters-expanded";

type SavedLens = { id: string; name: string; spec: LensSpec };
type Person = { id: string; name: string };

function readExpandedPreference(): boolean | null {
  try {
    const raw = sessionStorage.getItem(FILTERS_EXPANDED_KEY);
    if (raw === "1") return true;
    if (raw === "0") return false;
  } catch {
    /* private mode */
  }
  return null;
}

function writeExpandedPreference(open: boolean) {
  try {
    sessionStorage.setItem(FILTERS_EXPANDED_KEY, open ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function FilterBarDesktop({
  slug,
  projectSlug,
  view,
  yearMonth,
  spec,
  savedId,
  saved,
  people,
  teamLabels,
  epics,
}: {
  slug: string;
  projectSlug: string;
  view: BoardView;
  yearMonth?: string;
  spec: LensSpec;
  savedId?: string;
  saved: SavedLens[];
  people: Person[];
  teamLabels: LabelChip[];
  epics: { id: string; title: string }[];
}) {
  const active = countActiveLensFilters(spec, savedId);
  const hrefClear = boardViewHref(
    slug,
    projectSlug,
    view,
    yearMonth,
    lensQueryRecord({}, undefined),
  );

  const [open, setOpen] = useState(() => {
    const pref = readExpandedPreference();
    if (pref !== null) return pref;
    return active > 0;
  });

  useEffect(() => {
    const pref = readExpandedPreference();
    if (pref !== null) return;
    if (shouldExpandFiltersDesktop(active)) {
      setOpen(true);
    }
  }, [active]);

  useEffect(() => {
    if (active > 0) setOpen(true);
  }, [active]);

  function toggle() {
    setOpen((value) => {
      const next = !value;
      writeExpandedPreference(next);
      return next;
    });
  }

  const panelProps = {
    slug,
    projectSlug,
    view,
    yearMonth,
    spec,
    savedId,
    saved,
    people,
    teamLabels,
    epics,
  };

  return (
    <div className="hidden rounded-lg border border-border bg-card md:block">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 sm:px-4">
        <button
          type="button"
          className="flex min-h-10 flex-1 items-center gap-2 rounded-md text-left text-sm font-medium text-foreground hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={open}
          onClick={toggle}
        >
          <AppIcon
            name="action.chevron-down"
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
          <span>Filters</span>
          {active ? (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
              {active} active
            </span>
          ) : (
            <span className="text-xs font-normal text-muted-foreground">
              Tap to {open ? "collapse" : "expand"}
            </span>
          )}
        </button>
        {active ? (
          <Link
            href={hrefClear}
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            Clear all
          </Link>
        ) : null}
      </div>
      {open ? (
        <div className="p-3 pt-2 sm:p-4 sm:pt-3">
          <FilterBarPanels {...panelProps} compact />
        </div>
      ) : null}
    </div>
  );
}
