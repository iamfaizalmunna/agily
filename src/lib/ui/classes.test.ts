import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ui } from "@/lib/ui/classes";

describe("ui classes", () => {
  it("exports stable layout tokens", () => {
    assert.match(ui.page, /max-w-6xl/);
    assert.match(ui.card, /rounded-lg/);
    assert.match(ui.input, /h-10/);
  });
});
