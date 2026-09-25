import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  BOARD_VIEWS,
  BOARD_VIEW_LABEL,
  boardViewHref,
  type BoardView,
} from "@/lib/views/views";

export function ProjectTabs({
  slug,
  projectSlug,
  view,
  yearMonth,
  extra,
}: {
  slug: string;
  projectSlug: string;
  view: BoardView;
  yearMonth?: string;
  extra?: Record<string, string>;
}) {
  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-border"
      aria-label="Board views"
    >
      {BOARD_VIEWS.map((name) => {
        const on = view === name;
        return (
          <Link
            key={name}
            href={boardViewHref(slug, projectSlug, name, yearMonth, extra)}
            className={cn(
              "relative -mb-px shrink-0 px-3 py-2.5 text-sm font-medium transition-colors",
              on
                ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {BOARD_VIEW_LABEL[name]}
          </Link>
        );
      })}
    </nav>
  );
}
