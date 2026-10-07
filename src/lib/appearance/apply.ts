import type {
  CornerRadiusId,
  DensityId,
  FontFamilyId,
  ThemePreset,
  UserAppearance,
} from "@/lib/appearance/appearance";
import {
  isCornerRadiusId,
  isDensityId,
  isFontFamilyId,
  isThemePreset,
} from "@/lib/appearance/appearance";
import type { IconSetId } from "@/lib/appearance/appearance";

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

export function applyIconSetToDocument(iconSet: IconSetId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.iconSet = iconSet;
}

export function applyFontFamilyToDocument(fontFamily: FontFamilyId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.font = fontFamily;
}

export function applyDensityToDocument(density: DensityId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.density = density;
}

export function applyCornerRadiusToDocument(cornerRadius: CornerRadiusId) {
  if (typeof document === "undefined") return;
  if (cornerRadius === "default") {
    delete document.documentElement.dataset.radius;
    return;
  }
  document.documentElement.dataset.radius = cornerRadius;
}

/** Applies all document-level appearance tokens (client only). */
export function applyUserAppearanceToDocument(appearance: UserAppearance) {
  if (typeof document === "undefined") return;
  applyThemePresetToDocument(appearance.themePreset);
  applyIconSetToDocument(appearance.iconSet);
  applyFontFamilyToDocument(appearance.fontFamily);
  applyDensityToDocument(appearance.density);
  applyCornerRadiusToDocument(appearance.cornerRadius);
}

export function readAppearanceDatasetsFromDocument(): {
  fontFamily: FontFamilyId | null;
  density: DensityId | null;
  cornerRadius: CornerRadiusId | null;
} {
  if (typeof document === "undefined") {
    return { fontFamily: null, density: null, cornerRadius: null };
  }
  const root = document.documentElement;
  const font = root.dataset.font;
  const density = root.dataset.density;
  const radius = root.dataset.radius;
  return {
    fontFamily: font && isFontFamilyId(font) ? font : null,
    density: density && isDensityId(density) ? density : null,
    cornerRadius:
      !radius || radius === "default"
        ? "default"
        : isCornerRadiusId(radius)
          ? radius
          : null,
  };
}
