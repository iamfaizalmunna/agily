"use client";

import type { ReactNode } from "react";

export function MobileBottomSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-sheet-title"
        className="relative z-10 w-full max-h-[85dvh] overflow-y-auto rounded-t-xl border border-border bg-card px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="mobile-sheet-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            className="min-h-11 min-w-11 text-sm text-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
