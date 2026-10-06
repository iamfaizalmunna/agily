export const LENS_ASK_BODY_LIMIT = "32kb";
export const LENS_ASK_BODY_BYTES = 32 * 1024;
export const LENS_QUESTION_MAX_LEN = 500;
export const LENS_ASK_WINDOW_MS = 15 * 60 * 1000;
export const LENS_ASK_MAX_PER_WINDOW = 40;

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

function bucketFor(key: string, now: number) {
  let bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > LENS_ASK_WINDOW_MS) {
    bucket = { count: 0, windowStart: now };
    buckets.set(key, bucket);
  }
  return bucket;
}

export function lensAskKeys(userId: string, clientIp?: string | null) {
  const keys = [`lens:user:${userId}`];
  const ip = clientIp?.trim();
  if (ip) keys.push(`lens:ip:${ip}`);
  return keys;
}

export type LensAskThrottleStatus = {
  throttled: boolean;
  retryAfterSeconds: number;
};

export function lensAskThrottleStatus(
  userId: string,
  clientIp?: string | null,
  now = Date.now(),
): LensAskThrottleStatus {
  let retryAfterSeconds = 0;
  for (const key of lensAskKeys(userId, clientIp)) {
    const bucket = bucketFor(key, now);
    if (bucket.count >= LENS_ASK_MAX_PER_WINDOW) {
      const retryAfterMs = Math.max(
        0,
        bucket.windowStart + LENS_ASK_WINDOW_MS - now,
      );
      return {
        throttled: true,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
      };
    }
    retryAfterSeconds = Math.max(retryAfterSeconds, 0);
  }
  return { throttled: false, retryAfterSeconds: 0 };
}

export function recordLensAsk(userId: string, clientIp?: string | null, now = Date.now()) {
  for (const key of lensAskKeys(userId, clientIp)) {
    bucketFor(key, now).count += 1;
  }
}

/** Test-only reset. */
/* c8 ignore next */
export function resetLensAskThrottle() {
  buckets.clear();
}

export function clientIpFromRequest(headers: {
  get(name: string): string | null;
}) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  return null;
}

export function safeKbBasename(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.includes("..")) return null;
  /* c8 ignore next */
  const name = trimmed.replace(/\\/g, "/").split("/").pop() ?? "";
  if (!name.endsWith(".md") || name.includes("..")) return null;
  return name;
}

export function isLensKbHttpEnabled(
  env: Record<string, string | undefined> = process.env,
) {
  const nodeEnv = env.NODE_ENV ?? "development";
  if (nodeEnv === "production") {
    return env.LENS_KB_HTTP === "true";
  }
  return env.LENS_KB_HTTP !== "false";
}

export function lensCorsAllowlist(
  env: Record<string, string | undefined> = process.env,
) {
  const raw = env.LENS_CORS_ORIGINS?.trim();
  if (!raw) return [] as string[];
  return raw
    .split(",")
    .map((row) => row.trim())
    .filter(Boolean);
}

export function applyLensCors(
  originHeader: string | null | undefined,
  allowlist: string[],
) {
  if (!allowlist.length || !originHeader) return null;
  return allowlist.includes(originHeader) ? originHeader : null;
}

export function publicLensHealthPayload(
  env: Record<string, string | undefined>,
  input: { ollama: boolean; model: string; base?: string; error?: string },
) {
  if (input.error) {
    return { ok: false, ollama: false, error: "Lens backend unavailable" };
  }
  /* c8 ignore next */
  const prod = (env.NODE_ENV ?? "") === "production";
  /* c8 ignore start */
  if (prod) {
    return { ok: true, ollama: input.ollama, model: input.model };
  }
  /* c8 ignore stop */
  return {
    ok: true,
    ollama: input.ollama,
    model: input.model,
    base: input.base,
  };
}

export function lensAskTimeoutMs() {
  return 12_000;
}
