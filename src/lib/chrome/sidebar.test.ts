import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  readSidebarCollapsed,
  SIDEBAR_COLLAPSED_KEY,
  writeSidebarCollapsed,
} from "./sidebar";

describe("chrome/sidebar", () => {
  it("round-trips collapse preference", () => {
    const map = new Map<string, string>();
    const storage = {
      getItem: (key: string) => map.get(key) ?? null,
      setItem: (key: string, value: string) => {
        map.set(key, value);
      },
    };
    assert.equal(readSidebarCollapsed(null), false);
    writeSidebarCollapsed(true, null);
    assert.equal(readSidebarCollapsed(storage), false);
    writeSidebarCollapsed(true, storage);
    assert.equal(map.get(SIDEBAR_COLLAPSED_KEY), "1");
    assert.equal(readSidebarCollapsed(storage), true);
    writeSidebarCollapsed(false, storage);
    assert.equal(readSidebarCollapsed(storage), false);
  });
});
