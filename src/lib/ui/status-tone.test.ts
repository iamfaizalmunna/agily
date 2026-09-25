import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STATUS_TONE, statusTone } from "@/lib/ui/status-tone";

describe("status tone", () => {
  it("maps every item status to column accents", () => {
    assert.equal(Object.keys(STATUS_TONE).length, 5);
    assert.match(statusTone("doing").column, /status-doing/);
    assert.match(statusTone("done").tag, /status-done/);
    assert.match(statusTone("unknown").dot, /status-backlog/);
  });
});
