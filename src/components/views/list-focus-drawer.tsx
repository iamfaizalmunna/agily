import Link from "next/link";
import type { ReactNode } from "react";

export function ListFocusDrawer({
  closeHref,
  children,
}: {
  closeHref: string;
  children: ReactNode;
}) {
  return (
    <>
      <Link
        href={closeHref}
        className="fixed inset-0 z-30 hidden bg-foreground/15 backdrop-blur-[2px] xl:block"
        aria-label="Close ticket detail"
      />
      <aside
        className="fixed bottom-0 right-0 top-24 z-40 hidden w-[min(26rem,92vw)] flex-col border-l border-border bg-card shadow-2xl md:top-28 xl:flex"
        aria-label="Ticket detail"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5">
          <p className="text-sm font-semibold text-foreground">Ticket detail</p>
          <Link
            href={closeHref}
            className="text-sm font-medium text-primary hover:underline"
          >
            Close
          </Link>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          {children}
        </div>
      </aside>
    </>
  );
}
