import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors";

export function Chip({
  active = false,
  className,
  ...props
}: ComponentProps<typeof Link> & { active?: boolean }) {
  return (
    <Link
      className={cn(
        base,
        active
          ? "bg-copper text-on-copper"
          : "border border-[var(--border)] bg-surface text-paper/70 hover:bg-paper/[0.04] hover:text-paper",
        className,
      )}
      {...props}
    />
  );
}

export function ChipButton({
  active = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        base,
        active
          ? "bg-copper text-on-copper"
          : "border border-[var(--border)] bg-surface text-paper/70 hover:bg-paper/[0.04] hover:text-paper",
        className,
      )}
      {...props}
    />
  );
}
