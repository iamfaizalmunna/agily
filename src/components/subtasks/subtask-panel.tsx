"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createSubtaskAction,
  deleteSubtaskAction,
  toggleSubtaskAction,
  type SubtaskFormState,
} from "@/lib/subtasks/actions";
import { formatSubtaskProgress, subtaskProgress } from "@/lib/subtasks/subtasks";
import type { SubtaskRow } from "@/lib/subtasks/subtasks";
import { cn } from "@/lib/cn";

const initial: SubtaskFormState = {};

export function SubtaskPanel({
  slug,
  projectSlug,
  itemId,
  subtasks,
  readOnly,
}: {
  slug: string;
  projectSlug: string;
  itemId: string;
  subtasks: SubtaskRow[];
  readOnly: boolean;
}) {
  const [state, action, pending] = useActionState(createSubtaskAction, initial);
  const progress = subtaskProgress(subtasks);
  const sorted = subtasks.slice().sort((a, b) => a.position - b.position);

  return (
    <section className="flex flex-col gap-2 rounded-md border border-border bg-muted/20 p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Checklist
        </h3>
        {progress.total ? (
          <span className="text-xs text-muted-foreground">
            {formatSubtaskProgress(progress.done, progress.total)} · {progress.percent}%
          </span>
        ) : null}
      </div>

      <ul className="flex flex-col gap-1">
        {sorted.map((row) => (
          <li
            key={row.id}
            className="flex items-center gap-2 rounded-md bg-background px-2 py-1.5 text-sm"
          >
            {readOnly ? (
              <span
                className={cn(
                  "size-4 shrink-0 rounded border border-border",
                  row.done && "bg-primary",
                )}
                aria-hidden
              />
            ) : (
              <form action={toggleSubtaskAction}>
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="projectSlug" value={projectSlug} />
                <input type="hidden" name="itemId" value={itemId} />
                <input type="hidden" name="subtaskId" value={row.id} />
                <button
                  type="submit"
                  className={cn(
                    "size-4 shrink-0 rounded border border-border",
                    row.done && "bg-primary",
                  )}
                  aria-label={row.done ? "Mark not done" : "Mark done"}
                />
              </form>
            )}
            <span className={cn("min-w-0 flex-1", row.done && "text-muted-foreground line-through")}>
              {row.title}
            </span>
            {!readOnly ? (
              <form action={deleteSubtaskAction}>
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="projectSlug" value={projectSlug} />
                <input type="hidden" name="itemId" value={itemId} />
                <input type="hidden" name="subtaskId" value={row.id} />
                <Button type="submit" variant="quiet" size="sm" className="h-7 px-2 text-xs">
                  Remove
                </Button>
              </form>
            ) : null}
          </li>
        ))}
      </ul>

      {!readOnly ? (
        <form action={action} className="flex gap-2">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="itemId" value={itemId} />
          <Input name="title" placeholder="Add checklist item" className="h-9 flex-1" />
          <Button type="submit" variant="outline" disabled={pending} className="shrink-0">
            Add
          </Button>
        </form>
      ) : null}
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">{state.error}</p>
      ) : null}
    </section>
  );
}
