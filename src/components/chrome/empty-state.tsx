import type { ReactNode } from "react";
import Link from "next/link";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div
      className="rounded-2xl border border-dashed border-paper/15 px-4 py-8 text-center"
      data-testid="empty-state"
    >
      <p className="font-display text-lg text-paper">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-paper/45">{body}</p>
      {action ? (
        <Link
          href={action.href}
          className="mt-4 inline-flex min-h-11 items-center rounded-full border border-paper/15 px-5 text-sm text-copper"
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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 px-4 py-10">
      <p className="font-display text-xs uppercase tracking-[0.22em] text-copper">
        Agily
      </p>
      <h1 className="font-display text-3xl text-paper">{title}</h1>
      <p className="text-sm leading-relaxed text-paper/50">{body}</p>
      {children}
    </main>
  );
}
