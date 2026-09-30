import { TimelineMobileView } from "@/components/views/timeline-mobile-view";
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
    <TimelineMobileView
      slug={slug}
      projectSlug={projectSlug}
      items={items}
      canWrite={canWrite}
    />
  );
}
