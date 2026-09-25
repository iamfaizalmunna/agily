import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ui } from "@/lib/ui/classes";

export function Page({
  children,
  wide = false,
  className,
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <section className={cn(wide ? ui.pageWide : ui.page, className)}>
      {children}
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className={ui.eyebrow}>{eyebrow}</p> : null}
        <h1 className={cn(eyebrow && "mt-1", ui.title)}>{title}</h1>
        {description ? (
          <p className={cn("mt-2 max-w-2xl", ui.muted)}>{description}</p>
        ) : null}
      </div>
      {actions ? <div className={ui.toolbar}>{actions}</div> : null}
    </header>
  );
}

export function PageSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      {title ? <h2 className={ui.sectionTitle}>{title}</h2> : null}
      {children}
    </section>
  );
}
