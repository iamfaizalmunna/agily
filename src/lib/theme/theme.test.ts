import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COLOR_MODES,
  DEFAULT_COLOR_MODE,
  THEME_BOOT_SCRIPT,
  THEME_COLOR_DARK,
  THEME_COLOR_LIGHT,
  THEME_STORAGE_KEY,
  colorModeLabel,
  nextColorMode,
  isPublicAuthPath,
  normalizeColorMode,
  readStoredColorMode,
  resolveBootTheme,
  resolveDarkMode,
  themeClass,
  themeColor,
} from "@/lib/theme/theme";

describe("theme", () => {
  it("defaults to light and normalizes stored values", () => {
    assert.equal(DEFAULT_COLOR_MODE, "light");
    assert.deepEqual(COLOR_MODES, ["light", "dark", "system"]);
    assert.equal(THEME_STORAGE_KEY, "agily-theme");
    assert.equal(normalizeColorMode("light"), "light");
    assert.equal(normalizeColorMode("dark"), "dark");
    assert.equal(normalizeColorMode("system"), "system");
    assert.equal(normalizeColorMode("nope"), "light");
    assert.equal(normalizeColorMode(null), "light");
  });

  it("marks auth and join routes as public", () => {
    assert.equal(isPublicAuthPath("/signin"), true);
    assert.equal(isPublicAuthPath("/signup"), true);
    assert.equal(isPublicAuthPath("/join/abc"), true);
    assert.equal(isPublicAuthPath("/home"), false);
    assert.equal(isPublicAuthPath("/t/northwind"), false);
  });

  it("resolves dark mode from preference and system", () => {
    assert.equal(resolveDarkMode("dark", false), true);
    assert.equal(resolveDarkMode("light", true), false);
    assert.equal(resolveDarkMode("system", true), true);
    assert.equal(resolveDarkMode("system", false), false);
    assert.equal(themeClass(true), "dark");
    assert.equal(themeClass(false), "light");
    assert.equal(themeColor(true), THEME_COLOR_DARK);
    assert.equal(themeColor(false), THEME_COLOR_LIGHT);
  });

  it("reads storage safely and boots auth pages in light", () => {
    assert.equal(readStoredColorMode(null), "light");
    assert.equal(
      readStoredColorMode({ getItem: () => "dark" }),
      "dark",
    );
    assert.deepEqual(resolveBootTheme("/signin", "dark", true), {
      className: "light",
      colorScheme: "light",
    });
    assert.deepEqual(resolveBootTheme("/home", "system", true), {
      className: "dark",
      colorScheme: "dark",
    });
    assert.deepEqual(resolveBootTheme("/home", "light", true), {
      className: "light",
      colorScheme: "light",
    });
  });

  it("labels modes, cycles, and ships a boot script", () => {
    assert.equal(colorModeLabel("light"), "Light");
    assert.equal(colorModeLabel("dark"), "Dark");
    assert.equal(colorModeLabel("system"), "System");
    assert.equal(nextColorMode("light"), "dark");
    assert.equal(nextColorMode("dark"), "system");
    assert.equal(nextColorMode("system"), "light");
    assert.match(THEME_BOOT_SCRIPT, /agily-theme/);
    assert.match(THEME_BOOT_SCRIPT, /classList.add\('light'\)/);
    assert.match(THEME_BOOT_SCRIPT, /prefers-color-scheme: dark/);
    assert.match(THEME_BOOT_SCRIPT, /catch/);
  });
});
