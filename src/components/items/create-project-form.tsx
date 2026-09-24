"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProjectAction, type BoardFormState } from "@/lib/items/actions";

const initial: BoardFormState = {};

export function CreateProjectForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(createProjectAction, initial);

  return (
    <form action={action} className="flex max-w-sm flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />
      <div>
        <Label htmlFor="name">Board name</Label>
        <Input id="name" name="name" required placeholder="Atlas" />
      </div>
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button className="min-h-12 w-full sm:w-auto" disabled={pending}>
        {pending ? "Opening…" : "Open board"}
      </Button>
    </form>
  );
}
