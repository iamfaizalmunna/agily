import type { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
  icon?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center"
      data-testid="empty-state"
    >
      {icon ? (
        <div className="mb-3 text-muted-foreground" aria-hidden>{icon}</div>
      ) : null}
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
      {action ? (
        <Link
          href={action.href}
          className={cn(buttonVariants({ variant: "outline" }), "mt-5")}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorPanel({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <main
      className="mx-auto flex min-h-dvh w-full min-w-0 max-w-md flex-col justify-center gap-4 overflow-x-hidden px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] pt-[max(2.5rem,env(safe-area-inset-top,0px))]"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Agily
      </p>
      <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      {children}
    </main>
  );
}
