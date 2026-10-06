import type { ThemePreset } from "@/lib/appearance/appearance";
import { isThemePreset } from "@/lib/appearance/appearance";

export function applyThemePresetToDocument(preset: ThemePreset) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = preset;
}

export function readThemePresetFromDocument(): ThemePreset | null {
  if (typeof document === "undefined") return null;
  const raw = document.documentElement.dataset.theme;
  if (!raw || !isThemePreset(raw)) return null;
  return raw;
}
