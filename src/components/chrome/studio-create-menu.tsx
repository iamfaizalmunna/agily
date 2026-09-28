"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function StudioCreateMenu({
  slug,
  projectSlug,
  canCreateBoard,
}: {
  slug?: string;
  projectSlug?: string;
  canCreateBoard: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [open]);

  if (!slug) return null;

  const ticketHref = projectSlug
    ? `/t/${slug}/p/${projectSlug}?view=list#create-ticket`
    : undefined;
  const boardHref = `/t/${slug}#create-board`;

  const primaryHref = ticketHref ?? (canCreateBoard ? boardHref : null);

  return (
    <div ref={rootRef} className="relative">
      <div className="flex rounded-md shadow-sm">
        {primaryHref ? (
          <Link
            href={primaryHref}
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-r-none",
            )}
          >
            <Plus className="size-4" aria-hidden />
            Create
          </Link>
        ) : (
          <Button type="button" size="sm" className="rounded-r-none" disabled>
            <Plus className="size-4" aria-hidden />
            Create
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          variant="default"
          className="rounded-l-none border-l border-primary-foreground/20 px-2"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDown className="size-4" aria-hidden />
          <span className="sr-only">More create options</span>
        </Button>
      </div>
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 z-30 mt-1 min-w-[11rem] rounded-md border border-border bg-card py-1 text-sm shadow-md"
        >
          {ticketHref ? (
            <li role="none">
              <Link
                role="menuitem"
                href={ticketHref}
                className="block px-3 py-2 hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                New ticket
              </Link>
            </li>
          ) : null}
          {canCreateBoard ? (
            <li role="none">
              <Link
                role="menuitem"
                href={boardHref}
                className="block px-3 py-2 hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                New board
              </Link>
            </li>
          ) : null}
          {!ticketHref && !canCreateBoard ? (
            <li className="px-3 py-2 text-muted-foreground">Read only</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
