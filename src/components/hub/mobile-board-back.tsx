import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";

export function MobileBoardBack({ slug }: { slug: string }) {
  return (
    <Link
      href={`/t/${slug}#studio-boards`}
      className={`${mobileTouchTargetClass(
        "inline-flex items-center gap-1 text-sm font-medium text-primary md:hidden",
      )}`}
    >
      <ChevronLeft className="size-4" aria-hidden />
      All boards
    </Link>
  );
}
