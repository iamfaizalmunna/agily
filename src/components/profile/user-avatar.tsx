import Image from "next/image";
import { avatarPublicUrl } from "@/lib/appearance/appearance";
import { personInitials } from "@/lib/items/assign";
import { cn } from "@/lib/cn";

export function UserAvatar({
  userId,
  name,
  hasAvatar,
  className,
  size = "md",
}: {
  userId: string;
  name: string;
  hasAvatar: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-14 text-base" : "size-10 text-sm";
  const px = size === "sm" ? 32 : size === "lg" ? 56 : 40;

  if (hasAvatar) {
    return (
      <Image
        src={avatarPublicUrl(userId)}
        alt=""
        width={px}
        height={px}
        className={cn("rounded-full object-cover bg-muted", dim, className)}
        unoptimized
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground",
        dim,
        className,
      )}
      aria-hidden
    >
      {personInitials(name)}
    </span>
  );
}
