import { cookies } from "next/headers";

export const SESSION_COOKIE = "agily_session";
export const SESSION_DAYS = 30;

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  };
}

export async function readSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function writeSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}
