"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type SettingsNavItem = {
  id: string;
  label: string;
  href: string;
  description?: string;
};

export function SettingsLayout({
  title,
  description,
  items,
  defaultSection,
  children,
}: {
  title: string;
  description?: string;
  items: SettingsNavItem[];
  defaultSection: string;
  children: React.ReactNode;
}) {
  const [currentId, setCurrentId] = useState(defaultSection);

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace("#", "");
      setCurrentId(hash || defaultSection);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [defaultSection]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:flex-row lg:gap-10">
      <aside className="shrink-0 lg:w-52">
        <div className="lg:sticky lg:top-6">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
          <nav className="mt-6 flex flex-col gap-0.5" aria-label="Settings">
            {items.map((item) => {
              const on = item.id === currentId;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    on
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-8">{children}</div>
    </div>
  );
}
