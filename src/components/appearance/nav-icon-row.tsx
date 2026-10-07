import type { ReactNode } from "react";
import { AppIcon } from "@/components/appearance/app-icon";
import type { IconName } from "@/lib/appearance/icon-names";
import { cn } from "@/lib/cn";

export function NavIconRow({
  icon,
  children,
  className,
}: {
  icon: IconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <AppIcon
        name={icon}
        className="size-4 shrink-0 text-muted-foreground"
      />
      {children}
    </span>
  );
}
