"use client";

import { AppIcon } from "@/components/appearance/app-icon";
import { useAppearance } from "@/components/appearance/appearance-provider";
import { Button } from "@/components/ui/button";
import {
  cornerRadiusLabel,
  densityLabel,
  fontFamilyLabel,
  iconSetLabel,
  themePresetLabel,
} from "@/lib/appearance/appearance";

export function AppearancePreview() {
  const { appearance } = useAppearance();

  return (
    <div
      className="rounded-lg border border-border bg-muted/30 p-4"
      data-testid="appearance-preview"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Live preview
      </p>
      <p className="mt-3 text-base font-medium text-foreground">
        Studio navigation and cards use your choices immediately.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <AppIcon name="nav.board" className="size-5 text-primary" />
        <AppIcon name="nav.inbox" className="size-5 text-primary" />
        <AppIcon name="nav.settings" className="size-5 text-primary" />
        <Button type="button" size="sm" variant="secondary">
          Sample control
        </Button>
      </div>
      <ul className="mt-4 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
        <li>Preset: {themePresetLabel(appearance.themePreset)}</li>
        <li>Icons: {iconSetLabel(appearance.iconSet)}</li>
        <li>Typeface: {fontFamilyLabel(appearance.fontFamily)}</li>
        <li>Density: {densityLabel(appearance.density)}</li>
        <li>Corners: {cornerRadiusLabel(appearance.cornerRadius)}</li>
      </ul>
    </div>
  );
}
