/* c8 ignore next */
const BLOCKED_PROTOCOL = /^(javascript|data|vbscript):/i;

export function isSafeHttpUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed || BLOCKED_PROTOCOL.test(trimmed)) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/* c8 ignore next */
export function parseSafeHttpUrl(raw: string) {
  if (!isSafeHttpUrl(raw)) {
    return { error: "Link must be http or https" as const };
  }
  /* c8 ignore next */
  return { url: raw.trim() };
}
