import Link from "next/link";
import { cn } from "@/lib/cn";
import { unreadBadge } from "@/lib/notices/notices";

export function NoticeBell({
  href,
  count,
  on,
  compact = false,
}: {
  href: string;
  count: number;
  on: boolean;
  compact?: boolean;
}) {
  const badge = unreadBadge(count);
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center justify-center",
        compact
          ? "h-10 min-w-10 text-xs uppercase tracking-[0.16em]"
          : "min-h-14 flex-1 text-xs uppercase tracking-[0.16em]",
        on ? "text-paper" : "text-paper/50 hover:text-paper",
      )}
    >
      Bell
      {badge ? (
        <span className="absolute -top-0.5 right-1 min-w-4 rounded-full bg-copper px-1 text-center text-[0.6rem] leading-4 text-ink">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
