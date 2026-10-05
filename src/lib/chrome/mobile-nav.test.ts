import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mobileBoardsHref,
  mobileCreateHref,
  mobileNavBoardsActive,
  mobileNavHomeActive,
  mobileNavInboxActive,
} from "@/lib/chrome/mobile-nav";

describe("chrome/mobile-nav", () => {
  it("detects active mobile routes", () => {
    assert.equal(mobileNavHomeActive("/t/northwind", "northwind"), true);
    assert.equal(mobileNavHomeActive("/t/northwind/p/atlas", "northwind"), false);
    assert.equal(mobileNavBoardsActive("/t/northwind/p/atlas", "northwind"), true);
    assert.equal(mobileNavInboxActive("/t/northwind/notices"), true);
    assert.equal(mobileNavHomeActive("/home", undefined), true);
    assert.equal(mobileNavHomeActive("/t/northwind", undefined), false);
    assert.equal(mobileNavBoardsActive("/t/northwind/p/atlas", undefined), false);
  });

  it("builds board and create hrefs", () => {
    assert.equal(mobileBoardsHref("northwind"), "/t/northwind#studio-boards");
    assert.equal(
      mobileCreateHref("northwind", "atlas"),
      "/t/northwind/p/atlas?view=list#create-ticket",
    );
    assert.equal(mobileCreateHref("northwind", undefined), "/t/northwind#create-board");
  });
});
