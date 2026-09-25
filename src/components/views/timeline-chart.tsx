import { ProjectGantt } from "@/components/views/project-gantt";
import type { GanttSourceRow } from "@/lib/views/gantt";

export function TimelineChart({ items }: { items: GanttSourceRow[] }) {
  return <ProjectGantt items={items} />;
}
