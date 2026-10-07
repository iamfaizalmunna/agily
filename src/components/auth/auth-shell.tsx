import type { ReactNode } from "react";
import { mobileAuthShellClass } from "@/lib/ui/mobile";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className={mobileAuthShellClass()}>
      <div
        className="grid w-full min-w-0 max-w-4xl overflow-hidden rounded-lg border border-[var(--border)] bg-surface shadow-[var(--shadow-card-hover)] md:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-copper">
            Agily
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-paper sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-paper/60">{subtitle}</p>
          <p className="mt-6 text-xs text-paper/45">
            After sign-in, open Profile & appearance to sync theme, icons, and
            accessibility prefs across every studio.
          </p>
          <div className="mt-8">{children}</div>
        </div>
        <aside
          className="hidden flex-col justify-between bg-copper p-10 text-on-copper md:flex"
          aria-hidden
        >
          <div>
            <p className="text-sm font-medium opacity-90">Local studio</p>
            <p className="mt-4 text-2xl font-semibold leading-snug">
              Plan work on one board. Pulse, Flow, and Orbit read the same
              tickets.
            </p>
          </div>
          <p className="text-xs opacity-75">
            Your SQLite file stays on this machine. No cloud APIs.
          </p>
        </aside>
      </div>
    </main>
  );
}
