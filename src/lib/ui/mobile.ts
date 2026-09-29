import { cn } from "@/lib/cn";

/** WCAG / Apple HIG style minimum touch target (px). */
export const MOBILE_TOUCH_MIN_PX = 44;

/** Matches `min-h-14` bottom nav row (px). */
export const MOBILE_BOTTOM_NAV_PX = 56;

/** Extra scroll padding below nav on small screens (px). */
export const MOBILE_MAIN_SCROLL_PADDING_PX = 16;

export function touchTargetMeetsMin(heightPx: number, minPx = MOBILE_TOUCH_MIN_PX) {
  return heightPx >= minPx;
}

/** Main content area inside studio shell (mobile bottom nav clearance). */
export function mobileStudioMainClass(extra?: string) {
  return cn(
    "flex-1 px-4 pt-4",
    "pb-[calc(3.5rem+env(safe-area-inset-bottom,0px)+1rem)]",
    "md:px-6 md:pb-8 md:pt-6",
    extra,
  );
}

/** Fixed bottom navigation chrome (studio shell). */
export function mobileBottomNavClass(extra?: string) {
  return cn(
    "fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-card",
    "pb-[env(safe-area-inset-bottom,0px)]",
    "md:hidden",
    extra,
  );
}

/** Minimum tap target for icon buttons and nav items. */
export function mobileTouchTargetClass(extra?: string) {
  return cn("inline-flex min-h-11 min-w-11 items-center justify-center", extra);
}

/** Primary actions (submit, main CTA) — slightly taller than minimum. */
export function mobilePrimaryTouchClass(extra?: string) {
  return cn("min-h-12 w-full sm:w-auto", extra);
}

/** Page stack spacing for mobile-first sections. */
export function mobilePageStackClass(extra?: string) {
  return cn("flex flex-col gap-6", extra);
}

/** Auth / marketing full-screen centers with safe areas. */
export function mobileAuthShellClass(extra?: string) {
  return cn(
    "flex min-h-dvh flex-1 items-center justify-center bg-ink",
    "px-4 pb-[env(safe-area-inset-bottom,0px)] pt-[env(safe-area-inset-top,0px)]",
    "py-10",
    extra,
  );
}
