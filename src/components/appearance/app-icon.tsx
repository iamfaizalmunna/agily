"use client";

import { useAppearance } from "@/components/appearance/appearance-provider";
import { ICON_REGISTRY } from "@/lib/appearance/icon-registry";
import type { IconName } from "@/lib/appearance/icon-names";
import { cn } from "@/lib/cn";

const SIZE_CLASS = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

export function AppIcon({
  name,
  className,
  size = "md",
}: {
  name: IconName;
  className?: string;
  size?: keyof typeof SIZE_CLASS;
}) {
  const { iconSet } = useAppearance();
  const Icon = ICON_REGISTRY[iconSet][name];
  return <Icon className={cn(SIZE_CLASS[size], className)} aria-hidden />;
}
