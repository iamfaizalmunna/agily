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
import { ItemCustomFields } from "@/components/items/item-custom-fields";
import type { CustomFieldDef, CustomFieldValues } from "@/lib/custom-fields/fields";
import {
  workflowStatusLabel,
  type Workflow,
} from "@/lib/workflow/workflow";
import { LabelBadges } from "@/components/labels/label-badges";
import { LabelPicker } from "@/components/labels/label-picker";
import type { LabelChip } from "@/lib/labels/labels";
import { SubtaskPanel } from "@/components/subtasks/subtask-panel";
import type { SubtaskRow } from "@/lib/subtasks/subtasks";
import { HierarchyCrumb } from "@/components/items/hierarchy-crumb";
import {
  ISSUE_TYPES,
  ISSUE_TYPE_LABEL,
  parseIssueType,
  type IssueType,
} from "@/lib/items/issue-type";
import { formatDueOn } from "@/lib/items/validate";
import {
  formatStoryPoints,
  storyPointsLabel,
} from "@/lib/items/story-points";

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
  teamLabels = [],
  itemLabels = [],
  subtasks = [],
  epics = [],
  parent = null,
  workflow,
  fieldSchema = [],
  customFields = {},
  focusDetail = false,
}: {
  slug: string;
  projectSlug: string;
  currentUserId: string;
  people: Person[];
  teamLabels?: LabelChip[];
  itemLabels?: LabelChip[];
  subtasks?: SubtaskRow[];
  epics?: { id: string; title: string; position: number }[];
  parent?: {
    id: string;
    title: string;
    type: string;
    position: number;
  } | null;
  workflow: Workflow;
  fieldSchema?: CustomFieldDef[];
  customFields?: CustomFieldValues;
  item: {
    id: string;
    title: string;
    body: string;
    status: string;
    type: string;
    priority: string;
    storyPoints?: number | null;
    parentId?: string | null;
    dueOn: Date | null;
    assignees: { user: Person }[];
  };
  readOnly: boolean;
  compact?: boolean;
  openHref?: string;
  next?: string;
  noteCount?: number;
  focusDetail?: boolean;
}) {
  const [state, action, pending] = useActionState(updateItemAction, initial);
  const assignedIds = item.assignees.map((row) => row.user.id);
  const assignedPeople = item.assignees.map((row) => row.user);
  const priority = item.priority as ItemPriority;
  const issueType = parseIssueType(item.type);

  if (compact && openHref) {
    return (
      <li id={`item-${item.id}`} className="rounded-lg border border-border bg-card">
        <Link href={openHref} className="flex flex-col gap-1 px-4 py-3">
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground">
            {PRIORITY_LABEL[priority] ?? item.priority}
            {" · "}
            {workflowStatusLabel(workflow, item.status)}
            {item.dueOn ? ` · ${formatDueOn(item.dueOn)}` : ""}
            {item.storyPoints != null
              ? ` · ${storyPointsLabel(item.storyPoints)}`
              : ""}
            {` · ${noteLabel(noteCount)}`}
          </p>
          <AssigneeMarks people={assignedPeople} />
          <LabelBadges labels={itemLabels} className="mt-2" />
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
          {workflowStatusLabel(workflow, item.status)}
          {item.dueOn ? ` · ${formatDueOn(item.dueOn)}` : ""}
          {item.storyPoints != null
            ? ` · ${storyPointsLabel(item.storyPoints)}`
            : ""}
        </p>
        <div className="mt-2">
          <AssigneeMarks people={assignedPeople} />
        </div>
        <LabelBadges labels={itemLabels} className="mt-2" />
      </li>
    );
  }

  return (
    <li id={`item-${item.id}`} className="rounded-lg border border-border bg-card p-4">
      {parent ? (
        <HierarchyCrumb
          slug={slug}
          projectSlug={projectSlug}
          parent={parent}
          childType={item.type}
        />
      ) : null}
      <form
        id={focusDetail ? "focus-item-form" : undefined}
        action={action}
        className="flex flex-col gap-3"
      >
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="projectSlug" value={projectSlug} />
        <input type="hidden" name="itemId" value={item.id} />
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <Input name="title" defaultValue={item.title} required />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Select
            name="type"
            defaultValue={item.type}
            className="h-10 px-3 text-sm"
          >
            {ISSUE_TYPES.map((type) => (
              <option key={type} value={type}>
                {ISSUE_TYPE_LABEL[type]}
              </option>
            ))}
          </Select>
          {issueType !== "epic" && epics.length ? (
            <Select
              name="parentId"
              defaultValue={item.parentId ?? ""}
              className="h-10 px-3 text-sm"
            >
              <option value="">No epic</option>
              {epics.map((epic) => (
                <option key={epic.id} value={epic.id}>
                  {epic.title}
                </option>
              ))}
            </Select>
          ) : (
            <input type="hidden" name="parentId" value="" />
          )}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
            id={focusDetail ? "focus-status" : undefined}
            name="status"
            defaultValue={item.status}
            className="h-12 px-3 text-base md:h-10 md:text-sm"
          >
            {workflow.statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </Select>
          <Input
            name="storyPoints"
            type="number"
            min={0}
            max={999}
            inputMode="numeric"
            placeholder="Points"
            defaultValue={formatStoryPoints(item.storyPoints)}
            className="h-10"
          />
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
        <LabelPicker
          labels={teamLabels}
          selectedIds={itemLabels.map((label) => label.id)}
        />
        <ItemCustomFields defs={fieldSchema} values={customFields} />
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
      <SubtaskPanel
        slug={slug}
        projectSlug={projectSlug}
        itemId={item.id}
        subtasks={subtasks}
        readOnly={readOnly}
      />
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
