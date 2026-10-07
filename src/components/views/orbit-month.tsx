import Link from "next/link";
import { TicketChip } from "@/components/views/ticket-chip";
import { dataSurfaceScrollClass } from "@/lib/ui/layout-contract";
import {
  boardViewHref,
  formatYearMonth,
  itemsOnDay,
  monthGrid,
  shiftMonth,
  unscheduled,
} from "@/lib/views/views";
import { cn } from "@/lib/cn";

type OrbitItem = {
  id: string;
  title: string;
  status: string;
  dueOn: Date | null;
  href: string;
  people: { id: string; name: string }[];
};

export function OrbitMonth({
  slug,
  projectSlug,
  year,
  month,
  items,
  extra,
}: {
  slug: string;
  projectSlug: string;
  year: number;
  month: number;
  items: OrbitItem[];
  extra?: Record<string, string>;
}) {
  const grid = monthGrid(year, month);
  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const loose = unscheduled(items);

  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={boardViewHref(
            slug,
            projectSlug,
            "orbit",
            formatYearMonth(prev.year, prev.month),
            extra,
          )}
          className="inline-flex min-h-11 items-center text-sm font-medium text-primary"
        >
          Prev
        </Link>
        <h2 className="text-xl font-semibold">{formatYearMonth(year, month)}</h2>
        <Link
          href={boardViewHref(
            slug,
            projectSlug,
            "orbit",
            formatYearMonth(next.year, next.month),
            extra,
          )}
          className="inline-flex min-h-11 items-center text-sm font-medium text-primary"
        >
          Next
        </Link>
      </div>
      <div className={cn(dataSurfaceScrollClass(), "min-w-[20rem]")}>
        <div className="min-w-[20rem]">
          <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] uppercase tracking-wide text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {grid.map((cell) => {
              const dayItems = itemsOnDay(items, cell.key);
              return (
                <div
                  key={cell.key}
                  className={cn(
                    "min-h-14 rounded-lg border border-border bg-card p-1 md:min-h-20",
                    !cell.inMonth && "opacity-40",
                  )}
                >
                  <p className="text-[0.65rem] text-muted-foreground">{cell.day}</p>
                  {dayItems.slice(0, 2).map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="block truncate text-[0.7rem] font-medium text-foreground hover:text-primary"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <section className="min-w-0">
        <h3 className="mb-2 text-lg font-semibold">Unscheduled</h3>
        {loose.length ? (
          <ul className="flex flex-col gap-2">
            {loose.map((item) => (
              <li key={item.id}>
                <TicketChip
                  href={item.href}
                  title={item.title}
                  status={item.status}
                  dueOn={item.dueOn}
                  people={item.people}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Every ticket has a day.</p>
        )}
      </section>
    </div>
  );
}
