"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { MobileBottomSheet } from "@/components/chrome/mobile-bottom-sheet";
import type { MoveStatusChoice } from "@/lib/board/mobile-kanban";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";

export function KanbanMoveMenu({
  title,
  targets,
  onMove,
  disabled,
}: {
  title: string;
  targets: MoveStatusChoice[];
  onMove: (statusId: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!targets.length) return null;

  return (
    <>
      <button
        type="button"
        className={`${mobileTouchTargetClass(
          "shrink-0 rounded-md px-2 text-xs font-medium text-primary md:hidden",
        )}`}
        aria-label={`Move ${title}`}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-1">
          <ArrowRightLeft className="size-3.5" aria-hidden />
          Move
        </span>
      </button>
      <MobileBottomSheet open={open} title="Move to…" onClose={() => setOpen(false)}>
        <ul className="flex flex-col gap-1">
          {targets.map((target) => (
            <li key={target.id}>
              <button
                type="button"
                className="flex min-h-11 w-full items-center rounded-md px-3 text-left text-sm hover:bg-muted"
                onClick={() => {
                  setOpen(false);
                  onMove(target.id);
                }}
              >
                {target.label}
              </button>
            </li>
          ))}
        </ul>
      </MobileBottomSheet>
    </>
  );
}
