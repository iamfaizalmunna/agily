"use client";

import { useCallback } from "react";
import { useTheme } from "@/components/theme/theme-provider";
import {
  COLOR_MODES,
  colorModeLabel,
  normalizeColorMode,
} from "@/lib/theme/theme";
import {
  CORNER_RADII,
  DENSITIES,
  FONT_FAMILIES,
  ICON_SETS,
  THEME_PRESETS,
  cornerRadiusLabel,
  densityLabel,
  fontFamilyLabel,
  iconSetLabel,
  isCornerRadiusId,
  isDensityId,
  isFontFamilyId,
  isIconSetId,
  isThemePreset,
  themePresetLabel,
  type UserAppearance,
} from "@/lib/appearance/appearance";
import { useAppearance } from "@/components/appearance/appearance-provider";
import { AppearancePreview } from "@/components/profile/appearance-preview";
import {
  resetAppearanceAction,
  updateAppearanceAction,
} from "@/lib/profile/actions";
import { Button } from "@/components/ui/button";

const selectClass =
  "rounded-md border border-border bg-card px-3 py-2";

export function ProfileAppearanceForm({
  appearance: initialAppearance,
}: {
  appearance: UserAppearance;
}) {
  const { setMode } = useTheme();
  const { appearance, setAppearance } = useAppearance();

  const syncFromForm = useCallback(
    (form: HTMLFormElement) => {
      const data = new FormData(form);
      const colorMode = normalizeColorMode(String(data.get("colorMode") ?? ""));
      const themePreset = String(data.get("themePreset") ?? "");
      const iconSet = String(data.get("iconSet") ?? "");
      const fontFamily = String(data.get("fontFamily") ?? "");
      const density = String(data.get("density") ?? "");
      const cornerRadius = String(data.get("cornerRadius") ?? "");
      setMode(colorMode);
      setAppearance({
        ...appearance,
        colorMode,
        themePreset: isThemePreset(themePreset)
          ? themePreset
          : appearance.themePreset,
        iconSet: isIconSetId(iconSet) ? iconSet : appearance.iconSet,
        fontFamily: isFontFamilyId(fontFamily)
          ? fontFamily
          : appearance.fontFamily,
        density: isDensityId(density) ? density : appearance.density,
        cornerRadius: isCornerRadiusId(cornerRadius)
          ? cornerRadius
          : appearance.cornerRadius,
      });
    },
    [appearance, setAppearance, setMode],
  );

  return (
    <div className="flex flex-col gap-4">
      <AppearancePreview />
      <form
        action={updateAppearanceAction}
        className="flex flex-col gap-4"
        data-testid="profile-appearance-form"
        onChange={(event) => {
          const form = event.currentTarget;
          syncFromForm(form);
        }}
        onSubmit={(event) => {
          syncFromForm(event.currentTarget);
        }}
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Color mode</span>
          <select
            name="colorMode"
            defaultValue={initialAppearance.colorMode}
            className={selectClass}
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
            defaultValue={initialAppearance.themePreset}
            className={selectClass}
          >
            {THEME_PRESETS.map((preset) => (
              <option key={preset} value={preset}>
                {themePresetLabel(preset)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Icon set</span>
          <select
            name="iconSet"
            defaultValue={initialAppearance.iconSet}
            className={selectClass}
          >
            {ICON_SETS.map((set) => (
              <option key={set} value={set}>
                {iconSetLabel(set)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Typeface</span>
          <select
            name="fontFamily"
            defaultValue={initialAppearance.fontFamily}
            className={selectClass}
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font} value={font}>
                {fontFamilyLabel(font)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Density</span>
          <select
            name="density"
            defaultValue={initialAppearance.density}
            className={selectClass}
          >
            {DENSITIES.map((d) => (
              <option key={d} value={d}>
                {densityLabel(d)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Corner radius</span>
          <select
            name="cornerRadius"
            defaultValue={initialAppearance.cornerRadius}
            className={selectClass}
          >
            {CORNER_RADII.map((r) => (
              <option key={r} value={r}>
                {cornerRadiusLabel(r)}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="self-start">Save appearance</Button>
        </div>
      </form>
      <form action={resetAppearanceAction}>
        <Button type="submit" variant="outline" size="sm">
          Restore defaults
        </Button>
      </form>
    </div>
  );
}
