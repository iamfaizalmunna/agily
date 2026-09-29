import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function MobileStickyFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm",
        "pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]",
        "md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
