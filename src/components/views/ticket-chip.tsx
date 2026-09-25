import { TicketCard, type TicketCardData } from "@/components/views/ticket-card";

export function TicketChip({
  href,
  title,
  status,
  priority = "minor",
  dueOn,
  people,
  position = 0,
  projectSlug = "board",
}: {
  href: string;
  title: string;
  status: string;
  priority?: string;
  dueOn: Date | null;
  people: { id: string; name: string }[];
  position?: number;
  projectSlug?: string;
}) {
  const ticket: TicketCardData = {
    id: href,
    title,
    priority,
    dueOn,
    href,
    people,
    position,
    projectSlug,
  };

  return <TicketCard ticket={ticket} compact />;
}
