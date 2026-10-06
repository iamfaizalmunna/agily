"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { resolveSettingsSection } from "@/lib/settings/section-nav";
import { Select } from "@/components/ui/select";

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
  const validIds = useMemo(() => items.map((item) => item.id), [items]);
  const [currentId, setCurrentId] = useState(defaultSection);

  useEffect(() => {
    const sync = () => {
      setCurrentId(
        resolveSettingsSection(window.location.hash, defaultSection, validIds),
      );
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [defaultSection, validIds]);

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-6 lg:flex-row lg:gap-10">
      <aside className="shrink-0 lg:w-52">
        <div className="lg:sticky lg:top-0 lg:z-10 lg:bg-background/95 lg:pb-4 lg:backdrop-blur-sm">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
          <div className="mt-4 lg:hidden">
            <label className="sr-only" htmlFor="settings-section-jump">
              Settings section
            </label>
            <Select
              id="settings-section-jump"
              className="min-h-12 w-full"
              value={currentId}
              onChange={(event) => {
                const next = event.target.value;
                window.location.hash = next;
                setCurrentId(next);
              }}
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>
          <nav
            className="mt-6 hidden flex-col gap-0.5 lg:flex"
            aria-label="Settings"
          >
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
