import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  LIST_SORT_FIELDS,
  LIST_SORT_LABEL,
  listSortQuery,
  nextListSortToggle,
  parseListSort,
  type ListSortConfig,
} from "@/lib/views/list-sort";
import { boardViewHref } from "@/lib/views/views";

export function ListSortBar({
  slug,
  projectSlug,
  yearMonth,
  lensExtra,
  sort,
  sortDir,
  focusId,
}: {
  slug: string;
  projectSlug: string;
  yearMonth?: string;
  lensExtra: Record<string, string>;
  sort?: string;
  sortDir?: string;
  focusId?: string | null;
}) {
  const current = parseListSort(sort, sortDir);

  function hrefFor(next: ListSortConfig | null) {
    const extra = { ...lensExtra, ...listSortQuery(next) };
    if (focusId) extra.focus = focusId;
    return boardViewHref(slug, projectSlug, "list", yearMonth, extra);
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
      aria-label="List sort"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Sort
      </span>
      <Link
        href={hrefFor(null)}
        className={cn(
          "rounded-md px-2.5 py-1.5 text-sm transition-colors",
          !current
            ? "bg-muted font-medium text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        Board order
      </Link>
      {LIST_SORT_FIELDS.map((field) => {
        const active = current?.field === field;
        const next = nextListSortToggle(current, field);
        const label = active
          ? `${LIST_SORT_LABEL[field]} ${current?.dir === "asc" ? "↑" : "↓"}`
          : LIST_SORT_LABEL[field];
        return (
          <Link
            key={field}
            href={hrefFor(next)}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm transition-colors",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
