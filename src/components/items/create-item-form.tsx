"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createItemAction, type BoardFormState } from "@/lib/items/actions";
import { LabelPicker } from "@/components/labels/label-picker";
import type { LabelChip } from "@/lib/labels/labels";
import {
  DEFAULT_ISSUE_TYPE,
  ISSUE_TYPES,
  ISSUE_TYPE_LABEL,
  parseIssueType,
  type IssueType,
} from "@/lib/items/issue-type";
import {
  DEFAULT_ITEM_PRIORITY,
  ITEM_PRIORITIES,
  PRIORITY_LABEL,
  parseItemPriority,
  type ItemPriority,
} from "@/lib/items/priority";
import {
  findTicketTemplate,
  type TicketTemplate,
} from "@/lib/data/templates";

const initial: BoardFormState = {};

export function CreateItemForm({
  slug,
  projectSlug,
  groupId,
  teamLabels = [],
  epics = [],
  templates = [],
}: {
  slug: string;
  projectSlug: string;
  groupId: string;
  teamLabels?: LabelChip[];
  epics?: { id: string; title: string }[];
  templates?: TicketTemplate[];
}) {
  const [state, action, pending] = useActionState(createItemAction, initial);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<IssueType>(DEFAULT_ISSUE_TYPE);
  const [priority, setPriority] = useState<ItemPriority>(DEFAULT_ITEM_PRIORITY);

  const applyTemplate = (templateId: string) => {
    if (!templateId) return;
    const template = findTicketTemplate(templateId, templates);
    if (!template) return;
    setTitle(template.title);
    setBody(template.body);
    setType(template.type);
    setPriority(template.priority);
  };

  return (
    <form action={action} className="mt-3 flex flex-col gap-2">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="groupId" value={groupId} />
      {templates.length ? (
        <Select
          name="template"
          defaultValue=""
          className="h-10 px-3 text-sm"
          onChange={(event) => applyTemplate(event.target.value)}
        >
          <option value="">From template…</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </Select>
      ) : null}
      <Input
        name="title"
        required
        placeholder="New ticket"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Select
          name="type"
          value={type}
          onChange={(event) => setType(parseIssueType(event.target.value))}
          className="h-10 px-3 text-sm"
        >
          {ISSUE_TYPES.map((issueType) => (
            <option key={issueType} value={issueType}>
              {ISSUE_TYPE_LABEL[issueType]}
            </option>
          ))}
        </Select>
        {epics.length ? (
          <Select name="parentId" defaultValue="" className="h-10 px-3 text-sm">
            <option value="">No epic</option>
            {epics.map((epic) => (
              <option key={epic.id} value={epic.id}>
                {epic.title}
              </option>
            ))}
          </Select>
        ) : null}
        <Select
          name="priority"
          value={priority}
          onChange={(event) => setPriority(parseItemPriority(event.target.value))}
          className="h-10 px-3 text-sm"
        >
          {ITEM_PRIORITIES.map((level) => (
            <option key={level} value={level}>
              {PRIORITY_LABEL[level]}
            </option>
          ))}
        </Select>
        <Input name="dueOn" type="date" />
      </div>
      <textarea
        name="body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        placeholder="Description"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
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
