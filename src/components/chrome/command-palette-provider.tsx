"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/chrome/command-palette";
import { isCommandPaletteKey } from "@/lib/chrome/keyboard";
import { projectSlugFromPath, teamSlugFromPath } from "@/lib/nav/studio";
import { useCommandPaletteStore } from "@/lib/search/palette-store";

export function CommandPaletteProvider({ slug }: { slug?: string }) {
  const path = usePathname();
  const teamSlug = teamSlugFromPath(path) ?? slug;
  const projectSlug = projectSlugFromPath(path);
  const open = useCommandPaletteStore((state) => state.open);
  const setOpen = useCommandPaletteStore((state) => state.setOpen);
  const toggle = useCommandPaletteStore((state) => state.toggle);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isCommandPaletteKey(event)) {
        event.preventDefault();
        toggle();
        return;
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen, toggle]);

  return <CommandPalette slug={teamSlug} projectSlug={projectSlug} />;
}
