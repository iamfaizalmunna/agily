import { KanbanBoard } from "@/components/views/kanban-board";
import type { BoardDisplayPrefs } from "@/lib/board/kanban";

type FlowItem = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueOn: Date | null;
  href: string;
  people: { id: string; name: string }[];
  position: number;
  projectSlug: string;
};

export function FlowRiver({
  slug,
  projectSlug,
  items,
  writable,
  prefs,
  nameByUserId,
}: {
  slug: string;
  projectSlug: string;
  items: FlowItem[];
  writable: boolean;
  prefs: BoardDisplayPrefs;
  nameByUserId: Map<string, string>;
}) {
  return (
    <KanbanBoard
      slug={slug}
      projectSlug={projectSlug}
      items={items}
      writable={writable}
      prefs={prefs}
      nameByUserId={nameByUserId}
    />
  );
}
