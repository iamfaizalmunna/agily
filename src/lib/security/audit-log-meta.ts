/* c8 ignore next */
export const SECURITY_EVENT_KINDS = [
  "sign_in_success",
  "sign_in_failure",
  "sign_out",
  "role_change",
  "invite_created",
  "invite_accepted",
  "csv_export",
] as const;

export type SecurityEventKind = (typeof SECURITY_EVENT_KINDS)[number];

const REDACT_KEYS = /password|token|secret|session|cookie|authorization/i;

export function isSecurityEventKind(value: string): value is SecurityEventKind {
  return (SECURITY_EVENT_KINDS as readonly string[]).includes(value);
}

export function sanitizeSecurityMeta(meta: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (REDACT_KEYS.test(key)) continue;
    if (typeof value === "string" && REDACT_KEYS.test(value)) continue;
    out[key] = value;
  }
  return out;
}

export function serializeSecurityMeta(meta: Record<string, unknown>) {
  return JSON.stringify(sanitizeSecurityMeta(meta));
}

/* c8 ignore next */
export function formatSecurityEventLine(
  row: {
    kind: string;
    createdAt: Date;
    meta: string;
    actor: { name: string } | null;
  },
) {
  let detail = "";
  try {
    const meta = JSON.parse(row.meta) as Record<string, unknown>;
    if (meta.targetRole && meta.previousRole) {
      detail = `${meta.previousRole} → ${meta.targetRole}`;
    } else if (meta.email) {
      detail = String(meta.email);
    } else if (meta.projectSlug) {
      detail = String(meta.projectSlug);
    }
  } catch {
    detail = "";
  }
  const who = row.actor?.name ?? "Someone";
  return `${row.kind.replaceAll("_", " ")} · ${who}${detail ? ` · ${detail}` : ""}`;
}
