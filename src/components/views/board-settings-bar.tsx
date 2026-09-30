"use client";

import { useRouter } from "next/navigation";
import { ChipButton } from "@/components/ui/chip";
import {
  boardDisplayQuery,
  type BoardDisplayPrefs,
  type SwimlaneMode,
} from "@/lib/board/kanban";
import { effectiveKanbanCompact } from "@/lib/board/mobile-kanban";
import { BoardOptionsSheet } from "@/components/views/board-options-sheet";
import { useMdDown } from "@/lib/ui/use-md-down";
import Link from "next/link";
import { boardViewHref } from "@/lib/views/views";

function flowPrefsHref(
  slug: string,
  projectSlug: string,
  prefs: BoardDisplayPrefs,
  lensExtra: Record<string, string | undefined>,
  compactRaw?: string,
) {
  const extra: Record<string, string | undefined> = {
    ...lensExtra,
    ...boardDisplayQuery(prefs),
  };
  if (compactRaw === "0") extra.compact = "0";
  else if (compactRaw === "1") extra.compact = "1";
  return boardViewHref(slug, projectSlug, "flow", undefined, extra);
}

export function BoardSettingsBar({
  slug,
  projectSlug,
  prefs,
  lensExtra,
  compactQuery,
}: {
  slug: string;
  projectSlug: string;
  prefs: BoardDisplayPrefs;
  lensExtra: Record<string, string | undefined>;
  compactQuery?: string;
}) {
  const router = useRouter();
  const isMobile = useMdDown();
  const compact = effectiveKanbanCompact(compactQuery, isMobile);

  const pushPrefs = (next: BoardDisplayPrefs, compactRaw = compactQuery) => {
    router.push(flowPrefsHref(slug, projectSlug, next, lensExtra, compactRaw));
  };

  const toggle = (key: "hideDone" | "compact") => {
    if (key === "compact") {
      pushPrefs(prefs, compact ? "0" : "1");
      return;
    }
    pushPrefs({ ...prefs, hideDone: !prefs.hideDone });
  };

  const setLane = (swimlane: SwimlaneMode) => {
    pushPrefs({ ...prefs, swimlane });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <BoardOptionsSheet
        slug={slug}
        projectSlug={projectSlug}
        prefs={prefs}
        compactQuery={compactQuery}
        onPrefsChange={pushPrefs}
      />
      <div className="hidden flex-wrap items-center gap-2 md:flex">
      <span className="text-xs font-medium text-muted-foreground">Board</span>
      <ChipButton
        active={compact}
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
      <Link
        href={`/t/${slug}/p/${projectSlug}/settings`}
        className="ml-auto text-xs font-medium text-primary hover:underline"
      >
        Workflow & fields
      </Link>
      </div>
    </div>
  );
}
