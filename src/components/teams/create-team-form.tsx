"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTeamAction, type TeamFormState } from "@/lib/teams/actions";

const initial: TeamFormState = {};

export function CreateTeamForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(createTeamAction, initial);

  useEffect(() => {
    if (state.slug) router.push(`/t/${state.slug}`);
  }, [state.slug, router]);

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      <div>
        <Label htmlFor="name">Studio name</Label>
        <Input id="name" name="name" required placeholder="Northwind" />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Creating…" : "Start studio"}
      </Button>
    </form>
  );
}
