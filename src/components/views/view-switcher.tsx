import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  BOARD_VIEWS,
  boardViewHref,
  type BoardView,
} from "@/lib/views/views";

const LABEL: Record<BoardView, string> = {
  ledger: "Ledger",
  flow: "Flow",
  orbit: "Orbit",
};

export function ViewSwitcher({
  slug,
  projectSlug,
  view,
  yearMonth,
}: {
  slug: string;
  projectSlug: string;
  view: BoardView;
  yearMonth?: string;
}) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Board views">
      {BOARD_VIEWS.map((name) => (
        <Link
          key={name}
          href={boardViewHref(slug, projectSlug, name, yearMonth)}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full px-4 text-sm",
            view === name
              ? "bg-copper text-ink"
              : "border border-paper/15 text-paper/70",
          )}
        >
          {LABEL[name]}
        </Link>
      ))}
    </nav>
  );
}
