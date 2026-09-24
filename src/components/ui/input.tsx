import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-paper/10 bg-paper/[0.04] px-4 text-base text-paper outline-none placeholder:text-paper/35 focus:border-copper/70 focus:bg-paper/[0.06]",
        className,
      )}
      {...props}
    />
  );
}
