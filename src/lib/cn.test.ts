import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("merges tailwind classes", () => {
    assert.equal(cn(), "");
    assert.equal(cn("px-2", "px-4"), "px-4");
    assert.equal(cn("text-paper", false && "hidden", undefined), "text-paper");
  });
});
