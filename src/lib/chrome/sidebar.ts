export const SIDEBAR_COLLAPSED_KEY = "agily:sidebar-collapsed";

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export function readSidebarCollapsed(storage?: StorageLike | null): boolean {
  if (!storage) return false;
  return storage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
}

export function writeSidebarCollapsed(
  collapsed: boolean,
  storage?: StorageLike | null,
) {
  if (!storage) return;
  storage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
}
