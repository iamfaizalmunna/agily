"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { withLensFind, type LensSpec } from "@/lib/lenses/lenses";
import type { BoardView } from "@/lib/views/views";

export function FilterSearch({
  slug,
  projectSlug,
  view,
  yearMonth,
  spec,
  savedId,
}: {
  slug: string;
  projectSlug: string;
  view: BoardView;
  yearMonth?: string;
  spec: LensSpec;
  savedId?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(spec.find ?? "");

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const next = withLensFind(spec, value);
        const params = new URLSearchParams();
        if (view !== "summary") params.set("view", view);
        if (view === "orbit" && yearMonth) params.set("ym", yearMonth);
        if (savedId) params.set("lens", savedId);
        else {
          if (next.kind) params.set("q", next.kind);
          if (next.status) params.set("status", next.status);
          if (next.personId) params.set("who", next.personId);
          if (next.priority) params.set("priority", next.priority);
          if (next.find) params.set("find", next.find);
        }
        const q = params.toString();
        router.push(
          q
            ? `/t/${slug}/p/${projectSlug}?${q}`
            : `/t/${slug}/p/${projectSlug}`,
        );
      }}
    >
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search tickets…"
        className="h-9"
      />
      <Button type="submit" variant="outline" size="sm">
        Search
      </Button>
    </form>
  );
}
