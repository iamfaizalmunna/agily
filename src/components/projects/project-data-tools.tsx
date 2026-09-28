"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  duplicateProjectAction,
  importBoardCsvAction,
  type DataFormState,
} from "@/lib/data/actions";

const initial: DataFormState = {};

export function ProjectDataTools({
  slug,
  projectSlug,
  exportHref,
}: {
  slug: string;
  projectSlug: string;
  exportHref: string;
}) {
  const [importState, importAction, importing] = useActionState(
    importBoardCsvAction,
    initial,
  );

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold">Import & export</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Move tickets in and out as CSV. Export respects the same filters as the
          board when you use Export from the board header.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={exportHref}
          className="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium hover:bg-muted"
        >
          Download CSV (all tickets)
        </a>
      </div>
      <form action={importAction} className="flex flex-col gap-2">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <label className="text-sm font-medium" htmlFor="csv-import">
          Import CSV
        </label>
        <textarea
          id="csv-import"
          name="csv"
          rows={6}
          placeholder="title,status,priority,due,assignee,type,group"
          className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">
          Columns: title (required), status, priority, due (YYYY-MM-DD), assignee
          (email), type, group.
        </p>
        {importState.error ? (
          <p className="text-sm text-destructive">{importState.error}</p>
        ) : null}
        {importState.ok ? (
          <p className="text-sm text-primary">
            Imported {importState.imported ?? 0} ticket(s).
          </p>
        ) : null}
        <Button type="submit" disabled={importing} variant="outline">
          Import tickets
        </Button>
      </form>
      <form action={duplicateProjectAction}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <p className="text-sm font-medium">Duplicate board</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Clone this board with all groups, tickets, subtasks, and labels.
        </p>
        <Button type="submit" className="mt-2" variant="quiet">
          Duplicate with tickets
        </Button>
      </form>
    </div>
  );
}
