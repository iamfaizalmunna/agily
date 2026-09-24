import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatDueOn, parseDueOn, parseItemTitle } from "@/lib/items/validate";

describe("phase 3 item fields", () => {
  it("requires a short title", () => {
    assert.deepEqual(parseItemTitle("  "), { error: "Title is required" });
    assert.equal(parseItemTitle("  Ship lens  ").title, "Ship lens");
    assert.equal(parseItemTitle("x".repeat(161)).error, "Title is too long");
  });

  it("parses optional due dates at noon UTC", () => {
    assert.deepEqual(parseDueOn(""), { dueOn: null });
    assert.deepEqual(parseDueOn(undefined), { dueOn: null });
    assert.equal(parseDueOn("soon")?.error, "Due date must be YYYY-MM-DD");
    const ok = parseDueOn("2026-09-24");
    assert.equal(ok.dueOn?.toISOString(), "2026-09-24T12:00:00.000Z");
    assert.equal(parseDueOn("2026-13-40")?.error, "Due date is not a real day");
    assert.equal(formatDueOn(ok.dueOn), "2026-09-24");
    assert.equal(formatDueOn(null), "");
    assert.equal(formatDueOn(undefined), "");
  });
});
