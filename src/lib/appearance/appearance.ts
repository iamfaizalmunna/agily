import { type ColorMode, normalizeColorMode } from "@/lib/theme/theme";

export const APPEARANCE_VERSION = 2;

export const THEME_PRESETS = [
  "jira",
  "editorial",
  "graphite",
  "forest",
] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];

export const ICON_SETS = ["lucide", "tabler", "phosphor", "heroicons"] as const;
export type IconSetId = (typeof ICON_SETS)[number];

export const FONT_FAMILIES = ["geist", "outfit", "fraunces", "system"] as const;
export type FontFamilyId = (typeof FONT_FAMILIES)[number];

export const DENSITIES = ["comfortable", "compact"] as const;
export type DensityId = (typeof DENSITIES)[number];

export const CORNER_RADII = ["sharp", "default", "soft"] as const;
export type CornerRadiusId = (typeof CORNER_RADII)[number];

export type UserAppearance = {
  version: typeof APPEARANCE_VERSION;
  colorMode: ColorMode;
  themePreset: ThemePreset;
  iconSet: IconSetId;
  fontFamily: FontFamilyId;
  density: DensityId;
  cornerRadius: CornerRadiusId;
  highContrast: boolean;
};

export const DEFAULT_USER_APPEARANCE: UserAppearance = {
  version: APPEARANCE_VERSION,
  colorMode: "light",
  themePreset: "jira",
  iconSet: "lucide",
  fontFamily: "geist",
  density: "comfortable",
  cornerRadius: "default",
  highContrast: false,
};

export const APPEARANCE_STORAGE_KEY = "agily-appearance";

export function isThemePreset(value: string): value is ThemePreset {
  return (THEME_PRESETS as readonly string[]).includes(value);
}

export function isIconSetId(value: string): value is IconSetId {
  return (ICON_SETS as readonly string[]).includes(value);
}

export function isFontFamilyId(value: string): value is FontFamilyId {
  return (FONT_FAMILIES as readonly string[]).includes(value);
}

export function isDensityId(value: string): value is DensityId {
  return (DENSITIES as readonly string[]).includes(value);
}

export function isCornerRadiusId(value: string): value is CornerRadiusId {
  return (CORNER_RADII as readonly string[]).includes(value);
}

export function parseUserAppearance(raw: string | null | undefined): UserAppearance {
  if (!raw?.trim()) return DEFAULT_USER_APPEARANCE;
  try {
    const parsed = JSON.parse(raw) as Partial<UserAppearance>;
    return {
      version: APPEARANCE_VERSION,
      colorMode: normalizeColorMode(parsed.colorMode),
      themePreset: isThemePreset(String(parsed.themePreset ?? ""))
        ? parsed.themePreset!
        : DEFAULT_USER_APPEARANCE.themePreset,
      iconSet: isIconSetId(String(parsed.iconSet ?? ""))
        ? parsed.iconSet!
        : DEFAULT_USER_APPEARANCE.iconSet,
      fontFamily: isFontFamilyId(String(parsed.fontFamily ?? ""))
        ? parsed.fontFamily!
        : DEFAULT_USER_APPEARANCE.fontFamily,
      density: isDensityId(String(parsed.density ?? ""))
        ? parsed.density!
        : DEFAULT_USER_APPEARANCE.density,
      cornerRadius: isCornerRadiusId(String(parsed.cornerRadius ?? ""))
        ? parsed.cornerRadius!
        : DEFAULT_USER_APPEARANCE.cornerRadius,
      highContrast: parsed.highContrast === true,
    };
  } catch {
    return DEFAULT_USER_APPEARANCE;
  }
}

export function serializeUserAppearance(appearance: UserAppearance): string {
  return JSON.stringify({
    version: APPEARANCE_VERSION,
    colorMode: appearance.colorMode,
    themePreset: appearance.themePreset,
    iconSet: appearance.iconSet,
    fontFamily: appearance.fontFamily,
    density: appearance.density,
    cornerRadius: appearance.cornerRadius,
    highContrast: appearance.highContrast,
  });
}

export function themePresetLabel(preset: ThemePreset): string {
  if (preset === "jira") return "Jira blue";
  if (preset === "editorial") return "Editorial";
  if (preset === "graphite") return "Graphite";
  return "Forest";
}

export function iconSetLabel(set: IconSetId): string {
  if (set === "lucide") return "Lucide";
  if (set === "tabler") return "Tabler";
  if (set === "phosphor") return "Phosphor";
  return "Heroicons";
}

export function fontFamilyLabel(font: FontFamilyId): string {
  if (font === "geist") return "Geist";
  if (font === "outfit") return "Outfit";
  if (font === "fraunces") return "Fraunces";
  return "System UI";
}

export function densityLabel(density: DensityId): string {
  return density === "compact" ? "Compact" : "Comfortable";
}

export function cornerRadiusLabel(radius: CornerRadiusId): string {
  if (radius === "sharp") return "Sharp";
  if (radius === "soft") return "Soft";
  return "Default";
}

export function avatarPublicUrl(userId: string): string {
  return `/api/profile/avatar/${userId}`;
}
