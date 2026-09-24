import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.16em] text-paper/50",
        className,
      )}
      {...props}
    />
  );
}
