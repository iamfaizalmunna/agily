"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AssigneeMarks } from "@/components/items/assignee-marks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { noteLabel } from "@/lib/focus/focus";
import {
  assignToMeAction,
  updateItemAction,
  type BoardFormState,
} from "@/lib/items/actions";
import { isAssigned } from "@/lib/items/assign";
import {
  ITEM_PRIORITIES,
  PRIORITY_LABEL,
  type ItemPriority,
} from "@/lib/items/priority";
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
  compact = false,
  openHref,
  next,
  noteCount = 0,
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
    priority: string;
    dueOn: Date | null;
    assignees: { user: Person }[];
  };
  readOnly: boolean;
  compact?: boolean;
  openHref?: string;
  next?: string;
  noteCount?: number;
}) {
  const [state, action, pending] = useActionState(updateItemAction, initial);
  const assignedIds = item.assignees.map((row) => row.user.id);
  const assignedPeople = item.assignees.map((row) => row.user);
  const priority = item.priority as ItemPriority;

  if (compact && openHref) {
    return (
      <li id={`item-${item.id}`} className="rounded-lg border border-border bg-card">
        <Link href={openHref} className="flex flex-col gap-1 px-4 py-3">
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground">
            {PRIORITY_LABEL[priority] ?? item.priority}
            {" · "}
            {STATUS_LABEL[item.status as ItemStatus] ?? item.status}
            {item.dueOn ? ` · ${formatDueOn(item.dueOn)}` : ""}
            {` · ${noteLabel(noteCount)}`}
          </p>
          <AssigneeMarks people={assignedPeople} />
        </Link>
      </li>
    );
  }

  if (readOnly) {
    return (
      <li id={`item-${item.id}`} className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="font-medium">{item.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {PRIORITY_LABEL[priority] ?? item.priority}
          {" · "}
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
    <li id={`item-${item.id}`} className="rounded-lg border border-border bg-card p-4">
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="itemId" value={item.id} />
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <Input name="title" defaultValue={item.title} required />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Select
            name="priority"
            defaultValue={item.priority}
            className="h-10 px-3 text-sm"
          >
            {ITEM_PRIORITIES.map((level) => (
              <option key={level} value={level}>
                {PRIORITY_LABEL[level]}
              </option>
            ))}
          </Select>
          <Select
            name="status"
            defaultValue={item.status}
            className="h-10 px-3 text-sm"
          >
            {ITEM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABEL[status]}
              </option>
            ))}
          </Select>
          <Input name="dueOn" type="date" defaultValue={formatDueOn(item.dueOn)} />
        </div>
        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            People
          </legend>
          <div className="flex flex-col gap-2">
            {people.map((person) => (
              <label key={person.id} className="flex min-h-9 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name="assigneeIds"
                  value={person.id}
                  defaultChecked={isAssigned(assignedIds, person.id)}
                  className="h-4 w-4 accent-primary"
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
          placeholder="Notes and context for this ticket."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        {state.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" className="w-full sm:w-auto" disabled={pending} variant="outline">
          {pending ? "Saving…" : "Save"}
        </Button>
      </form>
      <form action={assignToMeAction} className="mt-2">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="itemId" value={item.id} />
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <Button type="submit" variant="quiet">
          {isAssigned(assignedIds, currentUserId) ? "Unassign me" : "Assign me"}
        </Button>
      </form>
    </li>
  );
}
