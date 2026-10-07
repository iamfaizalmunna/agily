"use client";

import { AppIcon } from "@/components/appearance/app-icon";
import type { IconName } from "@/lib/appearance/icon-names";
import {
  COLOR_MODES,
  colorModeLabel,
  nextColorMode,
  type ColorMode,
} from "@/lib/theme/theme";
import { cn } from "@/lib/cn";
import { useTheme } from "@/components/theme/theme-provider";
import { useAppearance } from "@/components/appearance/appearance-provider";
import { persistColorModeAction } from "@/lib/profile/actions";

const MODE_ICON: Record<ColorMode, IconName> = {
  light: "action.sun",
  dark: "action.moon",
  system: "action.monitor",
};

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useTheme();
  const { appearance, setAppearance } = useAppearance();

  const applyMode = (next: ColorMode) => {
    setMode(next);
    setAppearance({ ...appearance, colorMode: next });
    void persistColorModeAction(next);
  };

  if (compact) {
    return (
      <button
        type="button"
        aria-label={`Theme: ${colorModeLabel(mode)}. Tap to change.`}
        onClick={() => applyMode(nextColorMode(mode))}
        className="flex h-10 min-w-10 items-center justify-center rounded-full border border-paper/12 text-paper/70"
      >
        <AppIcon name={MODE_ICON[mode]} className="size-4" />
      </button>
    );
  }

  return (
    <div
      className="inline-flex rounded-full border border-paper/12 bg-paper/[0.03] p-0.5"
      role="group"
      aria-label="Color theme"
    >
      {COLOR_MODES.map((option) => {
        const on = mode === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={on}
            aria-label={colorModeLabel(option)}
            onClick={() => applyMode(option)}
            className={cn(
              "flex min-h-8 min-w-8 items-center justify-center rounded-full px-2 transition-colors",
              on
                ? "bg-copper text-on-copper"
                : "text-paper/55 hover:text-paper",
            )}
          >
            <AppIcon name={MODE_ICON[option]} className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
