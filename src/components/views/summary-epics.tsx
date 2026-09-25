import Link from "next/link";
import { Card } from "@/components/ui/card";
import { epicRollups, type HierarchyNode } from "@/lib/items/hierarchy";

export function SummaryEpics({
  items,
  focusHref,
}: {
  items: HierarchyNode[];
  focusHref: (id: string) => string;
}) {
  const rollups = epicRollups(items).filter((row) => row.totalChildren > 0);
  if (!rollups.length) return null;

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-medium">Epics</p>
      <ul className="space-y-2">
        {rollups.map((epic) => (
          <li key={epic.id} className="flex items-center justify-between gap-3 text-sm">
            <Link href={focusHref(epic.id)} className="font-medium hover:text-primary">
              {epic.title}
            </Link>
            <span className="text-xs text-muted-foreground">
              {epic.openChildren} open / {epic.totalChildren} children
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
