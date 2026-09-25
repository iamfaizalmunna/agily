"use client";

import { useRouter } from "next/navigation";
import { ChipButton } from "@/components/ui/chip";
import {
  boardDisplayQuery,
  type BoardDisplayPrefs,
  type SwimlaneMode,
} from "@/lib/board/kanban";
import { boardViewHref } from "@/lib/views/views";

export function BoardSettingsBar({
  slug,
  projectSlug,
  prefs,
  lensExtra,
}: {
  slug: string;
  projectSlug: string;
  prefs: BoardDisplayPrefs;
  lensExtra: Record<string, string | undefined>;
}) {
  const router = useRouter();

  const pushPrefs = (next: BoardDisplayPrefs) => {
    const href = boardViewHref(slug, projectSlug, "flow", undefined, {
      ...lensExtra,
      ...boardDisplayQuery(next),
    });
    router.push(href);
  };

  const toggle = (key: "hideDone" | "compact") => {
    pushPrefs({ ...prefs, [key]: !prefs[key] });
  };

  const setLane = (swimlane: SwimlaneMode) => {
    pushPrefs({ ...prefs, swimlane });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Board</span>
      <ChipButton
        active={prefs.compact}
        onClick={() => toggle("compact")}
      >
        Compact
      </ChipButton>
      <ChipButton
        active={prefs.hideDone}
        onClick={() => toggle("hideDone")}
      >
        Hide done
      </ChipButton>
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
  );
}
