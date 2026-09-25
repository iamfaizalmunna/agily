import { formatSubtaskProgress, subtaskProgress } from "@/lib/subtasks/subtasks";
import type { SubtaskRow } from "@/lib/subtasks/subtasks";
import { cn } from "@/lib/cn";

export function TicketListChecklist({ subtasks }: { subtasks: SubtaskRow[] }) {
  const progress = subtaskProgress(subtasks);
  if (!progress.total) return null;
  const sorted = subtasks.slice().sort((a, b) => a.position - b.position);

  return (
    <details className="mt-2 group">
      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
        Checklist {formatSubtaskProgress(progress.done, progress.total)}
      </summary>
      <ul className="mt-1.5 space-y-1 border-l border-border pl-3">
        {sorted.map((row) => (
          <li
            key={row.id}
            className={cn(
              "text-xs",
              row.done && "text-muted-foreground line-through",
            )}
          >
            {row.title}
          </li>
        ))}
      </ul>
    </details>
  );
}
