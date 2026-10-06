import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ICON_SETS } from "@/lib/appearance/appearance";
import { ICON_NAMES } from "@/lib/appearance/icon-names";
import { ICON_REGISTRY } from "@/lib/appearance/icon-registry";

describe("icon registry", () => {
  it("maps every semantic name in each icon set", () => {
    for (const set of ICON_SETS) {
      const pack = ICON_REGISTRY[set];
      for (const name of ICON_NAMES) {
        assert.ok(pack[name], `${set} missing ${name}`);
      }
    }
  });
});
