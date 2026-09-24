import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  projectSlugFromPath,
  studioMark,
  teamSlugFromPath,
} from "@/lib/nav/studio";

describe("studio nav", () => {
  it("reads team and project slugs from the path", () => {
    assert.equal(teamSlugFromPath("/home"), null);
    assert.equal(teamSlugFromPath("/t/north/people"), "north");
    assert.equal(projectSlugFromPath("/t/north/people"), null);
    assert.equal(projectSlugFromPath("/t/north/p/atlas"), "atlas");
  });

  it("builds a one-letter mark", () => {
    assert.equal(studioMark("Northwind"), "N");
    assert.equal(studioMark("  "), "A");
    assert.equal(studioMark(undefined), "A");
  });
});
