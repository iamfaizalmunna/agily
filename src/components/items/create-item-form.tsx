"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createItemAction, type BoardFormState } from "@/lib/items/actions";

const initial: BoardFormState = {};

export function CreateItemForm({
  slug,
  projectSlug,
  groupId,
}: {
  slug: string;
  projectSlug: string;
  groupId: string;
}) {
  const [state, action, pending] = useActionState(createItemAction, initial);

  return (
    <form action={action} className="mt-3 flex flex-col gap-2">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <input type="hidden" name="groupId" value={groupId} />
      <Input name="title" required placeholder="New ticket" />
      <Input name="dueOn" type="date" />
      <label className="flex min-h-11 items-center gap-3 text-sm text-paper/70">
        <input type="checkbox" name="assignMe" className="h-4 w-4 accent-copper" />
        Assign me
      </label>
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button className="min-h-12 w-full sm:w-auto" disabled={pending} variant="ghost">
        {pending ? "Adding…" : "Add ticket"}
      </Button>
    </form>
  );
}
