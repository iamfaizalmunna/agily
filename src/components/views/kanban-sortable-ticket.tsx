"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TicketCard, type TicketCardData } from "@/components/views/ticket-card";
import { cn } from "@/lib/cn";

type KanbanItem = TicketCardData & { status: string };

export function KanbanSortableTicket({
  item,
  writable,
  isGhost,
  compact = false,
}: {
  item: KanbanItem;
  writable: boolean;
  isGhost: boolean;
  compact?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: !writable,
    transition: {
      duration: 220,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`kanban-card-${item.id}`}
      className={cn(
        (isDragging || isGhost) && "opacity-30",
        !isDragging && "will-change-transform",
      )}
    >
      <TicketCard
        ticket={item}
        draggable={writable}
        dragging={isDragging}
        dragAttributes={attributes}
        dragListeners={listeners}
        compact={compact}
      />
    </div>
  );
}
