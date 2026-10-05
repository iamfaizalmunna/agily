import { headers } from "next/headers";
import {
  checkMutationOrigin,
  type MutationOriginInput,
} from "@/lib/security/origin";

export const MUTATION_ORIGIN_ERROR =
  "Request blocked. Refresh this page and try again.";

export async function readMutationOriginInput(): Promise<MutationOriginInput> {
  const h = await headers();
  return {
    origin: h.get("origin"),
    host: h.get("host"),
    forwardedHost: h.get("x-forwarded-host"),
    forwardedProto: h.get("x-forwarded-proto"),
  };
}

/** Returns a user-safe error when Origin/Host look cross-site; null when trusted. */
export async function trustedMutationOriginError(): Promise<string | null> {
  const result = checkMutationOrigin(
    await readMutationOriginInput(),
    process.env,
  );
  return result.ok ? null : MUTATION_ORIGIN_ERROR;
}

export async function ensureTrustedMutationOrigin(): Promise<void> {
  const err = await trustedMutationOriginError();
  if (err) {
    throw new Error(err);
  }
}
