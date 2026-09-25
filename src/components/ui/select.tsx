import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-12 w-full appearance-none rounded-2xl border border-paper/10 bg-[var(--input-fill)] px-4 pr-10 text-base text-paper outline-none focus:border-copper/70 focus:bg-surface disabled:opacity-40",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-paper/45"
        aria-hidden
      >
        ▾
      </span>
    </div>
  );
}
