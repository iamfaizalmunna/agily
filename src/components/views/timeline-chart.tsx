import { ProjectGantt } from "@/components/views/project-gantt";
import type { GanttSourceRow } from "@/lib/views/gantt";

export function TimelineChart({
  slug,
  projectSlug,
  items,
  canWrite,
}: {
  slug: string;
  projectSlug: string;
  items: GanttSourceRow[];
  canWrite: boolean;
}) {
  return (
    <ProjectGantt
      slug={slug}
      projectSlug={projectSlug}
      items={items}
      canWrite={canWrite}
    />
  );
}
