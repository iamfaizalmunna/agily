"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

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
    <div className="fixed inset-0 z-40 flex justify-end">
      <Link
        href={closeHref}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        aria-label="Close focus"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-border bg-card shadow-xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
          <p className="text-sm font-medium">Ticket detail</p>
          <Link
            href={closeHref}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Close
          </Link>
        </header>
        <div className="flex-1 px-4 py-4">{children}</div>
      </div>
    </div>
  );
}
