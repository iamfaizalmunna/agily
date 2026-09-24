"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGroupAction, type BoardFormState } from "@/lib/items/actions";

const initial: BoardFormState = {};

export function CreateGroupForm({
  slug,
  projectSlug,
}: {
  slug: string;
  projectSlug: string;
}) {
  const [state, action, pending] = useActionState(createGroupAction, initial);

  return (
    <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="projectSlug" value={projectSlug} />
      <Input name="name" required placeholder="New section" className="sm:max-w-xs" />
      <Button className="min-h-12" disabled={pending}>
        {pending ? "Adding…" : "Add section"}
      </Button>
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
