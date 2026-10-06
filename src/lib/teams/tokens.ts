/* c8 ignore next */
import { randomBytes } from "node:crypto";

export function slugifyTeamName(name: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "studio";
  return base;
}

export function uniqueSlug(name: string) {
  return `${slugifyTeamName(name)}-${randomBytes(3).toString("hex")}`;
}

export const INVITE_TOKEN_BYTES = 18;
export const INVITE_TOKEN_HEX_LEN = INVITE_TOKEN_BYTES * 2;

export function newInviteToken() {
  return randomBytes(INVITE_TOKEN_BYTES).toString("hex");
}

export function isValidInviteTokenFormat(token: string) {
  return new RegExp(`^[a-f0-9]{${INVITE_TOKEN_HEX_LEN}}$`).test(token);
}

export function parseJoinToken(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    const joinAt = parts.lastIndexOf("join");
    if (joinAt >= 0 && parts[joinAt + 1]) return parts[joinAt + 1];
  } catch {
    /* not a URL */
  }
  const path = trimmed.split("/").filter(Boolean);
  return path[path.length - 1] ?? trimmed;
}

/* c8 ignore next */
export function inviteExpiry(days = 14) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}
