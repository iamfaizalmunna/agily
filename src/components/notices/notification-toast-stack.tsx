"use client";

import Link from "next/link";
import { AppIcon } from "@/components/appearance/app-icon";
import { cn } from "@/lib/cn";

export type ToastNotice = {
  id: string;
  title: string;
  body: string;
  href: string;
};

export function NotificationToastStack({
  items,
  onDismiss,
}: {
  items: ToastNotice[];
  onDismiss: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div
      className="pointer-events-none fixed bottom-20 right-4 z-[70] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 md:bottom-6"
      aria-live="polite"
      aria-label="New notices"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pointer-events-auto rounded-lg border border-border bg-card p-3 shadow-lg",
            "animate-in slide-in-from-bottom-2 fade-in duration-200",
          )}
        >
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {item.body}
              </p>
              <Link
                href={item.href}
                className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
              >
                Open ticket
              </Link>
            </div>
            <button
              type="button"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
              aria-label="Dismiss"
              onClick={() => onDismiss(item.id)}
            >
              <AppIcon name="action.close" className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
