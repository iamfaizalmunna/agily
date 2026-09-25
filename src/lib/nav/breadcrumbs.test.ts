import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { studioCrumbs } from "@/lib/nav/breadcrumbs";

describe("breadcrumbs", () => {
  it("builds studio trail", () => {
    const crumbs = studioCrumbs("/t/northwind/p/atlas", {
      team: "Northwind",
      project: "Atlas",
      page: "Board",
    });
    assert.equal(crumbs.length, 4);
    assert.equal(crumbs.at(-1)?.label, "Board");
    assert.equal(crumbs[2]?.href, "/t/northwind/p/atlas");
  });
});
