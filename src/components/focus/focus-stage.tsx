"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function FocusStage({
  closeHref,
  children,
}: {
  closeHref: string;
  children: ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.push(closeHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeHref, router]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center md:items-start">
      <Link
        href={closeHref}
        className="absolute inset-0 bg-ink/75"
        aria-label="Close focus"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[88dvh] w-full flex-col overflow-y-auto rounded-t-3xl border border-paper/15 bg-ink px-4 py-5 md:mt-[8vh] md:max-w-xl md:rounded-3xl"
      >
        <Link
          href={closeHref}
          className="mb-4 self-end text-sm text-copper"
        >
          Close
        </Link>
        {children}
      </div>
    </div>
  );
}
