import { mkdir } from "node:fs/promises";
import path from "node:path";

/* c8 ignore next */
export function avatarDataDir() {
  return path.join(process.cwd(), "data", "avatars");
}

/* c8 ignore next */
export async function ensureAvatarDir() {
  await mkdir(avatarDataDir(), { recursive: true });
}

/* c8 ignore next */
export function avatarAbsolutePath(filename: string) {
  const base = avatarDataDir();
  const resolved = path.resolve(base, filename);
  if (!resolved.startsWith(path.resolve(base))) {
    throw new Error("Invalid avatar path");
  }
  return resolved;
}
