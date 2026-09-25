"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CopyLinkButton } from "@/components/teams/copy-link-button";
import { createInviteAction, type TeamFormState } from "@/lib/teams/actions";
import type { TeamRole } from "@/lib/rbac/roles";

const initial: TeamFormState = {};

export function InviteForm({
  slug,
  roles,
  origin,
}: {
  slug: string;
  roles: TeamRole[];
  origin: string;
}) {
  const [state, action, pending] = useActionState(createInviteAction, initial);
  const url = state.inviteUrl ? `${origin}${state.inviteUrl}` : null;

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />
      <div>
        <Label htmlFor="email">Email (login key)</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          required
          placeholder="teammate@agily.com"
        />
      </div>
      <div>
        <Label htmlFor="role">Access</Label>
        <Select id="role" name="role" defaultValue={roles[0]}>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>
      </div>
      {state.error ? (
        <p className="text-sm text-copper" role="alert">
          {state.error}
        </p>
      ) : null}
      {url ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-copper/30 bg-copper/10 p-4">
          <p className="break-all text-sm text-paper/80">{url}</p>
          <CopyLinkButton url={url} />
          <p className="text-xs text-paper/45">
            Paste this in chat. We do not send email.
          </p>
        </div>
      ) : null}
      <Button className="min-h-12 w-full sm:w-auto" disabled={pending}>
        {pending ? "Making link…" : "Make join link"}
      </Button>
    </form>
  );
}
