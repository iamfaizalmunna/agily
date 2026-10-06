"use client";

import { useTheme } from "@/components/theme/theme-provider";
import {
  COLOR_MODES,
  colorModeLabel,
} from "@/lib/theme/theme";
import {
  ICON_SETS,
  THEME_PRESETS,
  iconSetLabel,
  isIconSetId,
  isThemePreset,
  themePresetLabel,
  type UserAppearance,
} from "@/lib/appearance/appearance";
import { useAppearance } from "@/components/appearance/appearance-provider";
import { normalizeColorMode } from "@/lib/theme/theme";
import { updateAppearanceAction } from "@/lib/profile/actions";
import { Button } from "@/components/ui/button";

export function ProfileAppearanceForm({
  appearance,
}: {
  appearance: UserAppearance;
}) {
  const { setMode } = useTheme();
  const { setAppearance } = useAppearance();

  return (
    <form
      action={updateAppearanceAction}
      className="flex flex-col gap-4"
      data-testid="profile-appearance-form"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const data = new FormData(form);
        const colorMode = normalizeColorMode(String(data.get("colorMode") ?? ""));
        const themePreset = String(data.get("themePreset") ?? "");
        const iconSet = String(data.get("iconSet") ?? "");
        setMode(colorMode);
        const next: UserAppearance = {
          ...appearance,
          colorMode,
          themePreset: isThemePreset(themePreset) ? themePreset : appearance.themePreset,
          iconSet: isIconSetId(iconSet) ? iconSet : appearance.iconSet,
        };
        setAppearance(next);
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Color mode</span>
        <select
          name="colorMode"
          defaultValue={appearance.colorMode}
          className="rounded-md border border-border bg-card px-3 py-2"
        >
          {COLOR_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {colorModeLabel(mode)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Theme preset</span>
        <select
          name="themePreset"
          defaultValue={appearance.themePreset}
          className="rounded-md border border-border bg-card px-3 py-2"
        >
          {THEME_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {themePresetLabel(preset)}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          Changes sidebar and accent colors across the studio.
        </span>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Icon set</span>
        <select
          name="iconSet"
          defaultValue={appearance.iconSet}
          className="rounded-md border border-border bg-card px-3 py-2"
        >
          {ICON_SETS.map((set) => (
            <option key={set} value={set}>
              {iconSetLabel(set)}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          Updates navigation and action icons everywhere in the app.
        </span>
      </label>
      <Button type="submit" className="self-start">Save appearance</Button>
    </form>
  );
}
