import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { mobilePageStackClass } from "@/lib/ui/mobile";

export function MobilePage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(mobilePageStackClass(), className)}>{children}</div>;
}
