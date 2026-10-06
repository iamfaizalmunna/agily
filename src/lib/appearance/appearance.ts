import { type ColorMode, normalizeColorMode } from "@/lib/theme/theme";

export const APPEARANCE_VERSION = 1;

export const THEME_PRESETS = [
  "jira",
  "editorial",
  "graphite",
  "forest",
] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];

export const ICON_SETS = ["lucide", "tabler", "phosphor", "heroicons"] as const;
export type IconSetId = (typeof ICON_SETS)[number];

export type UserAppearance = {
  version: typeof APPEARANCE_VERSION;
  colorMode: ColorMode;
  themePreset: ThemePreset;
  iconSet: IconSetId;
};

export const DEFAULT_USER_APPEARANCE: UserAppearance = {
  version: APPEARANCE_VERSION,
  colorMode: "light",
  themePreset: "jira",
  iconSet: "lucide",
};

export const APPEARANCE_STORAGE_KEY = "agily-appearance";

export function isThemePreset(value: string): value is ThemePreset {
  return (THEME_PRESETS as readonly string[]).includes(value);
}

export function isIconSetId(value: string): value is IconSetId {
  return (ICON_SETS as readonly string[]).includes(value);
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

export function avatarPublicUrl(userId: string): string {
  return `/api/profile/avatar/${userId}`;
}
