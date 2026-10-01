import type { LabelChip } from "@/lib/labels/labels";
import type { SubtaskRow } from "@/lib/subtasks/subtasks";
import { TicketListMobileFeed } from "@/components/views/ticket-list-mobile-feed";
import { TicketListBulkTable } from "@/components/views/ticket-list-bulk-table";

export type TicketListItem = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueOn: Date | null;
  href: string;
  people: { id: string; name: string }[];
  position?: number;
  projectSlug?: string;
  groupName?: string;
  active?: boolean;
  labels?: LabelChip[];
  subtasks?: SubtaskRow[];
};

export function TicketList({
  items,
  selectedId,
  bulk,
}: {
  items: TicketListItem[];
  selectedId?: string;
  bulk?: {
    slug: string;
    projectSlug: string;
    listNext: string;
    statuses: { id: string; label: string }[];
    members: { id: string; name: string }[];
  };
}) {
  return (
    <>
      <TicketListMobileFeed items={items} selectedId={selectedId} />
      <div className="hidden md:block">
        {bulk ? (
          <TicketListBulkTable
            items={items}
            selectedId={selectedId}
            slug={bulk.slug}
            projectSlug={bulk.projectSlug}
            listNext={bulk.listNext}
            statuses={bulk.statuses}
            members={bulk.members}
          />
        ) : null}
      </div>
    </>
  );
}
