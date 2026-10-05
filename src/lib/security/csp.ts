/* c8 ignore next */
import { createHash } from "node:crypto";
import { THEME_BOOT_SCRIPT } from "../theme/theme";

export function themeBootScriptSha256(script: string): string {
  const digest = createHash("sha256").update(script).digest("base64");
  return `sha256-${digest}`;
}

export type BuildCspOptions = {
  nodeEnv?: string;
  /** When true, use enforcing CSP header; otherwise report-only (unless production). */
  enforce?: boolean;
  themeScript?: string;
};

/* c8 ignore next */
export function buildContentSecurityPolicy(options: BuildCspOptions = {}): {
  value: string;
  reportOnly: boolean;
} {
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV ?? "development";
  const themeScript = options.themeScript ?? THEME_BOOT_SCRIPT;
  const hash = themeBootScriptSha256(themeScript);
  const isProd = nodeEnv === "production";
  const forceEnforce =
    options.enforce === true || process.env.SECURITY_CSP_ENFORCE === "true";
  const reportOnly = !isProd && !forceEnforce;

  const scriptSrc = isProd
    ? `'self' '${hash}' 'unsafe-inline'`
    : `'self' '${hash}' 'unsafe-inline' 'unsafe-eval'`;

  const connectSrc = isProd
    ? "'self'"
    : "'self' http://127.0.0.1:* http://localhost:* ws: wss:";

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ];

  return {
    value: directives.join("; "),
    reportOnly,
  };
}
