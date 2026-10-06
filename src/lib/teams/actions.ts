"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireUser, normalizeEmail } from "@/lib/auth/session";
import {
  canChangeMemberRole,
  canEditSettings,
  canInvite,
  canRemoveMember,
  inviteRolesFor,
  isTeamRole,
  parseTeamSettings,
  stringifyTeamSettings,
  type TeamRole,
  type TeamSettings,
} from "@/lib/rbac/roles";
import { createTeamForUser } from "@/lib/teams/create";
import { countOwners, getMembership } from "@/lib/teams/queries";
import { inviteExpiry, newInviteToken } from "@/lib/teams/tokens";
import { trustedMutationOriginError } from "@/lib/security/mutation-guard";

export type TeamFormState = {
  error?: string;
  inviteUrl?: string;
  slug?: string;
};

const createTeamSchema = z.object({
  name: z.string().trim().min(1, "Studio needs a name").max(80),
});

export async function createTeamAction(
  _prev: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const originErr = await trustedMutationOriginError();
  if (originErr) return { error: originErr };

  const user = await requireUser();
  const parsed = createTeamSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }
  const team = await createTeamForUser(user.id, parsed.data.name);
  return { slug: team.slug };
}

const inviteSchema = z.object({
  slug: z.string().min(1),
  email: z.string().trim().email("Email is the login key"),
  role: z.string(),
});

export async function createInviteAction(
  _prev: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const originErr = await trustedMutationOriginError();
  if (originErr) return { error: originErr };

  const user = await requireUser();
  const parsed = inviteSchema.safeParse({
    slug: formData.get("slug"),
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }
  if (!isTeamRole(parsed.data.role) || parsed.data.role === "owner") {
    return { error: "Pick admin, member, or viewer" };
  }

  const ctx = await getMembership(user.id, parsed.data.slug);
  if (!ctx) return { error: "Studio not found" };

  const settings = parseTeamSettings(ctx.team.settings);
  if (!canInvite(ctx.role, settings)) {
    return { error: "You cannot invite people here" };
  }
  const allowed = inviteRolesFor(ctx.role);
  if (!allowed.includes(parsed.data.role)) {
    return { error: "You cannot grant that access" };
  }

  const email = normalizeEmail(parsed.data.email);
  const already = ctx.team.members.some(
    (m) => m.user.email === email,
  );
  if (already) return { error: "They are already in this studio" };

  const existingInvite = await prisma.invite.findFirst({
    where: { teamId: ctx.team.id, email },
  });
  const token = existingInvite?.token ?? newInviteToken();
  if (existingInvite) {
    await prisma.invite.update({
      where: { id: existingInvite.id },
      data: { role: parsed.data.role, token, expiresAt: inviteExpiry() },
    });
  } else {
    await prisma.invite.create({
      data: {
        teamId: ctx.team.id,
        email,
        role: parsed.data.role,
        token,
        expiresAt: inviteExpiry(),
      },
    });
  }

  return { inviteUrl: `/join/${token}` };
}

export async function changeMemberRoleAction(formData: FormData) {
  if (await trustedMutationOriginError()) redirect("/home");
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  const next = String(formData.get("role") ?? "");
  if (!isTeamRole(next)) return;

  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");

  const target = ctx.team.members.find((m) => m.id === memberId);
  if (!target) return;
  const targetRole = target.role as TeamRole;
  if (!canChangeMemberRole(ctx.role, targetRole, next)) return;

  if (targetRole === "owner" && next !== "owner") {
    const owners = await countOwners(ctx.team.id);
    if (owners < 2) return;
  }

  await prisma.teamMember.update({
    where: { id: target.id },
    data: { role: next },
  });
  redirect(`/t/${slug}/people`);
}

export async function removeMemberAction(formData: FormData) {
  if (await trustedMutationOriginError()) redirect("/home");
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");

  const target = ctx.team.members.find((m) => m.id === memberId);
  if (!target) return;
  const targetRole = target.role as TeamRole;
  if (target.userId === user.id) return;
  if (!canRemoveMember(ctx.role, targetRole)) return;
  if (targetRole === "owner") {
    const owners = await countOwners(ctx.team.id);
    if (owners < 2) return;
  }
  await prisma.teamMember.delete({ where: { id: target.id } });
  redirect(`/t/${slug}/people`);
}

export async function updateTeamSettingsAction(
  _prev: TeamFormState,
  formData: FormData,
): Promise<TeamFormState> {
  const originErr = await trustedMutationOriginError();
  if (originErr) return { error: originErr };

  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) return { error: "Studio not found" };
  if (!canEditSettings(ctx.role)) return { error: "Read only" };

  const settings: TeamSettings = {
    membersCanCreateProjects: formData.get("membersCanCreateProjects") === "on",
    membersCanInvite: formData.get("membersCanInvite") === "on",
    defaultInviteRole: isTeamRole(String(formData.get("defaultInviteRole") ?? ""))
      ? (String(formData.get("defaultInviteRole")) as TeamRole)
      : "member",
  };

  await prisma.team.update({
    where: { id: ctx.team.id },
    data: { settings: stringifyTeamSettings(settings) },
  });
  redirect(`/t/${slug}/settings`);
}

export async function revokeInviteAction(formData: FormData) {
  if (await trustedMutationOriginError()) redirect("/home");
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const inviteId = String(formData.get("inviteId") ?? "");
  const ctx = await getMembership(user.id, slug);
  if (!ctx) redirect("/home");
  const settings = parseTeamSettings(ctx.team.settings);
  if (!canInvite(ctx.role, settings)) return;
  await prisma.invite.deleteMany({
    where: { id: inviteId, teamId: ctx.team.id },
  });
  redirect(`/t/${slug}/people`);
}
