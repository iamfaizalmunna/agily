import Link from "next/link";
import { TicketChip } from "@/components/views/ticket-chip";
import {
  boardViewHref,
  formatYearMonth,
  itemsOnDay,
  monthGrid,
  shiftMonth,
  unscheduled,
} from "@/lib/views/views";

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
}: {
  slug: string;
  projectSlug: string;
  year: number;
  month: number;
  items: OrbitItem[];
}) {
  const grid = monthGrid(year, month);
  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const loose = unscheduled(items);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={boardViewHref(
            slug,
            projectSlug,
            "orbit",
            formatYearMonth(prev.year, prev.month),
          )}
          className="min-h-11 text-sm text-copper"
        >
          Prev
        </Link>
        <h2 className="font-display text-xl text-paper">
          {formatYearMonth(year, month)}
        </h2>
        <Link
          href={boardViewHref(
            slug,
            projectSlug,
            "orbit",
            formatYearMonth(next.year, next.month),
          )}
          className="min-h-11 text-sm text-copper"
        >
          Next
        </Link>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] uppercase tracking-[0.12em] text-paper/40">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell) => {
          const dayItems = itemsOnDay(items, cell.key);
          return (
            <div
              key={cell.key}
              className={`min-h-20 rounded-xl border border-paper/8 p-1 ${
                cell.inMonth ? "" : "opacity-35"
              }`}
            >
              <p className="text-[0.65rem] text-paper/50">{cell.day}</p>
              {dayItems.slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block truncate text-[0.7rem] text-paper"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          );
        })}
      </div>
      <section>
        <h3 className="mb-2 font-display text-lg text-paper">Unscheduled</h3>
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
          <p className="text-sm text-paper/40">Every ticket has a day.</p>
        )}
      </section>
    </div>
  );
}
