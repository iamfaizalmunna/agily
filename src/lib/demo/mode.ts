/** Public example hosts (example.zenflowai-style) always show demo logins. */
export const EXAMPLE_HOST_PREFIX = "example.";

export function isExampleHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  if (!host) {
    return false;
  }
  return host.startsWith(EXAMPLE_HOST_PREFIX) || host === "example.agily.local";
}

export function demoLoginsEnabled(options: {
  nodeEnv?: string;
  demoModeFlag?: string | null;
  hostname?: string;
}): boolean {
  if (options.nodeEnv === "development") {
    return true;
  }
  const flag = options.demoModeFlag?.trim().toLowerCase();
  if (flag === "true" || flag === "1" || flag === "yes") {
    return true;
  }
  if (options.hostname && isExampleHost(options.hostname)) {
    return true;
  }
  return false;
}

export function demoLoginsEnabledClient(
  hostname?: string,
): boolean {
  if (hostname === undefined) {
    if (typeof window === "undefined") {
      return process.env.NODE_ENV === "development";
    }
    hostname = window.location.hostname;
  }
  return demoLoginsEnabled({
    nodeEnv: process.env.NODE_ENV,
    demoModeFlag: process.env.NEXT_PUBLIC_DEMO_MODE,
    hostname,
  });
}
