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
  clearSignInFailures,
  isSignInLocked,
  recordSignInFailure,
} from "@/lib/auth/sign-in-throttle";
import { trustedMutationOriginError } from "@/lib/security/mutation-guard";

export type AuthFormState = {
  error?: string;
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
  if (isSignInLocked(email)) {
    return { error: "Too many attempts. Wait a few minutes and try again." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    recordSignInFailure(email);
    return { error: "Email or password is wrong" };
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    recordSignInFailure(email);
    return { error: "Email or password is wrong" };
  }

  clearSignInFailures(email);
  await createSession(user.id, { replaceExistingForUser: true });
  redirect("/home");
}

export async function signOutAction() {
  if (await trustedMutationOriginError()) return;
  await destroySession();
  redirect("/signin");
}

export async function redirectIfSignedIn() {
  const user = await getCurrentUser();
  if (user) redirect("/home");
}
