"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KanbanMoveMenu } from "@/components/views/kanban-move-menu";
import { TicketCard, type TicketCardData } from "@/components/views/ticket-card";
import type { MoveStatusChoice } from "@/lib/board/mobile-kanban";
import { cn } from "@/lib/cn";

type KanbanItem = TicketCardData & { status: string };

export function KanbanSortableTicket({
  item,
  writable,
  isGhost,
  compact = false,
  touchDrag,
  moveTargets,
  onMoveStatus,
  pending,
}: {
  item: KanbanItem;
  writable: boolean;
  isGhost: boolean;
  compact?: boolean;
  touchDrag?: boolean;
  moveTargets?: MoveStatusChoice[];
  onMoveStatus?: (statusId: string) => void;
  pending?: boolean;
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
    disabled: !writable || !touchDrag,
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
      <div className="flex items-start gap-0.5">
        <TicketCard
          ticket={item}
          draggable={writable && touchDrag}
          dragging={isDragging}
          dragAttributes={attributes}
          dragListeners={listeners}
          compact={compact}
          className="min-w-0 flex-1"
        />
        {writable && moveTargets?.length && onMoveStatus ? (
          <KanbanMoveMenu
            title={item.title}
            targets={moveTargets}
            disabled={pending}
            onMove={onMoveStatus}
          />
        ) : null}
      </div>
    </div>
  );
}
