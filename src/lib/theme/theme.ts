export const COLOR_MODES = ["light", "dark", "system"] as const;

export type ColorMode = (typeof COLOR_MODES)[number];

export const THEME_STORAGE_KEY = "agily-theme";
export const DEFAULT_COLOR_MODE: ColorMode = "light";

export const THEME_COLOR_LIGHT = "#f4f5f7";
export const THEME_COLOR_DARK = "#12100e";

export function normalizeColorMode(
  raw: string | null | undefined,
): ColorMode {
  if (raw === "light" || raw === "dark" || raw === "system") {
    return raw;
  }
  return DEFAULT_COLOR_MODE;
}

export function isPublicAuthPath(pathname: string): boolean {
  if (pathname === "/signin" || pathname === "/signup") {
    return true;
  }
  return pathname.startsWith("/join/");
}

export function resolveDarkMode(
  mode: ColorMode,
  prefersDark: boolean,
): boolean {
  if (mode === "dark") {
    return true;
  }
  if (mode === "light") {
    return false;
  }
  return prefersDark;
}

export function themeClass(dark: boolean): "light" | "dark" {
  return dark ? "dark" : "light";
}

export function themeColor(dark: boolean): string {
  return dark ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
}

export function readStoredColorMode(
  storage: { getItem(key: string): string | null } | null | undefined,
): ColorMode {
  if (!storage) {
    return DEFAULT_COLOR_MODE;
  }
  return normalizeColorMode(storage.getItem(THEME_STORAGE_KEY));
}

export function resolveBootTheme(
  pathname: string,
  storedMode: ColorMode,
  prefersDark: boolean,
): { className: "light" | "dark"; colorScheme: "light" | "dark" } {
  if (isPublicAuthPath(pathname)) {
    return { className: "light", colorScheme: "light" };
  }

  const dark = resolveDarkMode(storedMode, prefersDark);
  const className = themeClass(dark);

  return {
    className,
    colorScheme: dark ? "dark" : "light",
  };
}

export function colorModeLabel(mode: ColorMode): string {
  if (mode === "light") {
    return "Light";
  }
  if (mode === "dark") {
    return "Dark";
  }
  return "System";
}

export function nextColorMode(mode: ColorMode): ColorMode {
  if (mode === "light") {
    return "dark";
  }
  if (mode === "dark") {
    return "system";
  }
  return "light";
}

export const THEME_BOOT_SCRIPT = `(function(){
  try {
    var path = location.pathname;
    var auth = path === '/signin' || path === '/signup' || path.indexOf('/join/') === 0;
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    var preset = 'jira';
    var iconSet = 'lucide';
    try {
      var ap = localStorage.getItem('agily-appearance');
      if (ap) {
        var parsed = JSON.parse(ap);
        if (parsed && parsed.themePreset) preset = parsed.themePreset;
        if (parsed && parsed.iconSet) iconSet = parsed.iconSet;
      }
    } catch (eAp) {}
    if (preset !== 'jira' && preset !== 'editorial' && preset !== 'graphite' && preset !== 'forest') {
      preset = 'jira';
    }
    if (iconSet !== 'lucide' && iconSet !== 'tabler' && iconSet !== 'phosphor' && iconSet !== 'heroicons') {
      iconSet = 'lucide';
    }
    root.setAttribute('data-theme', preset);
    root.setAttribute('data-icon-set', iconSet);
    if (auth) {
      root.classList.add('light');
      root.style.colorScheme = 'light';
      return;
    }
    var stored = localStorage.getItem('agily-theme');
    var mode = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'light';
    var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.add(dark ? 'dark' : 'light');
    root.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
  }
})();`;
