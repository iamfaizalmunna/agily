/**
 * Shared layout breakpoints and class fragments for studio surfaces.
 * Tailwind prefixes only — keep in sync with docs/phases/UI_LAYOUT_README.md
 */

/** Side-by-side list + detail (wide desktop only). */
export const splitPaneMin = "xl";

/** Match `splitPaneMin` in pixels (Tailwind `xl`). */
export const splitPaneMinPx = 1280;

/** Primary scroll region inside studio shell (desktop). */
export function studioMainScrollClass(extra?: string) {
  return ["min-h-0 overflow-y-auto overscroll-y-contain", extra]
    .filter(Boolean)
    .join(" ");
}

/** Outer studio shell (desktop height lock + overflow). */
export function studioShellClass(extra?: string) {
  return [
    "flex min-h-dvh flex-1 flex-col md:h-dvh md:max-h-dvh md:flex-row md:overflow-hidden",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Main column beside sidebar (top bar + scrolling main). */
export function studioContentColumnClass(extra?: string) {
  return [
    "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Full-width project board canvas (list, flow, filters). */
export function studioProjectCanvasClass(extra?: string) {
  return [
    "flex w-full min-w-0 max-w-none flex-col agily-stack-gap",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/** List + sort + table column (always full width of main). */
export function listViewCanvasClass(extra?: string) {
  return ["flex w-full min-w-0 flex-col agily-stack-gap", extra]
    .filter(Boolean)
    .join(" ");
}

/** Ticket detail stacked under list (tablet / small desktop). */
export function listDetailStackedPanelClass() {
  return "hidden min-h-0 w-full rounded-lg border border-border bg-card md:block xl:hidden";
}

/** Scrollport for list bulk table. */
export function listTableScrollClass() {
  return "w-full min-w-0 max-h-[min(32rem,calc(100dvh-14rem))] min-h-[12rem] overflow-auto overscroll-y-contain rounded-lg border border-border bg-card shadow-sm";
}

/** Default expanded filters on wide viewports (client-only). */
export function shouldExpandFiltersDesktop(activeCount: number) {
  if (activeCount > 0) return true;
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(min-width: ${splitPaneMinPx}px)`).matches;
}

/** Kanban board outer wrapper (vertical stack in scrolling main). */
export function boardKanbanOuterClass(extra?: string) {
  return ["w-full min-w-0", extra].filter(Boolean).join(" ");
}

/** Sticky board controls while scrolling the flow view. */
export function boardSettingsBarStickyClass(extra?: string) {
  return [
    "sticky top-0 z-20 -mx-4 mb-2 border-b border-border/80 bg-background/95 px-4 py-2 backdrop-blur-sm",
    "md:-mx-6 md:px-6",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Studio page sections (pulse, people, notices). */
export function studioPageSectionClass(extra?: string) {
  return [
    "flex min-w-0 w-full flex-col agily-stack-gap agily-stack-gap-loose",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Horizontally scrollable chart / gantt surfaces. */
export function dataSurfaceScrollClass(extra?: string) {
  return ["min-w-0 w-full overflow-x-auto overscroll-x-contain", extra]
    .filter(Boolean)
    .join(" ");
}

/** Full-height public routes with safe areas (join, errors). */
export function publicViewportPageClass(extra?: string) {
  return [
    "flex min-h-dvh min-w-0 max-w-full flex-col overflow-x-hidden",
    "px-4 pt-[max(2rem,env(safe-area-inset-top,0px))] pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Narrow centered column on public pages. */
export function publicContentWidthClass(extra?: string) {
  return ["mx-auto w-full min-w-0 max-w-sm", extra]
    .filter(Boolean)
    .join(" ");
}

/** KB / marketing-style centered page. */
export function publicDocumentPageClass(extra?: string) {
  return [
    "mx-auto flex w-full min-w-0 max-w-lg flex-col gap-6 overflow-x-hidden px-4 py-10",
    "pt-[max(2.5rem,env(safe-area-inset-top,0px))]",
    "pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}
