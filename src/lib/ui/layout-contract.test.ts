import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  boardKanbanOuterClass,
  dataSurfaceScrollClass,
  listViewCanvasClass,
  studioProjectCanvasClass,
  publicViewportPageClass,
  splitPaneMin,
  splitPaneMinPx,
  studioMainScrollClass,
  studioShellClass,
} from "@/lib/ui/layout-contract";

describe("layout-contract", () => {
  it("uses xl for split pane breakpoint", () => {
    assert.equal(splitPaneMin, "xl");
    assert.equal(splitPaneMinPx, 1280);
  });

  it("project and list canvases stay full width", () => {
    assert.match(studioProjectCanvasClass(), /max-w-none/);
    assert.match(listViewCanvasClass(), /w-full/);
  });

  it("studio scroll classes include overflow-y-auto", () => {
    assert.match(studioMainScrollClass(), /overflow-y-auto/);
    assert.match(studioShellClass(), /md:overflow-hidden/);
  });

  it("board and data surfaces allow horizontal scroll", () => {
    assert.match(boardKanbanOuterClass(), /min-w-0/);
    assert.match(dataSurfaceScrollClass(), /overflow-x-auto/);
  });

  it("public pages clamp width and overflow", () => {
    assert.match(publicViewportPageClass(), /overflow-x-hidden/);
    assert.match(publicViewportPageClass(), /safe-area-inset/);
  });
});
