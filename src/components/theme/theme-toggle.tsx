"use client";

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
        className="flex h-10 min-w-10 items-center justify-center rounded-full border border-paper/12 px-2 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-paper/70"
      >
        {mode === "light" ? "Lt" : mode === "dark" ? "Dk" : "Sys"}
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
            onClick={() => applyMode(option)}
            className={cn(
              "min-h-8 rounded-full px-2.5 text-[0.65rem] font-medium uppercase tracking-[0.14em] transition-colors",
              on
                ? "bg-copper text-on-copper"
                : "text-paper/55 hover:text-paper",
            )}
          >
            {colorModeLabel(option)}
          </button>
        );
      })}
    </div>
  );
}
