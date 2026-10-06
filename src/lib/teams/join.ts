"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  getCurrentUser,
  normalizeEmail,
} from "@/lib/auth/session";
import { isTeamRole } from "@/lib/rbac/roles";
import { trustedMutationOriginError } from "@/lib/security/mutation-guard";
import { readClientIp } from "@/lib/security/client-ip";
import {
  authFailureDelay,
  joinInviteLockMessage,
  joinInviteLockStatus,
  recordJoinInviteFailure,
} from "@/lib/auth/join-throttle";
import { isValidInviteTokenFormat } from "@/lib/teams/tokens";
import { writeSecurityEvent } from "@/lib/security/audit-log";

export type JoinFormState = { error?: string; retryAfterSeconds?: number };

const JOIN_FAILURE = "This join link or password is wrong";

const joinSchema = z.object({
  token: z.string().min(1),
  name: z.string().trim().max(80).optional(),
  password: z.string().min(1, "Password is required"),
});

export async function acceptInviteAction(
  _prev: JoinFormState,
  formData: FormData,
): Promise<JoinFormState> {
  const originErr = await trustedMutationOriginError();
  if (originErr) return { error: originErr };

  const parsed = joinSchema.safeParse({
    token: formData.get("token"),
    name: formData.get("name") || undefined,
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const clientIp = await readClientIp();
  const token = parsed.data.token;
  const joinLock = joinInviteLockStatus(clientIp, token);
  if (joinLock.locked) {
    return {
      error: joinInviteLockMessage(joinLock.retryAfterSeconds),
      retryAfterSeconds: joinLock.retryAfterSeconds,
    };
  }

  if (!isValidInviteTokenFormat(token)) {
    return { error: JOIN_FAILURE };
  }

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { team: true },
  });
  if (!invite || invite.expiresAt < new Date()) {
    await authFailureDelay();
    recordJoinInviteFailure(clientIp, token);
    const after = joinInviteLockStatus(clientIp, token);
    if (after.locked) {
      return {
        error: joinInviteLockMessage(after.retryAfterSeconds),
        retryAfterSeconds: after.retryAfterSeconds,
      };
    }
    return { error: JOIN_FAILURE };
  }
  if (!isTeamRole(invite.role) || invite.role === "owner") {
    return { error: "This invite is broken" };
  }

  const email = normalizeEmail(invite.email);
  let user = await prisma.user.findUnique({ where: { email } });
  const sessionUser = await getCurrentUser();

  if (sessionUser && sessionUser.email !== email) {
    return {
      error: `This link is for ${email}. Sign out, then join with that email.`,
    };
  }

  if (!user) {
    const name = parsed.data.name?.trim();
    if (!name) return { error: "Name is required for a new account" };
    if (parsed.data.password.length < 8) {
      return { error: "Password must be at least 8 characters" };
    }
    user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await hashPassword(parsed.data.password),
      },
    });
  } else {
    const ok = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!ok) {
      await authFailureDelay();
      recordJoinInviteFailure(clientIp, token);
      return { error: JOIN_FAILURE };
    }
  }

  if (!sessionUser || sessionUser.id !== user.id) {
    await createSession(user.id, { replaceExistingForUser: true });
  }

  const existing = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: invite.teamId, userId: user.id } },
  });
  if (!existing) {
    await prisma.teamMember.create({
      data: { teamId: invite.teamId, userId: user.id, role: invite.role },
    });
  }

  await prisma.invite.delete({ where: { id: invite.id } });
  await writeSecurityEvent({
    kind: "invite_accepted",
    actorUserId: user.id,
    teamId: invite.teamId,
    meta: { email, role: invite.role },
  });
  redirect(`/t/${invite.team.slug}`);
}
