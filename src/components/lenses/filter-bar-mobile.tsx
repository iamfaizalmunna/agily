"use client";

import { useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/appearance/app-icon";
import { MobileBottomSheet } from "@/components/chrome/mobile-bottom-sheet";
import { FilterBarPanels } from "@/components/lenses/filter-bar-panels";
import {
  countActiveLensFilters,
  lensFilterPills,
  lensQueryRecord,
  type LensSpec,
} from "@/lib/lenses/lenses";
import type { LabelChip } from "@/lib/labels/labels";
import { boardViewHref, type BoardView } from "@/lib/views/views";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";

type SavedLens = { id: string; name: string; spec: LensSpec };
type Person = { id: string; name: string };

export function FilterBarMobile({
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
  const [open, setOpen] = useState(false);
  const hrefFor = (next: LensSpec, id?: string) =>
    boardViewHref(slug, projectSlug, view, yearMonth, lensQueryRecord(next, id));
  const active = countActiveLensFilters(spec, savedId);
  const person = people.find((row) => row.id === spec.personId);
  const epic = epics.find((row) => row.id === spec.parentId);
  const labelNames =
    spec.labelIds?.map(
      (id) => teamLabels.find((label) => label.id === id)?.name ?? "Label",
    ) ?? [];
  const pills = lensFilterPills(
    spec,
    savedId,
    saved,
    {
      personName: person?.name,
      epicTitle: epic?.title,
      labelNames,
    },
    hrefFor,
  );

  return (
    <div className="flex flex-col gap-2 md:hidden">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={mobileTouchTargetClass(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium",
          )}
          onClick={() => setOpen(true)}
        >
          <AppIcon name="action.filter" className="size-4" />
          Filter{active ? ` · ${active} active` : ""}
        </button>
        {active ? (
          <Link
            href={hrefFor({}, undefined)}
            className="shrink-0 text-sm font-medium text-primary"
          >
            Clear all
          </Link>
        ) : null}
      </div>
      {pills.length ? (
        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Active filters"
        >
          {pills.map((pill) => (
            <Link
              key={`${pill.label}-${pill.href}`}
              href={pill.href}
              className="shrink-0 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium"
            >
              {pill.label} ×
            </Link>
          ))}
        </div>
      ) : null}
      <MobileBottomSheet open={open} title="Filters" onClose={() => setOpen(false)}>
        <FilterBarPanels
          slug={slug}
          projectSlug={projectSlug}
          view={view}
          yearMonth={yearMonth}
          spec={spec}
          savedId={savedId}
          saved={saved}
          people={people}
          teamLabels={teamLabels}
          epics={epics}
        />
      </MobileBottomSheet>
    </div>
  );
}
