"use client";

import { useActionState } from "react";
import { AssigneeMarks } from "@/components/items/assignee-marks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  assignToMeAction,
  updateItemAction,
  type BoardFormState,
} from "@/lib/items/actions";
import { isAssigned } from "@/lib/items/assign";
import { ITEM_STATUSES, STATUS_LABEL, type ItemStatus } from "@/lib/items/status";
import { formatDueOn } from "@/lib/items/validate";

const initial: BoardFormState = {};

type Person = { id: string; name: string };

export function ItemRow({
  slug,
  projectSlug,
  currentUserId,
  people,
  item,
  readOnly,
}: {
  slug: string;
  projectSlug: string;
  currentUserId: string;
  people: Person[];
  item: {
    id: string;
    title: string;
    body: string;
    status: string;
    dueOn: Date | null;
    assignees: { user: Person }[];
  };
  readOnly: boolean;
}) {
  const [state, action, pending] = useActionState(updateItemAction, initial);
  const assignedIds = item.assignees.map((row) => row.user.id);
  const assignedPeople = item.assignees.map((row) => row.user);

  if (readOnly) {
    return (
      <li className="rounded-2xl border border-paper/10 px-4 py-3">
        <p className="text-paper">{item.title}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-paper/40">
          {STATUS_LABEL[item.status as ItemStatus] ?? item.status}
          {item.dueOn ? ` · ${formatDueOn(item.dueOn)}` : ""}
        </p>
        <div className="mt-2">
          <AssigneeMarks people={assignedPeople} />
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-paper/10 p-4">
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="itemId" value={item.id} />
        <Input name="title" defaultValue={item.title} required />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            name="status"
            defaultValue={item.status}
            className="h-12 rounded-2xl border border-paper/10 bg-ink px-3 text-sm text-paper"
          >
            {ITEM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </select>
          <Input name="dueOn" type="date" defaultValue={formatDueOn(item.dueOn)} />
        </div>
        <fieldset>
          <legend className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-paper/50">
            People
          </legend>
          <div className="flex flex-col gap-2">
            {people.map((person) => (
              <label key={person.id} className="flex min-h-11 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name="assigneeIds"
                  value={person.id}
                  defaultChecked={isAssigned(assignedIds, person.id)}
                  className="h-4 w-4 accent-copper"
                />
                {person.name}
              </label>
            ))}
          </div>
        </fieldset>
        <textarea
          name="body"
          defaultValue={item.body}
          rows={3}
          placeholder="Write like a page — short markdown is fine."
          className="w-full rounded-2xl border border-paper/10 bg-paper/[0.04] px-4 py-3 text-base text-paper outline-none placeholder:text-paper/35 focus:border-copper/70"
        />
        {state.error ? (
          <p className="text-sm text-copper" role="alert">
            {state.error}
          </p>
        ) : null}
        <Button className="min-h-12 w-full sm:w-auto" disabled={pending} variant="ghost">
          {pending ? "Saving…" : "Save"}
        </Button>
      </form>
      <form action={assignToMeAction} className="mt-2">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="itemId" value={item.id} />
        <Button type="submit" variant="quiet">
          {isAssigned(assignedIds, currentUserId) ? "Unassign me" : "Assign me"}
        </Button>
      </form>
    </li>
  );
}
