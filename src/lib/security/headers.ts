/* c8 ignore next */
import { buildContentSecurityPolicy } from "./csp";

export type SecurityHeaderEnv = Record<string, string | undefined>;

/** Baseline HTTP security headers for the Next app (local-first, no CDN required). */
/* c8 ignore next */
export function securityResponseHeaders(
  env: SecurityHeaderEnv = process.env,
): Record<string, string> {
  const csp = buildContentSecurityPolicy({
    nodeEnv: env.NODE_ENV,
    enforce: env.SECURITY_CSP_ENFORCE === "true",
  });
  const cspHeader = csp.reportOnly
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";

  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-DNS-Prefetch-Control": "off",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
    [cspHeader]: csp.value,
  };
}
