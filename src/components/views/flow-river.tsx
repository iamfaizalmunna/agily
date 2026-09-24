import { TicketChip } from "@/components/views/ticket-chip";
import { ITEM_STATUSES, STATUS_LABEL } from "@/lib/items/status";
import { groupByStatus } from "@/lib/views/views";

type FlowItem = {
  id: string;
  title: string;
  status: string;
  dueOn: Date | null;
  href: string;
  people: { id: string; name: string }[];
};

export function FlowRiver({ items }: { items: FlowItem[] }) {
  const columns = groupByStatus(items);

  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0">
      {ITEM_STATUSES.map((status) => (
        <section
          key={status}
          className="flex w-[16.5rem] shrink-0 flex-col gap-2"
        >
          <h2 className="font-display text-lg text-paper">
            {STATUS_LABEL[status]}
          </h2>
          {columns[status].length ? (
            columns[status].map((item) => (
              <TicketChip
                key={item.id}
                href={item.href}
                title={item.title}
                status={item.status}
                dueOn={item.dueOn}
                people={item.people}
              />
            ))
          ) : (
            <p className="text-xs text-paper/35">Empty.</p>
          )}
        </section>
      ))}
    </div>
  );
}
