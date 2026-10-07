import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_USER_APPEARANCE,
  ICON_SETS,
  THEME_PRESETS,
  iconSetLabel,
  isIconSetId,
  isThemePreset,
  parseUserAppearance,
  serializeUserAppearance,
  themePresetLabel,
  avatarPublicUrl,
} from "@/lib/appearance/appearance";

describe("user appearance", () => {
  it("defaults invalid JSON", () => {
    assert.deepEqual(parseUserAppearance(null), DEFAULT_USER_APPEARANCE);
    assert.deepEqual(parseUserAppearance(""), DEFAULT_USER_APPEARANCE);
    assert.deepEqual(parseUserAppearance("{"), DEFAULT_USER_APPEARANCE);
  });

  it("merges partial and rejects unknown ids", () => {
    assert.deepEqual(
      parseUserAppearance(JSON.stringify({ colorMode: "dark" })),
      {
        ...DEFAULT_USER_APPEARANCE,
        colorMode: "dark",
      },
    );
    assert.deepEqual(
      parseUserAppearance(
        JSON.stringify({
          themePreset: "nope",
          iconSet: "nope",
          colorMode: "system",
        }),
      ),
      {
        ...DEFAULT_USER_APPEARANCE,
        colorMode: "system",
      },
    );
  });

  it("round-trips serialization", () => {
    const value = {
      version: 2 as const,
      colorMode: "system" as const,
      themePreset: "forest" as const,
      iconSet: "tabler" as const,
      fontFamily: "outfit" as const,
      density: "compact" as const,
      cornerRadius: "soft" as const,
      highContrast: true,
    };
    assert.deepEqual(
      parseUserAppearance(serializeUserAppearance(value)),
      value,
    );
  });

  it("labels presets and icon sets", () => {
    assert.equal(themePresetLabel("jira"), "Jira blue");
    assert.equal(iconSetLabel("phosphor"), "Phosphor");
  });

  it("builds avatar API path", () => {
    assert.equal(avatarPublicUrl("u1"), "/api/profile/avatar/u1");
  });

  it("validates preset and icon set ids", () => {
    assert.equal(isThemePreset("jira"), true);
    assert.equal(isThemePreset("nope"), false);
    assert.equal(isIconSetId("lucide"), true);
    assert.equal(isIconSetId("nope"), false);
    assert.ok(THEME_PRESETS.length >= 4);
    assert.ok(ICON_SETS.length >= 4);
    assert.equal(themePresetLabel("editorial"), "Editorial");
    assert.equal(themePresetLabel("graphite"), "Graphite");
    assert.equal(themePresetLabel("forest"), "Forest");
    assert.equal(iconSetLabel("lucide"), "Lucide");
    assert.equal(iconSetLabel("phosphor"), "Phosphor");
    assert.equal(iconSetLabel("tabler"), "Tabler");
    assert.equal(iconSetLabel("heroicons"), "Heroicons");
    assert.deepEqual(
      parseUserAppearance(
        JSON.stringify({
          themePreset: "editorial",
          iconSet: "heroicons",
          colorMode: "dark",
        }),
      ),
      {
        version: 2,
        colorMode: "dark",
        themePreset: "editorial",
        iconSet: "heroicons",
        fontFamily: "geist",
        density: "comfortable",
        cornerRadius: "default",
        highContrast: false,
      },
    );
  });

  it("defaults new v2 fields when parsing legacy v1 JSON", () => {
    assert.deepEqual(
      parseUserAppearance(
        JSON.stringify({
          version: 1,
          colorMode: "dark",
          themePreset: "graphite",
          iconSet: "tabler",
        }),
      ),
      {
        version: 2,
        colorMode: "dark",
        themePreset: "graphite",
        iconSet: "tabler",
        fontFamily: "geist",
        density: "comfortable",
        cornerRadius: "default",
        highContrast: false,
      },
    );
  });
});
