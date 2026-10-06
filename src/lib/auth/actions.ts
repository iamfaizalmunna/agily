"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  destroySession,
  getCurrentUser,
  normalizeEmail,
} from "@/lib/auth/session";
import { createTeamForUser } from "@/lib/teams/create";
import { parseJoinToken } from "@/lib/teams/tokens";
import { acceptInviteAction } from "@/lib/teams/join";
import { isTeamRole, type TeamRole } from "@/lib/rbac/roles";
import {
  authFailureDelay,
  clearSignInFailures,
  formatAuthLockMessage,
  recordSignInFailure,
  signInLockStatus,
} from "@/lib/auth/sign-in-throttle";
import { trustedMutationOriginError } from "@/lib/security/mutation-guard";
import { readClientIp } from "@/lib/security/client-ip";
import { writeSecurityEvent } from "@/lib/security/audit-log";

const INVALID_CREDENTIALS = "Email or password is wrong";

export type AuthFormState = {
  error?: string;
  retryAfterSeconds?: number;
};

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Use a real email as your login key"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  access: z.enum(["owner", "member", "viewer"]),
  teamName: z.string().trim().max(80).optional(),
  joinToken: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().trim().email("Use a real email as your login key"),
  password: z.string().min(1, "Password is required"),
});

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const originErr = await trustedMutationOriginError();
  if (originErr) return { error: originErr };

  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    access: formData.get("access"),
    teamName: formData.get("teamName") || undefined,
    joinToken: formData.get("joinToken") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  const access = parsed.data.access as TeamRole;
  if (!isTeamRole(access) || access === "admin") {
    return { error: "Pick owner, member, or viewer" };
  }
  if (access === "owner" && !parsed.data.teamName) {
    return { error: "Name the studio you are starting" };
  }

  const email = normalizeEmail(parsed.data.email);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "That email is already in use" };
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash: await hashPassword(parsed.data.password),
    },
  });

  await createSession(user.id);

  if (access === "owner" && parsed.data.teamName) {
    const team = await createTeamForUser(user.id, parsed.data.teamName);
    redirect(`/t/${team.slug}`);
  }

  const token = parseJoinToken(parsed.data.joinToken ?? "");
  if (token) {
    const join = await acceptInviteAction(
      {},
      (() => {
        const data = new FormData();
        data.set("token", token);
        data.set("password", parsed.data.password);
        data.set("name", parsed.data.name);
        return data;
      })(),
    );
    if (join.error) return join;
  }

  redirect("/home");
}

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const originErr = await trustedMutationOriginError();
  if (originErr) return { error: originErr };

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  const email = normalizeEmail(parsed.data.email);
  const clientIp = await readClientIp();
  const lock = signInLockStatus(email, clientIp);
  if (lock.locked) {
    return {
      error: formatAuthLockMessage(lock.retryAfterSeconds),
      retryAfterSeconds: lock.retryAfterSeconds,
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user
    ? await verifyPassword(parsed.data.password, user.passwordHash)
    : false;
  if (!user || !ok) {
    await authFailureDelay();
    recordSignInFailure(email, clientIp);
    const after = signInLockStatus(email, clientIp);
    if (after.locked) {
      return {
        error: formatAuthLockMessage(after.retryAfterSeconds),
        retryAfterSeconds: after.retryAfterSeconds,
      };
    }
    await writeSecurityEvent({
      kind: "sign_in_failure",
      meta: { email },
    });
    return { error: INVALID_CREDENTIALS };
  }

  clearSignInFailures(email, clientIp);
  await createSession(user.id, { replaceExistingForUser: true });
  await writeSecurityEvent({
    kind: "sign_in_success",
    actorUserId: user.id,
    meta: { email },
  });
  redirect("/home");
}

export async function signOutAction() {
  if (await trustedMutationOriginError()) return;
  const user = await getCurrentUser();
  await destroySession();
  if (user) {
    await writeSecurityEvent({
      kind: "sign_out",
      actorUserId: user.id,
    });
  }
  redirect("/signin");
}

export async function redirectIfSignedIn() {
  const user = await getCurrentUser();
  if (user) redirect("/home");
}
