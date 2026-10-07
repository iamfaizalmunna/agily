import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyCornerRadiusToDocument,
  applyDensityToDocument,
  applyFontFamilyToDocument,
  applyThemePresetToDocument,
  applyUserAppearanceToDocument,
  readAppearanceDatasetsFromDocument,
  readThemePresetFromDocument,
} from "@/lib/appearance/apply";
import { DEFAULT_USER_APPEARANCE } from "@/lib/appearance/appearance";

describe("apply appearance", () => {
  it("no-ops when document is missing", () => {
    assert.equal(applyThemePresetToDocument("forest"), undefined);
    assert.equal(readThemePresetFromDocument(), null);
    assert.deepEqual(readAppearanceDatasetsFromDocument(), {
      fontFamily: null,
      density: null,
      cornerRadius: null,
    });
    applyUserAppearanceToDocument(DEFAULT_USER_APPEARANCE);
    applyFontFamilyToDocument("outfit");
    applyDensityToDocument("compact");
    applyCornerRadiusToDocument("sharp");
  });
});
