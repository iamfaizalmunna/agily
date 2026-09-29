import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";

export function MobileNavItem({
  href,
  label,
  icon: Icon,
  active,
  badge,
  onClick,
}: {
  href?: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string | null;
  onClick?: () => void;
}) {
  const className = cn(
    "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[0.65rem] font-medium",
    active ? "text-primary" : "text-muted-foreground",
  );

  const inner = (
    <>
      <span className={cn(mobileTouchTargetClass("relative h-9 w-9"), "shrink-0")}>
        <Icon className="size-5" aria-hidden />
        {badge ? (
          <span
            className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-destructive px-1 text-center text-[0.6rem] leading-4 text-destructive-foreground"
          >
            {badge}
          </span>
        ) : null}
      </span>
      <span className="truncate">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} aria-label={label} onClick={onClick}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={className} aria-label={label} aria-current={active ? "page" : undefined}>
      {inner}
    </Link>
  );
}
