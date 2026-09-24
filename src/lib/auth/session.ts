import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import {
  clearSessionCookie,
  readSessionToken,
  SESSION_DAYS,
  writeSessionCookie,
} from "@/lib/auth/cookies";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

function newToken() {
  return randomBytes(32).toString("hex");
}

export function sessionExpiry(from = new Date()) {
  const expiresAt = new Date(from);
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
  return expiresAt;
}

export async function createSession(userId: string) {
  const token = newToken();
  const expiresAt = sessionExpiry();
  await prisma.session.create({
    data: { userId, token, expiresAt },
  });
  await writeSessionCookie(token, expiresAt);
}

export async function destroySession() {
  const token = await readSessionToken();
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  await clearSessionCookie();
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await readSessionToken();
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    await clearSessionCookie();
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  return user;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
