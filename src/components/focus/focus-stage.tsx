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
  mobile = false,
}: {
  closeHref: string;
  children: ReactNode;
  mobile?: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.push(closeHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeHref, router]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <Link
        href={closeHref}
        className="absolute inset-0 bg-background/70 backdrop-blur-sm md:block"
        aria-label="Close focus"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ticket detail"
        className={cn(
          "relative z-10 flex h-full w-full flex-col overflow-y-auto bg-card shadow-xl",
          mobile
            ? "max-w-none border-0"
            : "max-w-2xl border-l border-border",
        )}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
          <p className="text-sm font-medium">Ticket detail</p>
          <Link
            href={closeHref}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Back
          </Link>
        </header>
        <div className="flex-1 px-4 py-4">{children}</div>
      </div>
    </div>
  );
}
