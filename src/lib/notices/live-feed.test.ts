import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseSinceParam } from "@/lib/notices/live-feed";

describe("live notice feed", () => {
  it("parses since timestamps", () => {
    assert.equal(parseSinceParam(null), undefined);
    assert.equal(parseSinceParam(""), undefined);
    assert.equal(parseSinceParam("not-a-date"), undefined);
    const iso = "2026-01-15T08:00:00.000Z";
    assert.deepEqual(parseSinceParam(iso), new Date(iso));
  });
});
