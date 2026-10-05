/* c8 ignore next */
import { randomBytes } from "node:crypto";

export const SESSION_TOKEN_BYTES = 32;

export function mintSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString("hex");
}

/* c8 ignore next */
export function isValidSessionTokenFormat(token: string): boolean {
  return /^[a-f0-9]{64}$/.test(token);
}
