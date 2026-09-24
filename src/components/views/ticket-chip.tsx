import Link from "next/link";
import { AssigneeMarks } from "@/components/items/assignee-marks";
import { formatDueOn } from "@/lib/items/validate";
import { STATUS_LABEL, type ItemStatus } from "@/lib/items/status";

export function TicketChip({
  href,
  title,
  status,
  dueOn,
  people,
}: {
  href: string;
  title: string;
  status: string;
  dueOn: Date | null;
  people: { id: string; name: string }[];
}) {
  return (
    <Link
      href={href}
      className="flex min-h-14 flex-col gap-1 rounded-2xl border border-paper/10 px-3 py-3"
    >
      <span className="text-sm text-paper">{title}</span>
      <span className="text-[0.65rem] uppercase tracking-[0.14em] text-paper/40">
        {STATUS_LABEL[status as ItemStatus] ?? status}
        {dueOn ? ` · ${formatDueOn(dueOn)}` : ""}
      </span>
      <AssigneeMarks people={people} />
    </Link>
  );
}
