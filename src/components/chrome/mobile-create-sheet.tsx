"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { MobileBottomSheet } from "@/components/chrome/mobile-bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { QuickCreateTarget } from "@/lib/create/quick-create";
import {
  DEFAULT_ISSUE_TYPE,
  ISSUE_TYPES,
  ISSUE_TYPE_LABEL,
  type IssueType,
} from "@/lib/items/issue-type";
import { quickCreateItemAction, type BoardFormState } from "@/lib/items/actions";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";

const initial: BoardFormState = {};

export function MobileCreateSheet({
  open,
  onClose,
  slug,
  projects,
  canCreateBoard,
  currentProjectSlug,
}: {
  open: boolean;
  onClose: () => void;
  slug: string;
  projects: QuickCreateTarget[];
  canCreateBoard: boolean;
  currentProjectSlug?: string;
}) {
  const [state, action, pending] = useActionState(quickCreateItemAction, initial);
  const [projectSlug, setProjectSlug] = useState(
    currentProjectSlug ?? projects[0]?.projectSlug ?? "",
  );
  const [type, setType] = useState<IssueType>(DEFAULT_ISSUE_TYPE);
  const target = projects.find((row) => row.projectSlug === projectSlug) ?? projects[0];

  return (
    <MobileBottomSheet open={open} title="Create" onClose={onClose}>
      {projects.length ? (
        <form action={action} className="flex flex-col gap-3">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="groupId" value={target?.groupId ?? ""} />
          <input type="hidden" name="projectSlug" value={target?.projectSlug ?? ""} />
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Board</span>
            <Select
              name="projectPicker"
              value={projectSlug}
              className="h-12"
              onChange={(event) => setProjectSlug(event.target.value)}
            >
              {projects.map((project) => (
                <option key={project.projectSlug} value={project.projectSlug}>
                  {project.projectName}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Type</span>
            <Select
              name="type"
              value={type}
              className="h-12"
              onChange={(event) => setType(event.target.value as IssueType)}
            >
              {ISSUE_TYPES.map((issueType) => (
                <option key={issueType} value={issueType}>
                  {ISSUE_TYPE_LABEL[issueType]}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Title</span>
            <Input name="title" required placeholder="What needs doing?" className="h-12" />
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" name="assignMe" className="size-4 accent-primary" />
            Assign to me
          </label>
          {state.error ? (
            <p className="text-sm text-destructive" role="alert">{state.error}</p>
          ) : null}
          <Button type="submit" className="min-h-12 w-full" disabled={pending || !target}>
            {pending ? "Creating…" : "Create ticket"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          Open a board first, then create tickets from here.
        </p>
      )}
      {canCreateBoard ? (
        <Link
          href={`/t/${slug}#create-board`}
          className={`${mobileTouchTargetClass("mt-4 block text-sm font-medium text-primary")}`}
          onClick={onClose}
        >
          New board
        </Link>
      ) : null}
    </MobileBottomSheet>
  );
}
