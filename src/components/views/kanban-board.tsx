"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { TicketCard, type TicketCardData } from "@/components/views/ticket-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  moveItemStatusQuickAction,
  reorderKanbanColumnAction,
} from "@/lib/items/actions";
import {
  type BoardDisplayPrefs,
  groupByWorkflowSorted,
  groupSwimlanes,
  isOverWip,
  visibleKanbanStatuses,
  wipLimitFor,
} from "@/lib/board/kanban";
import { statusTone } from "@/lib/ui/status-tone";
import {
  isWorkflowStatus,
  workflowStatusColor,
  workflowStatusLabel,
  type Workflow,
} from "@/lib/workflow/workflow";
import { cn } from "@/lib/cn";
import { KanbanSortableTicket } from "@/components/views/kanban-sortable-ticket";

type KanbanItem = TicketCardData & { status: string };

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
  duration: 220,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
};

function KanbanColumn({
  status,
  label,
  accentColor,
  items,
  writable,
  activeId,
  compact,
  overWip,
  wipLimit,
}: {
  status: string;
  label: string;
  accentColor: string;
  items: KanbanItem[];
  writable: boolean;
  activeId: string | null;
  compact: boolean;
  overWip: boolean;
  wipLimit?: number;
}) {
  const tone = statusTone(status);
  const headingId = `kanban-heading-${status}`;
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      role="region"
      aria-labelledby={headingId}
      data-testid={`kanban-column-${status}`}
      style={{ borderTopColor: accentColor }}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-lg border border-border bg-muted/20 transition-[background,box-shadow,transform] duration-200",
        "border-t-4",
        tone.column,
        overWip && "ring-2 ring-amber-400/60",
        isOver && writable && "scale-[1.01] bg-primary/5 shadow-md ring-2 ring-primary/25",
      )}
    >
      <header className="flex items-center justify-between px-3 py-2.5">
        <h2 id={headingId} className="text-sm font-semibold">{label}</h2>
        <span
          className={cn(
            "rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground",
            overWip && "font-medium text-amber-700 dark:text-amber-300",
          )}
        >
          {items.length}
          {wipLimit !== undefined ? ` / ${wipLimit}` : ""}
        </span>
      </header>
      <SortableContext
        id={status}
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-[160px] flex-col gap-2 px-2 pb-3">
          {items.length ? (
            items.map((item) => (
              <KanbanSortableTicket
                key={item.id}
                item={item}
                writable={writable}
                isGhost={activeId === item.id}
                compact={compact}
              />
            ))
          ) : (
            <p
              className={cn(
                "rounded-md border border-dashed border-border/80 px-2 py-8 text-center text-xs text-muted-foreground transition-colors",
                isOver && writable && "border-primary/40 bg-primary/5 text-primary",
              )}
            >
              {writable ? "Drop here" : "Empty"}
            </p>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

function KanbanRow({
  label,
  localItems,
  statuses,
  workflow,
  writable,
  pending,
  activeId,
  compact,
}: {
  label: string;
  localItems: KanbanItem[];
  statuses: readonly string[];
  workflow: Workflow;
  writable: boolean;
  pending: boolean;
  activeId: string | null;
  compact: boolean;
}) {
  const columns = useMemo(
    () => groupByWorkflowSorted(localItems, workflow),
    [localItems, workflow],
  );

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <h3 className="sticky left-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </h3>
      ) : null}
      <div className="flex min-w-max gap-3">
        {statuses.map((status) => {
          const items = columns[status] ?? [];
          const limit = wipLimitFor(status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              label={workflowStatusLabel(workflow, status)}
              accentColor={workflowStatusColor(workflow, status)}
              items={items}
              writable={writable && !pending}
              activeId={activeId}
              compact={compact}
              wipLimit={limit}
              overWip={isOverWip(items.length, limit)}
            />
          );
        })}
      </div>
    </div>
  );
}

export function KanbanBoard({
  slug,
  projectSlug,
  items,
  writable,
  prefs,
  nameByUserId,
  workflow,
}: {
  slug: string;
  projectSlug: string;
  items: KanbanItem[];
  writable: boolean;
  prefs: BoardDisplayPrefs;
  nameByUserId: Map<string, string>;
  workflow: Workflow;
}) {
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState(items);
  const serverItemsRef = useRef(items);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    serverItemsRef.current = items;
    if (!activeId) setLocalItems(items);
  }, [items, activeId]);

  const statuses = useMemo(
    () => visibleKanbanStatuses(prefs.hideDone, workflow),
    [prefs.hideDone, workflow],
  );

  const lanes = useMemo(() => {
    if (prefs.swimlane === "none") {
      return [{ key: "", label: "", items: localItems }];
    }
    return groupSwimlanes(localItems, prefs.swimlane, nameByUserId);
  }, [localItems, prefs.swimlane, nameByUserId]);

  const activeItem = activeId
    ? localItems.find((item) => item.id === activeId)
    : null;

  const findItem = (id: string) => localItems.find((row) => row.id === id);

  const resolveStatus = (id: string): string | null => {
    if (isWorkflowStatus(workflow, id)) return id;
    const item = findItem(id);
    return item && isWorkflowStatus(workflow, item.status) ? item.status : null;
  };

  const collisionDetection: CollisionDetection = (args) => {
    const pointer = pointerWithin(args);
    if (pointer.length) return pointer;
    return rectIntersection(args);
  };

  const moveToColumn = (itemId: string, status: string, persist = true) => {
    const current = findItem(itemId);
    if (!current || current.status === status) return;

    setLocalItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item)),
    );

    if (!persist) return;

    startTransition(async () => {
      const result = await moveItemStatusQuickAction(
        slug,
        projectSlug,
        itemId,
        status,
      );
      if (result.error) {
        setLocalItems(serverItemsRef.current);
      } else {
        serverItemsRef.current = serverItemsRef.current.map((item) =>
          item.id === itemId ? { ...item, status } : item,
        );
      }
    });
  };

  const reorderInColumn = (
    itemId: string,
    overId: string,
    status: string,
  ) => {
    const columnItems = localItems.filter((item) => item.status === status);
    const oldIndex = columnItems.findIndex((item) => item.id === itemId);
    const newIndex = columnItems.findIndex((item) => item.id === overId);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

    const reordered = arrayMove(columnItems, oldIndex, newIndex);
    const others = localItems.filter((item) => item.status !== status);
    setLocalItems([...others, ...reordered]);
  };

  const columnOrder = (status: string) =>
    localItems.filter((item) => item.status === status).map((item) => item.id);

  const serverColumnOrder = (status: string) =>
    serverItemsRef.current
      .filter((item) => item.status === status)
      .map((item) => item.id);

  const applyReorderResult = (status: string, orderedIds: string[]) => {
    const positions = new Map(orderedIds.map((id, index) => [id, index]));
    serverItemsRef.current = serverItemsRef.current.map((item) =>
      item.status === status && positions.has(item.id)
        ? { ...item, position: positions.get(item.id)! }
        : item,
    );
  };

  const persistColumnIfNeeded = async (columnStatus: string) => {
    const orderedIds = columnOrder(columnStatus);
    if (orderedIds.join() === serverColumnOrder(columnStatus).join()) return true;
    const result = await reorderKanbanColumnAction(
      slug,
      projectSlug,
      columnStatus,
      orderedIds,
    );
    if (result.error) {
      setLocalItems(serverItemsRef.current);
      return false;
    }
    applyReorderResult(columnStatus, orderedIds);
    return true;
  };

  const onDragStart = (event: DragStartEvent) => {
    if (!writable || pending) return;
    setActiveId(String(event.active.id));
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!writable || !over) return;

    const activeItemId = String(active.id);
    const overId = String(over.id);
    if (activeItemId === overId) return;

    const activeRow = findItem(activeItemId);
    if (!activeRow) return;

    const overStatus = resolveStatus(overId);
    if (!overStatus) return;

    if (activeRow.status !== overStatus) {
      moveToColumn(activeItemId, overStatus, false);
      return;
    }

    if (!isWorkflowStatus(workflow, overId)) {
      reorderInColumn(activeItemId, overId, overStatus);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (!writable) return;

    const itemId = String(event.active.id);
    const row = findItem(itemId);
    const serverRow = serverItemsRef.current.find((item) => item.id === itemId);
    if (!row || !serverRow) return;

    const status = isWorkflowStatus(workflow, row.status) ? row.status : null;
    if (!status) return;

    const statusChanged = row.status !== serverRow.status;

    startTransition(async () => {
      if (statusChanged) {
        const result = await moveItemStatusQuickAction(
          slug,
          projectSlug,
          itemId,
          row.status,
        );
        if (result.error) {
          setLocalItems(serverItemsRef.current);
          return;
        }
        serverItemsRef.current = serverItemsRef.current.map((item) =>
          item.id === itemId ? { ...item, status: row.status } : item,
        );
      }
      if (!(await persistColumnIfNeeded(status))) return;
      if (statusChanged && isWorkflowStatus(workflow, serverRow.status)) {
        await persistColumnIfNeeded(serverRow.status);
      }
    });
  };

  const onDragCancel = () => {
    setActiveId(null);
    setLocalItems(serverItemsRef.current);
  };

  return (
    <DndContext
      accessibility={{ screenReaderInstructions: { draggable: "Pick up a ticket with space or enter. Move with arrow keys." } }}
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <ScrollArea className="w-full">
        <div
          className={cn(
            "flex flex-col gap-6 pb-2",
            prefs.swimlane !== "none" && "md:gap-8",
          )}
        >
          {lanes.map((lane) => (
            <KanbanRow
              key={lane.key || "flat"}
              label={lane.label}
              localItems={lane.items}
              statuses={statuses}
              workflow={workflow}
              writable={writable}
              pending={pending}
              activeId={activeId}
              compact={prefs.compact}
            />
          ))}
        </div>
      </ScrollArea>

      <DragOverlay dropAnimation={dropAnimation} modifiers={[restrictToWindowEdges]}>
        {activeItem ? (
          <div className="w-72 rotate-1 scale-[1.02] cursor-grabbing shadow-xl">
            <TicketCard
              ticket={activeItem}
              draggable
              dragging
              compact={prefs.compact}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
