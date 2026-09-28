"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  CUSTOM_FIELD_TYPES,
  type CustomFieldDef,
} from "@/lib/custom-fields/fields";
import {
  addCustomFieldAction,
  removeCustomFieldAction,
  saveProjectWorkflowAction,
  type ProjectSettingsFormState,
} from "@/lib/projects/board-settings-actions";
import type { Workflow } from "@/lib/workflow/workflow";
import { serializeWorkflow } from "@/lib/workflow/workflow";

const initial: ProjectSettingsFormState = {};

export function ProjectBoardSettings({
  slug,
  projectSlug,
  projectName,
  workflow,
  fieldSchema,
}: {
  slug: string;
  projectSlug: string;
  projectName: string;
  workflow: Workflow;
  fieldSchema: CustomFieldDef[];
}) {
  const [rows, setRows] = useState(workflow.statuses);
  const workflowJson = useMemo(
    () => serializeWorkflow({ statuses: rows }),
    [rows],
  );
  const [workflowState, workflowAction, savingWorkflow] = useActionState(
    saveProjectWorkflowAction,
    initial,
  );
  const [fieldState, fieldAction, addingField] = useActionState(
    addCustomFieldAction,
    initial,
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">Workflow</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Column order, labels, and accent colors. Core status ids stay fixed for
            compatibility.
          </p>
        </div>
        <form action={workflowAction} className="flex flex-col gap-3">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <input type="hidden" name="workflow" value={workflowJson} readOnly />
          <ul className="flex flex-col gap-2">
            {rows.map((row, index) => (
              <li
                key={row.id}
                className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto]"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  {row.id}
                </span>
                <Input
                  value={row.label}
                  onChange={(event) => {
                    const label = event.target.value;
                    setRows((prev) =>
                      prev.map((status, i) =>
                        i === index ? { ...status, label } : status,
                      ),
                    );
                  }}
                  aria-label={`Label for ${row.id}`}
                />
                <Input
                  type="color"
                  value={row.color}
                  className="h-10 w-full min-w-[4rem] p-1"
                  onChange={(event) => {
                    const color = event.target.value;
                    setRows((prev) =>
                      prev.map((status, i) =>
                        i === index ? { ...status, color } : status,
                      ),
                    );
                  }}
                  aria-label={`Color for ${row.id}`}
                />
              </li>
            ))}
          </ul>
          {workflowState.error ? (
            <p className="text-sm text-destructive">{workflowState.error}</p>
          ) : null}
          {workflowState.ok ? (
            <p className="text-sm text-primary">Workflow saved.</p>
          ) : null}
          <Button type="submit" disabled={savingWorkflow}>
            Save workflow
          </Button>
        </form>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">Custom fields</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional metadata on tickets in list and detail views.
          </p>
        </div>
        <ul className="flex flex-col gap-2">
          {fieldSchema.map((field) => (
            <li
              key={field.id}
              className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{field.label}</p>
                <p className="text-xs text-muted-foreground">
                  {field.type}
                  {field.options?.length ? ` · ${field.options.join(", ")}` : ""}
                </p>
              </div>
              <RemoveFieldButton
                slug={slug}
                projectSlug={projectSlug}
                fieldId={field.id}
              />
            </li>
          ))}
          {!fieldSchema.length ? (
            <li className="text-sm text-muted-foreground">No custom fields yet.</li>
          ) : null}
        </ul>
        <form action={fieldAction} className="flex flex-col gap-2 border-t border-border pt-4">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="projectSlug" value={projectSlug} />
          <p className="text-sm font-medium">Add field</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input name="label" placeholder="Label" required maxLength={40} />
            <Select name="type" defaultValue="text" className="h-10 px-3 text-sm">
              {CUSTOM_FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <Input
            name="options"
            placeholder="Select options (comma-separated)"
            className="text-sm"
          />
          {fieldState.error ? (
            <p className="text-sm text-destructive">{fieldState.error}</p>
          ) : null}
          <Button type="submit" disabled={addingField}>Add field</Button>
        </form>
      </div>
    </div>
  );
}

function RemoveFieldButton({
  slug,
  projectSlug,
  fieldId,
}: {
  slug: string;
  projectSlug: string;
  fieldId: string;
}) {
  const [state, action, pending] = useActionState(removeCustomFieldAction, initial);
  return (
    <form action={action}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="fieldId" value={fieldId} />
      {state.error ? (
        <p className="text-xs text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        Remove
      </Button>
    </form>
  );
}
