"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProjectAction, type BoardFormState } from "@/lib/items/actions";

const initial: BoardFormState = {};

export function CreateProjectForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createProjectAction, initial);

  useEffect(() => {
    if (state.projectSlug) router.push(`/t/${slug}/p/${state.projectSlug}`);
  }, [state.projectSlug, slug, router]);

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />
      <div>
        <Label htmlFor="name">Board name</Label>
        <Input id="name" name="name" required placeholder="Atlas" />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Opening…" : "Open board"}
      </Button>
    </form>
  );
}
