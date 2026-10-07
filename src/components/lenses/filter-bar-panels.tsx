import type { ReactNode } from "react";
import Link from "next/link";
import { SaveLensForm } from "@/components/lenses/save-lens-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteLensAction } from "@/lib/lenses/actions";
import { FilterSearch } from "@/components/lenses/filter-search";
import {
  LENS_KIND_LABEL,
  LENS_KINDS,
  lensQueryRecord,
  pickEpicFilter,
  pickLensKind,
  pickLensPerson,
  pickLensPriority,
  pickLensStatus,
  toggleLensLabel,
  sameLensSpec,
  type LensSpec,
} from "@/lib/lenses/lenses";
import { ITEM_PRIORITIES, PRIORITY_LABEL } from "@/lib/items/priority";
import { ITEM_STATUSES, STATUS_LABEL } from "@/lib/items/status";
import { labelContrastText, type LabelChip } from "@/lib/labels/labels";
import { boardViewHref, type BoardView } from "@/lib/views/views";
import { cn } from "@/lib/cn";

type SavedLens = { id: string; name: string; spec: LensSpec };
type Person = { id: string; name: string };

export function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href}>
      <Badge
        variant={active ? "default" : "outline"}
        className={cn(
          "h-7 cursor-pointer rounded-md px-2.5 text-xs font-medium",
          !active && "bg-background hover:bg-muted",
        )}
      >
        {children}
      </Badge>
    </Link>
  );
}

function FilterRow({
  label,
  children,
  compact,
}: {
  label: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-2",
        compact && "xl:grid xl:grid-cols-[4.75rem_minmax(0,1fr)] xl:items-start xl:gap-3",
      )}
    >
      <p
        className={cn(
          "shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
          compact ? "w-20 pt-1 xl:w-auto" : "w-20",
        )}
      >
        {label}
      </p>
      <div className="flex min-w-0 flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function FilterBarPanels({
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
  compact = false,
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
  compact?: boolean;
}) {
  const hrefFor = (next: LensSpec, id?: string) =>
    boardViewHref(slug, projectSlug, view, yearMonth, lensQueryRecord(next, id));
  const here = boardViewHref(
    slug,
    projectSlug,
    view,
    yearMonth,
    lensQueryRecord(spec, savedId),
  );

  return (
    <div className={cn("flex flex-col", compact ? "gap-2.5" : "gap-3")}>
      <FilterSearch
        slug={slug}
        projectSlug={projectSlug}
        view={view}
        yearMonth={yearMonth}
        spec={spec}
        savedId={savedId}
      />

      <FilterRow label="Quick" compact={compact}>
        <FilterChip
          href={hrefFor(pickLensKind(spec))}
          active={!savedId && !spec.kind}
        >
          All
        </FilterChip>
        {LENS_KINDS.map((kind) => (
          <FilterChip
            key={kind}
            href={hrefFor(pickLensKind(spec, kind))}
            active={!savedId && spec.kind === kind}
          >
            {LENS_KIND_LABEL[kind]}
          </FilterChip>
        ))}
      </FilterRow>

      <FilterRow label="Priority" compact={compact}>
        <FilterChip
          href={hrefFor(pickLensPriority(spec))}
          active={!savedId && !spec.priority}
        >
          All
        </FilterChip>
        {ITEM_PRIORITIES.map((priority) => (
          <FilterChip
            key={priority}
            href={hrefFor(pickLensPriority(spec, priority))}
            active={!savedId && spec.priority === priority}
          >
            {PRIORITY_LABEL[priority]}
          </FilterChip>
        ))}
      </FilterRow>

      <FilterRow label="Status" compact={compact}>
        <FilterChip
          href={hrefFor(pickLensStatus(spec))}
          active={!savedId && !spec.status}
        >
          All
        </FilterChip>
        {ITEM_STATUSES.map((status) => (
          <FilterChip
            key={status}
            href={hrefFor(pickLensStatus(spec, status))}
            active={!savedId && spec.status === status}
          >
            {STATUS_LABEL[status]}
          </FilterChip>
        ))}
      </FilterRow>

      {epics.length ? (
        <FilterRow label="Epic" compact={compact}>
          <FilterChip
            href={hrefFor(pickEpicFilter(spec))}
            active={!savedId && !spec.parentId}
          >
            All
          </FilterChip>
          {epics.map((epic) => (
            <FilterChip
              key={epic.id}
              href={hrefFor(pickEpicFilter(spec, epic.id))}
              active={!savedId && spec.parentId === epic.id}
            >
              {epic.title}
            </FilterChip>
          ))}
        </FilterRow>
      ) : null}

      {teamLabels.length ? (
        <FilterRow label="Labels" compact={compact}>
          {teamLabels.map((label) => {
            const active = spec.labelIds?.includes(label.id) ?? false;
            return (
              <FilterChip
                key={label.id}
                href={hrefFor(toggleLensLabel(spec, label.id))}
                active={!savedId && active}
              >
                <span
                  className="mr-1 inline-block size-2 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                <span style={{ color: active ? labelContrastText(label.color) : undefined }}>
                  {label.name}
                </span>
              </FilterChip>
            );
          })}
        </FilterRow>
      ) : null}

      {people.length ? (
        <FilterRow label="Assignee" compact={compact}>
          <FilterChip
            href={hrefFor(pickLensPerson(spec))}
            active={!spec.personId && !savedId}
          >
            All
          </FilterChip>
          {people.map((person) => (
            <FilterChip
              key={person.id}
              href={hrefFor(pickLensPerson(spec, person.id))}
              active={!savedId && spec.personId === person.id}
            >
              {person.name}
            </FilterChip>
          ))}
        </FilterRow>
      ) : null}

      {saved.length ? (
        <FilterRow label="Saved" compact={compact}>
          {saved.map((lens) => (
            <span key={lens.id} className="inline-flex items-center gap-1">
              <FilterChip
                href={hrefFor(lens.spec, lens.id)}
                active={
                  savedId === lens.id ||
                  (!savedId && sameLensSpec(spec, lens.spec))
                }
              >
                {lens.name}
              </FilterChip>
              <form action={deleteLensAction}>
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="lensId" value={lens.id} />
                <input type="hidden" name="next" value={hrefFor({})} />
                <Button type="submit" variant="quiet" size="sm" className="px-2">
                  ×
                </Button>
              </form>
            </span>
          ))}
        </FilterRow>
      ) : null}

      <SaveLensForm slug={slug} next={here} spec={spec} />
    </div>
  );
}
