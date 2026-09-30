import { KanbanBoard } from "@/components/views/kanban-board";
import type { BoardDisplayPrefs } from "@/lib/board/kanban";
import type { Workflow } from "@/lib/workflow/workflow";

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
  compactQuery,
  nameByUserId,
  workflow,
}: {
  slug: string;
  projectSlug: string;
  items: FlowItem[];
  writable: boolean;
  prefs: BoardDisplayPrefs;
  compactQuery?: string;
  nameByUserId: Map<string, string>;
  workflow: Workflow;
}) {
  return (
    <KanbanBoard
      slug={slug}
      projectSlug={projectSlug}
      items={items}
      writable={writable}
      prefs={prefs}
      compactQuery={compactQuery}
      nameByUserId={nameByUserId}
      workflow={workflow}
    />
  );
}
