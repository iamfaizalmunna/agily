import { ProjectTabs } from "@/components/views/project-tabs";
import type { BoardView } from "@/lib/views/views";

/** @deprecated Use ProjectTabs */
export function ViewSwitcher(props: {
  slug: string;
  projectSlug: string;
  view: BoardView;
  yearMonth?: string;
  extra?: Record<string, string>;
}) {
  return <ProjectTabs {...props} />;
}
