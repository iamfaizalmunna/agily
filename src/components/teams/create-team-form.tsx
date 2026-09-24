"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTeamAction, type TeamFormState } from "@/lib/teams/actions";

const initial: TeamFormState = {};

export function CreateTeamForm() {
  const [state, action, pending] = useActionState(createTeamAction, initial);

  return (
    <form action={action} className="flex max-w-sm flex-col gap-4">
      <div>
        <Label htmlFor="name">Studio name</Label>
        <Input id="name" name="name" required placeholder="Northwind" />
      </div>
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button className="min-h-12 w-full sm:w-auto" disabled={pending}>
        {pending ? "Creating…" : "Start studio"}
      </Button>
    </form>
  );
}
