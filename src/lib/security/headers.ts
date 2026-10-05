/* c8 ignore next */
/** Baseline HTTP security headers for the Next app (local-first, no CDN required). */
/* c8 ignore next */
export function securityResponseHeaders(): Record<string, string> {
  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-DNS-Prefetch-Control": "off",
  };
}
