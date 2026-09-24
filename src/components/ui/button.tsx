import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "quiet";
};

export function Button({
  className,
  variant = "primary",
  type = "submit",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-40",
        variant === "primary" &&
          "bg-copper text-ink hover:bg-copper-bright",
        variant === "ghost" &&
          "border border-paper/15 bg-transparent text-paper hover:border-paper/30 hover:bg-paper/5",
        variant === "quiet" &&
          "h-9 px-3 text-xs text-paper/60 hover:text-paper",
        className,
      )}
      {...props}
    />
  );
}
