import Link from "next/link";
import { AppIcon } from "@/components/appearance/app-icon";
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
      aria-label={badge ? `Inbox, ${badge} unread` : "Inbox"}
      className={cn(
        "relative inline-flex items-center justify-center",
        compact
          ? "h-10 min-w-10"
          : "min-h-14 flex-1",
        on ? "text-paper" : "text-paper/50 hover:text-paper",
      )}
    >
      <AppIcon name="nav.inbox" className="size-5" />
      {badge ? (
        <span className="absolute -top-0.5 right-1 min-w-4 rounded-full bg-copper px-1 text-center text-[0.6rem] leading-4 text-on-copper">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
