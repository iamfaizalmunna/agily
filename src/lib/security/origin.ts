/* c8 ignore next */
export type MutationOriginInput = {
  origin?: string | null;
  host?: string | null;
  forwardedHost?: string | null;
  forwardedProto?: string | null;
};

export type MutationOriginResult =
  | { ok: true }
  | { ok: false; reason: string };

const DEV_HOSTS = new Set(["localhost", "127.0.0.1"]);

export function hostnameFromHostHeader(hostHeader: string): string {
  const trimmed = hostHeader.trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed.startsWith("[")) {
    const end = trimmed.indexOf("]");
    return end > 0 ? trimmed.slice(1, end) : trimmed;
  }
  const colon = trimmed.indexOf(":");
  return colon === -1 ? trimmed : trimmed.slice(0, colon);
}

export function configuredAppHostname(
  env: Record<string, string | undefined>,
): string | null {
  const raw = env.APP_URL?.trim() || env.VERCEL_URL?.trim();
  if (!raw) return null;
  try {
    const url = raw.includes("://") ? raw : `https://${raw}`;
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function trustedHostnames(
  env: Record<string, string | undefined>,
): Set<string> {
  const hosts = new Set(DEV_HOSTS);
  const configured = configuredAppHostname(env);
  if (configured) hosts.add(configured);
  return hosts;
}

function devHostsEquivalent(a: string, b: string): boolean {
  return DEV_HOSTS.has(a) && DEV_HOSTS.has(b);
}

export function requestHost(input: MutationOriginInput): string {
  return (input.forwardedHost ?? input.host ?? "").trim();
}

export function buildOriginFromHeaders(input: MutationOriginInput): string {
  const host = requestHost(input) || "127.0.0.1:43123";
  const proto = (input.forwardedProto ?? "http").trim() || "http";
  return `${proto}://${host}`;
}

/* c8 ignore next */
export function checkMutationOrigin(
  input: MutationOriginInput,
  env: Record<string, string | undefined>,
): MutationOriginResult {
  const hostHeader = requestHost(input);
  if (!hostHeader) return { ok: false, reason: "missing host" };

  const requestHostname = hostnameFromHostHeader(hostHeader);
  const trusted = trustedHostnames(env);

  const originHeader = input.origin?.trim();
  if (!originHeader) {
    if (trusted.has(requestHostname)) return { ok: true };
    return { ok: false, reason: "missing origin" };
  }

  let originHostname: string;
  try {
    originHostname = new URL(originHeader).hostname.toLowerCase();
  } catch {
    return { ok: false, reason: "bad origin" };
  }

  if (originHostname === requestHostname) return { ok: true };
  if (devHostsEquivalent(originHostname, requestHostname)) return { ok: true };
  const originTrusted = trusted.has(originHostname);
  const requestTrusted = trusted.has(requestHostname);
  if (originTrusted && requestTrusted) return { ok: true };

  return { ok: false, reason: "origin mismatch" };
}

