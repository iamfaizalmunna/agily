"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorPanel } from "@/components/chrome/empty-state";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPanel
      title="Something broke"
      body="This page hit an error. Your SQLite data is still on disk. Try again or return home."
    >
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="primary" onClick={() => reset()}>
          Try again
        </Button>
        <Link
          href="/home"
          className="inline-flex min-h-11 items-center rounded-full border border-paper/15 px-5 text-sm text-paper"
        >
          Your studios
        </Link>
      </div>
    </ErrorPanel>
  );
}
