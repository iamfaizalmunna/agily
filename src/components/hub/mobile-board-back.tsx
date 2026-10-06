import Link from "next/link";
import { AppIcon } from "@/components/appearance/app-icon";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";

export function MobileBoardBack({ slug }: { slug: string }) {
  return (
    <Link
      href={`/t/${slug}#studio-boards`}
      className={`${mobileTouchTargetClass(
        "inline-flex items-center gap-1 text-sm font-medium text-primary md:hidden",
      )}`}
    >
      <AppIcon name="action.chevron-left" className="size-4" />
      All boards
    </Link>
  );
}
