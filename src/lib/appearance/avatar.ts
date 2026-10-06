/* c8 ignore next */
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export type AvatarImageKind = "jpeg" | "png" | "webp";

const JPEG = [0xff, 0xd8, 0xff];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function startsWith(bytes: Uint8Array, head: number[]) {
  return head.every((value, index) => bytes[index] === value);
}

function isWebp(bytes: Uint8Array) {
  if (bytes.length < 12) return false;
  if (!startsWith(bytes, [0x52, 0x49, 0x46, 0x46])) return false;
  return (
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

export function detectAvatarImageKind(bytes: Uint8Array): AvatarImageKind | null {
  if (startsWith(bytes, JPEG)) return "jpeg";
  if (startsWith(bytes, PNG)) return "png";
  if (isWebp(bytes)) return "webp";
  return null;
}

export function avatarFileExtension(kind: AvatarImageKind): string {
  if (kind === "jpeg") return "jpg";
  if (kind === "png") return "png";
  return "webp";
}

export function avatarStorageFilename(userId: string, kind: AvatarImageKind) {
  const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, "");
  return `${safeId || "user"}.${avatarFileExtension(kind)}`;
}

export function validateAvatarBytes(bytes: Uint8Array): { ok: true; kind: AvatarImageKind } | { ok: false; error: string } {
  if (!bytes.length) {
    return { ok: false, error: "Choose an image file" };
  }
  if (bytes.length > AVATAR_MAX_BYTES) {
    return { ok: false, error: "Image must be 2 MB or smaller" };
  }
  const kind = detectAvatarImageKind(bytes);
  if (!kind) {
    return { ok: false, error: "Use JPEG, PNG, or WebP" };
  }
  return { ok: true, kind };
}

export function avatarContentType(kind: AvatarImageKind): string {
  if (kind === "jpeg") return "image/jpeg";
  if (kind === "png") return "image/png";
  return "image/webp";
}
