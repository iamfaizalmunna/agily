"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommandPaletteStore } from "@/lib/search/palette-store";

export function CommandPaletteTrigger({ compact }: { compact?: boolean }) {
  const toggle = useCommandPaletteStore((state) => state.toggle);

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? "sm" : "default"}
      className="gap-2 text-muted-foreground"
      onClick={() => toggle()}
      aria-keyshortcuts="Meta+K Control+K"
    >
      <Search className="size-4 shrink-0" aria-hidden />
      {compact ? (
        <span className="sr-only">Search</span>
      ) : (
        <>
          <span>Search</span>
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground sm:inline">
            ⌘K
          </kbd>
        </>
      )}
    </Button>
  );
}
