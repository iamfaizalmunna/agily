import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyThemePresetToDocument,
  readThemePresetFromDocument,
} from "@/lib/appearance/apply";

describe("apply theme preset", () => {
  it("no-ops when document is missing", () => {
    assert.equal(applyThemePresetToDocument("forest"), undefined);
    assert.equal(readThemePresetFromDocument(), null);
  });
});
