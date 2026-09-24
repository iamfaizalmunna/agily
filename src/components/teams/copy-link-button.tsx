"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      className="min-h-12 w-full sm:w-auto"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? "Copied" : "Copy join link"}
    </Button>
  );
}
