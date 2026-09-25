"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  createLabelAction,
  deleteLabelAction,
  updateLabelAction,
  type LabelFormState,
} from "@/lib/labels/actions";
import { LABEL_PALETTE, type LabelChip } from "@/lib/labels/labels";

const initial: LabelFormState = {};

export function LabelsSettings({
  slug,
  labels,
}: {
  slug: string;
  labels: LabelChip[];
}) {
  const [createState, createAction, creating] = useActionState(
    createLabelAction,
    initial,
  );

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold">Labels</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Team-wide tags for tickets. Filter boards by label from the filter bar.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {labels.map((label) => (
          <li
            key={label.id}
            className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-end"
          >
            <LabelRowForm slug={slug} label={label} />
          </li>
        ))}
        {!labels.length ? (
          <li className="text-sm text-muted-foreground">No labels yet.</li>
        ) : null}
      </ul>

      <form action={createAction} className="flex flex-col gap-2 border-t border-border pt-4">
        <input type="hidden" name="slug" value={slug} />
        <p className="text-sm font-medium">New label</p>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
          <Input name="name" placeholder="Name" required maxLength={30} />
          <Select name="color" defaultValue={LABEL_PALETTE[4]} className="h-10 px-3 text-sm">
            {LABEL_PALETTE.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </Select>
          <Button type="submit" disabled={creating} variant="outline">
            {creating ? "Adding…" : "Add"}
          </Button>
        </div>
        {createState.error ? (
          <p className="text-sm text-destructive" role="alert">{createState.error}</p>
        ) : null}
      </form>
    </div>
  );
}

function LabelRowForm({ slug, label }: { slug: string; label: LabelChip }) {
  const [state, action, pending] = useActionState(updateLabelAction, initial);

  return (
    <>
      <form action={action} className="grid flex-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="labelId" value={label.id} />
        <Input name="name" defaultValue={label.name} required maxLength={30} />
        <Select name="color" defaultValue={label.color} className="h-10 px-3 text-sm">
          {LABEL_PALETTE.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        {state.error ? (
          <p className="text-sm text-destructive sm:col-span-3" role="alert">
            {state.error}
          </p>
        ) : null}
      </form>
      <form action={deleteLabelAction}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="labelId" value={label.id} />
        <Button type="submit" variant="quiet" className="text-destructive">
          Delete
        </Button>
      </form>
    </>
  );
}
