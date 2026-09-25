"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  updateTeamSettingsAction,
  type TeamFormState,
} from "@/lib/teams/actions";
import { TEAM_ROLES, type TeamSettings } from "@/lib/rbac/roles";

const initial: TeamFormState = {};

export function SettingsForm({
  slug,
  settings,
}: {
  slug: string;
  settings: TeamSettings;
}) {
  const [state, action, pending] = useActionState(updateTeamSettingsAction, initial);

  return (
    <form action={action} className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
      <input type="hidden" name="slug" value={slug} />

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="membersCanCreateProjects"
          className="mt-1 h-4 w-4 accent-primary"
          defaultChecked={settings.membersCanCreateProjects}
        />
        <span>
          <span className="font-medium">Members can create boards</span>
          <span className="mt-1 block text-muted-foreground">
            When off, only owners and admins can add new project boards.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="membersCanInvite"
          className="mt-1 h-4 w-4 accent-primary"
          defaultChecked={settings.membersCanInvite}
        />
        <span>
          <span className="font-medium">Members can invite people</span>
          <span className="mt-1 block text-muted-foreground">
            When off, only owners and admins can send invite links.
          </span>
        </span>
      </label>

      <div className="flex flex-col gap-2">
        <label htmlFor="defaultInviteRole" className="text-sm font-medium">
          Default invite role
        </label>
        <Select
          id="defaultInviteRole"
          name="defaultInviteRole"
          defaultValue={settings.defaultInviteRole}
          className="h-10 px-3 text-sm"
        >
          {TEAM_ROLES.filter((role) => role !== "owner").map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </Select>
        <p className="text-xs text-muted-foreground">
          Pre-selected when creating a new invite link.
        </p>
      </div>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">{state.error}</p>
      ) : null}

      <Button type="submit" className="w-fit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
