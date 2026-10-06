"use client";

import { AppIcon } from "@/components/appearance/app-icon";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";
import { cn } from "@/lib/cn";

export function FocusMobileFooter({
  canSave,
  onStatus,
  onComment,
}: {
  canSave: boolean;
  onStatus: () => void;
  onComment: () => void;
}) {
  return (
    <footer
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm md:hidden",
        "pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]",
      )}
    >
      <div className="grid grid-cols-3 gap-1 px-2 py-2">
        <button
          type="button"
          className={mobileTouchTargetClass(
            "flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-muted-foreground",
          )}
          onClick={onStatus}
        >
          <AppIcon name="action.workflow" className="size-4" />
          Status
        </button>
        <button
          type="button"
          className={mobileTouchTargetClass(
            "flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-muted-foreground",
          )}
          onClick={onComment}
        >
          <AppIcon name="action.comment" className="size-4" />
          Comment
        </button>
        {canSave ? (
          <button
            type="submit"
            form="focus-item-form"
            className={mobileTouchTargetClass(
              "flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-primary",
            )}
          >
            <AppIcon name="action.save" className="size-4" />
            Save
          </button>
        ) : (
          <span className="flex min-h-11 items-center justify-center text-xs text-muted-foreground">
            Read only
          </span>
        )}
      </div>
    </footer>
  );
}
