import { notFound } from "next/navigation";
import { InviteForm } from "@/components/teams/invite-form";
import { CopyLinkButton } from "@/components/teams/copy-link-button";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/session";
import {
  canChangeMemberRole,
  canInvite,
  canRemoveMember,
  inviteRolesFor,
  parseTeamSettings,
  TEAM_ROLES,
  type TeamRole,
} from "@/lib/rbac/roles";
import {
  changeMemberRoleAction,
  removeMemberAction,
  revokeInviteAction,
} from "@/lib/teams/actions";
import { assignmentCounts } from "@/lib/items/queries";
import { appOrigin, getMembership } from "@/lib/teams/queries";

export default async function PeoplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) notFound();

  const settings = parseTeamSettings(ctx.team.settings);
  const mayInvite = canInvite(ctx.role, settings);
  const roles = inviteRolesFor(ctx.role);
  const origin = await appOrigin();
  const counts = await assignmentCounts(ctx.team.id);

  return (
    <section className="flex flex-col gap-10">
      <div>
        <p className="font-display text-xs tracking-[0.22em] text-copper uppercase">
          People
        </p>
        <h1 className="mt-3 font-display text-3xl text-paper sm:text-4xl">
          {ctx.team.name}
        </h1>
      </div>

      <ul className="flex flex-col gap-2">
        {ctx.team.members.map((member) => {
          const role = member.role as TeamRole;
          const canKick = canRemoveMember(ctx.role, role) && member.userId !== user.id;
          return (
            <li
              key={member.id}
              className="flex flex-col gap-3 rounded-2xl border border-paper/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-paper">{member.user.name}</p>
                <p className="truncate text-xs text-paper/40">
                  {member.user.email}
                  {` · ${counts[member.userId] ?? 0} tickets`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {canChangeMemberRole(ctx.role, role, role) ? (
                  <form action={changeMemberRoleAction} className="flex gap-2">
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="memberId" value={member.id} />
                    <select
                      name="role"
                      defaultValue={role}
                      className="h-12 rounded-2xl border border-paper/10 bg-ink px-3 text-sm text-paper"
                    >
                      {TEAM_ROLES.filter(
                        (r) => r === role || canChangeMemberRole(ctx.role, role, r),
                      ).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="ghost" className="min-h-12">
                      Save
                    </Button>
                  </form>
                ) : (
                  <span className="text-xs uppercase tracking-[0.14em] text-paper/40">
                    {role}
                  </span>
                )}
                {canKick ? (
                  <form action={removeMemberAction}>
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="memberId" value={member.id} />
                    <Button type="submit" variant="quiet">
                      Remove
                    </Button>
                  </form>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {mayInvite && roles.length ? (
        <div className="max-w-sm">
          <h2 className="mb-4 font-display text-xl text-paper">Invite</h2>
          <InviteForm slug={slug} roles={roles} origin={origin} />
        </div>
      ) : (
        <p className="text-sm text-paper/45">You cannot invite people in this role.</p>
      )}

      {ctx.team.invites.length ? (
        <div>
          <h2 className="mb-4 font-display text-xl text-paper">Open links</h2>
          <ul className="flex flex-col gap-3">
            {ctx.team.invites.map((invite) => {
              const url = `${origin}/join/${invite.token}`;
              return (
                <li
                  key={invite.id}
                  className="flex flex-col gap-3 rounded-2xl border border-paper/10 p-4"
                >
                  <p className="text-sm">
                    {invite.email} · {invite.role}
                  </p>
                  <p className="break-all text-xs text-paper/40">{url}</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <CopyLinkButton url={url} />
                    <form action={revokeInviteAction}>
                      <input type="hidden" name="slug" value={slug} />
                      <input type="hidden" name="inviteId" value={invite.id} />
                      <Button type="submit" variant="quiet">
                        Revoke
                      </Button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
