"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShortcutHelp } from "@/components/chrome/shortcut-help";
import {
  isTypingTarget,
  nextChordBuffer,
  normalizeKey,
  resolveKeyboardChord,
  type KeyboardAction,
} from "@/lib/chrome/keyboard";
import { projectSlugFromPath, teamSlugFromPath } from "@/lib/nav/studio";
import { useLensStore } from "@/lib/lens/store";
import { boardViewHref } from "@/lib/views/views";

export function KeyboardProvider({ slug }: { slug?: string }) {
  const router = useRouter();
  const path = usePathname();
  const search = useSearchParams();
  const lensOpen = useLensStore((state) => state.open);
  const setLensOpen = useLensStore((state) => state.setOpen);
  const [helpOpen, setHelpOpen] = useState(false);
  const [buffer, setBuffer] = useState("");

  const teamSlug = teamSlugFromPath(path) ?? slug;
  const projectSlug = projectSlugFromPath(path);
  const onBoard = Boolean(teamSlug && projectSlug);

  useEffect(() => {
    if (!buffer) return;
    const timer = window.setTimeout(() => setBuffer(""), 900);
    return () => window.clearTimeout(timer);
  }, [buffer]);

  useEffect(() => {
    const run = (action: KeyboardAction) => {
      switch (action.type) {
        case "show-help":
          setHelpOpen(true);
          break;
        case "close-overlay":
          setHelpOpen(false);
          setLensOpen(false);
          break;
        case "toggle-lens":
          setLensOpen(!lensOpen);
          break;
        case "go-home":
          router.push("/home");
          break;
        case "go-pulse":
          router.push(`/t/${action.slug}`);
          break;
        case "go-people":
          router.push(`/t/${action.slug}/people`);
          break;
        case "switch-view":
          if (!teamSlug || !projectSlug) break;
          router.push(
            boardViewHref(
              teamSlug,
              projectSlug,
              action.view,
              search.get("ym") ?? undefined,
              {
                q: search.get("q") ?? undefined,
                status: search.get("status") ?? undefined,
                who: search.get("who") ?? undefined,
                lens: search.get("lens") ?? undefined,
                focus: search.get("focus") ?? undefined,
              },
            ),
          );
          break;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;

      const ctx = { slug: teamSlug, onBoard, helpOpen, lensOpen };

      if (event.key === "Escape") {
        const action = resolveKeyboardChord("Escape", ctx);
        if (!action) return;
        event.preventDefault();
        run(action);
        return;
      }

      const key = normalizeKey(event);
      if (!key) return;

      const chord = buffer.startsWith("g") || key === "g"
        ? nextChordBuffer(buffer, key)
        : key;

      if (buffer.startsWith("g") || key === "g") {
        setBuffer(chord);
        event.preventDefault();
        const action = resolveKeyboardChord(chord, ctx);
        if (!action) return;
        run(action);
        setBuffer("");
        return;
      }

      const action = resolveKeyboardChord(key, ctx);
      if (!action) return;
      event.preventDefault();
      run(action);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    buffer,
    helpOpen,
    lensOpen,
    onBoard,
    projectSlug,
    router,
    search,
    setLensOpen,
    teamSlug,
  ]);

  return (
    <ShortcutHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
  );
}
