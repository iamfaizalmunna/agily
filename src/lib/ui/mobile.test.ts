import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MOBILE_BOTTOM_NAV_PX,
  MOBILE_TOUCH_MIN_PX,
  mobileAuthShellClass,
  mobileBottomNavClass,
  mobilePageStackClass,
  mobilePrimaryTouchClass,
  mobileStudioMainClass,
  mobileTouchTargetClass,
  touchTargetMeetsMin,
} from "@/lib/ui/mobile";

describe("ui/mobile", () => {
  it("defines touch and nav constants", () => {
    assert.equal(MOBILE_TOUCH_MIN_PX, 44);
    assert.equal(MOBILE_BOTTOM_NAV_PX, 56);
    assert.equal(touchTargetMeetsMin(44), true);
    assert.equal(touchTargetMeetsMin(43), false);
  });

  it("builds studio main padding with safe-area and md overrides", () => {
    const main = mobileStudioMainClass();
    assert.match(main, /safe-area-inset-bottom/);
    assert.match(main, /md:pb-8/);
  });

  it("builds bottom nav with safe-area and hides on md", () => {
    const nav = mobileBottomNavClass();
    assert.match(nav, /safe-area-inset-bottom/);
    assert.match(nav, /md:hidden/);
  });

  it("builds auth shell with dvh and safe areas", () => {
    const shell = mobileAuthShellClass();
    assert.match(shell, /min-h-dvh/);
    assert.match(shell, /safe-area-inset-top/);
  });

  it("builds touch and page helper classes", () => {
    assert.match(mobileTouchTargetClass(), /min-h-11/);
    assert.match(mobilePrimaryTouchClass(), /min-h-12/);
    assert.match(mobilePageStackClass("gap-8"), /gap-8/);
  });
});
