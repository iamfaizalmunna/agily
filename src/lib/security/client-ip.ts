import { headers } from "next/headers";

export function clientIpFromHeaders(h: Headers): string | null {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = h.get("x-real-ip")?.trim();
  if (real) return real;
  return null;
}

export async function readClientIp(): Promise<string | null> {
  return clientIpFromHeaders(await headers());
}
