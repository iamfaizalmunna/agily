"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_COLOR_MODE,
  type ColorMode,
  THEME_STORAGE_KEY,
  isPublicAuthPath,
  readStoredColorMode,
  resolveDarkMode,
  themeClass,
  themeColor,
} from "@/lib/theme/theme";

type ThemeContextValue = {
  mode: ColorMode;
  resolvedDark: boolean;
  setMode: (mode: ColorMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyResolvedTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(themeClass(dark));
  root.style.colorScheme = dark ? "dark" : "light";

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", themeColor(dark));
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mode, setModeState] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const [prefersDark, setPrefersDark] = useState(false);

  const onPublicAuth = isPublicAuthPath(pathname);
  const resolvedDark = onPublicAuth
    ? false
    : resolveDarkMode(mode, prefersDark);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyResolvedTheme(resolveDarkMode(next, prefers));
  }, []);

  useEffect(() => {
    setModeState(readStoredColorMode(localStorage));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncPreference = () => {
      setPrefersDark(media.matches);
    };

    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    applyResolvedTheme(resolvedDark);
  }, [resolvedDark]);

  const value = useMemo(
    () => ({ mode, resolvedDark, setMode }),
    [mode, resolvedDark, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}
