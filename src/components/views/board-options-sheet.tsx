"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { MobileBottomSheet } from "@/components/chrome/mobile-bottom-sheet";
import { ChipButton } from "@/components/ui/chip";
import { type BoardDisplayPrefs, type SwimlaneMode } from "@/lib/board/kanban";
import { effectiveKanbanCompact } from "@/lib/board/mobile-kanban";
import { useMdDown } from "@/lib/ui/use-md-down";
import { mobileTouchTargetClass } from "@/lib/ui/mobile";
import Link from "next/link";

export function BoardOptionsSheet({
  slug,
  projectSlug,
  prefs,
  compactQuery,
  onPrefsChange,
}: {
  slug: string;
  projectSlug: string;
  prefs: BoardDisplayPrefs;
  compactQuery?: string;
  onPrefsChange: (next: BoardDisplayPrefs, compactRaw?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useMdDown();
  const compact = effectiveKanbanCompact(compactQuery, isMobile);

  const setLane = (swimlane: SwimlaneMode) => {
    onPrefsChange({ ...prefs, swimlane }, compactQuery);
    setOpen(false);
  };

  const toggle = (key: "hideDone" | "compact") => {
    if (key === "compact") {
      onPrefsChange(prefs, compact ? "0" : "1");
      return;
    }
    onPrefsChange({ ...prefs, hideDone: !prefs.hideDone }, compactQuery);
  };

  return (
    <>
      <button
        type="button"
        className={`${mobileTouchTargetClass(
          "inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium md:hidden",
        )}`}
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="size-4" aria-hidden />
        Board options
      </button>
      <MobileBottomSheet
        open={open}
        title="Board options"
        onClose={() => setOpen(false)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <ChipButton active={compact} onClick={() => toggle("compact")}>
              Compact cards
            </ChipButton>
            <ChipButton active={prefs.hideDone} onClick={() => toggle("hideDone")}>
              Hide done
            </ChipButton>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Swimlanes
            </p>
            <div className="flex flex-wrap gap-2">
              <ChipButton
                active={prefs.swimlane === "none"}
                onClick={() => setLane("none")}
              >
                Flat
              </ChipButton>
              <ChipButton
                active={prefs.swimlane === "assignee"}
                onClick={() => setLane("assignee")}
              >
                By assignee
              </ChipButton>
              <ChipButton
                active={prefs.swimlane === "priority"}
                onClick={() => setLane("priority")}
              >
                By priority
              </ChipButton>
            </div>
          </div>
          <Link
            href={`/t/${slug}/p/${projectSlug}/settings`}
            className="min-h-11 text-sm font-medium text-primary"
            onClick={() => setOpen(false)}
          >
            Workflow & fields
          </Link>
        </div>
      </MobileBottomSheet>
    </>
  );
}
