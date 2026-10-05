import { cookies } from "next/headers";
import { sessionCookieOptions } from "@/lib/auth/cookie-options";
import { SESSION_COOKIE } from "@/lib/auth/identity";

export { SESSION_COOKIE, SESSION_DAYS } from "@/lib/auth/identity";
export { sessionCookieOptions };

export async function readSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function writeSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
}

export async function clearSessionCookie() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/" });
}
