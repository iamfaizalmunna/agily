"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createItemAction, type BoardFormState } from "@/lib/items/actions";
import { LabelPicker } from "@/components/labels/label-picker";
import type { LabelChip } from "@/lib/labels/labels";
import {
  DEFAULT_ITEM_PRIORITY,
  ITEM_PRIORITIES,
  PRIORITY_LABEL,
} from "@/lib/items/priority";

const initial: BoardFormState = {};

export function CreateItemForm({
  slug,
  projectSlug,
  groupId,
  teamLabels = [],
}: {
  slug: string;
  projectSlug: string;
  groupId: string;
  teamLabels?: LabelChip[];
}) {
  const [state, action, pending] = useActionState(createItemAction, initial);

  return (
    <form action={action} className="mt-3 flex flex-col gap-2">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="groupId" value={groupId} />
      <Input name="title" required placeholder="New ticket" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Select
          name="priority"
          defaultValue={DEFAULT_ITEM_PRIORITY}
          className="h-10 px-3 text-sm"
        >
          {ITEM_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABEL[priority]}
            </option>
          ))}
        </Select>
        <Input name="dueOn" type="date" />
      </div>
      <LabelPicker labels={teamLabels} />
      <label className="flex min-h-9 items-center gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="assignMe" className="h-4 w-4 accent-primary" />
        Assign me
      </label>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full sm:w-auto" disabled={pending} variant="outline">
        {pending ? "Adding…" : "Add ticket"}
      </Button>
    </form>
  );
}
