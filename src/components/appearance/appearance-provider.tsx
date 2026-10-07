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
import { useTheme } from "@/components/theme/theme-provider";
import {
  DEFAULT_USER_APPEARANCE,
  serializeUserAppearance,
  type IconSetId,
  type ThemePreset,
  type UserAppearance,
  APPEARANCE_STORAGE_KEY,
} from "@/lib/appearance/appearance";
import { applyUserAppearanceToDocument } from "@/lib/appearance/apply";

type AppearanceContextValue = {
  appearance: UserAppearance;
  iconSet: IconSetId;
  themePreset: ThemePreset;
  setAppearance: (next: UserAppearance) => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function cacheAppearance(appearance: UserAppearance) {
  try {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, serializeUserAppearance(appearance));
  } catch {
    /* private mode */
  }
}

export function AppearanceProvider({
  initial,
  children,
}: {
  initial: UserAppearance;
  children: ReactNode;
}) {
  const { setMode } = useTheme();
  const [appearance, setAppearanceState] = useState(initial);
  const setAppearance = useCallback((next: UserAppearance) => {
    setAppearanceState(next);
    cacheAppearance(next);
    applyUserAppearanceToDocument(next);
  }, []);

  useEffect(() => {
    setAppearanceState(initial);
    applyUserAppearanceToDocument(initial);
    cacheAppearance(initial);
    setMode(initial.colorMode);
  }, [initial, setMode]);

  useEffect(() => {
    applyUserAppearanceToDocument(appearance);
    cacheAppearance(appearance);
  }, [appearance]);

  const value = useMemo(
    () => ({
      appearance,
      iconSet: appearance.iconSet,
      themePreset: appearance.themePreset,
      setAppearance,
    }),
    [appearance, setAppearance],
  );

  return (
    <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) {
    return {
      appearance: DEFAULT_USER_APPEARANCE,
      iconSet: DEFAULT_USER_APPEARANCE.iconSet,
      themePreset: DEFAULT_USER_APPEARANCE.themePreset,
      setAppearance: () => {},
    };
  }
  return ctx;
}
