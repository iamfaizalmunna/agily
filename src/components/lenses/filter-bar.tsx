import { FilterBarDesktop } from "@/components/lenses/filter-bar-desktop";
import { FilterBarMobile } from "@/components/lenses/filter-bar-mobile";
import type { LensSpec } from "@/lib/lenses/lenses";
import type { LabelChip } from "@/lib/labels/labels";
import type { BoardView } from "@/lib/views/views";

type SavedLens = { id: string; name: string; spec: LensSpec };
type Person = { id: string; name: string };

export function FilterBar({
  slug,
  projectSlug,
  view,
  yearMonth,
  spec,
  savedId,
  saved,
  people,
  teamLabels,
  epics,
}: {
  slug: string;
  projectSlug: string;
  view: BoardView;
  yearMonth?: string;
  spec: LensSpec;
  savedId?: string;
  saved: SavedLens[];
  people: Person[];
  teamLabels: LabelChip[];
  epics: { id: string; title: string }[];
}) {
  const props = {
    slug,
    projectSlug,
    view,
    yearMonth,
    spec,
    savedId,
    saved,
    people,
    teamLabels,
    epics,
  };

  return (
    <div className="w-full min-w-0">
      <FilterBarMobile {...props} />
      <FilterBarDesktop {...props} />
    </div>
  );
}
