"use client";

import type { ReactNode } from "react";
import { FocusMobileFooter } from "@/components/focus/focus-mobile-footer";
import { FocusStage } from "@/components/focus/focus-stage";

export function MobileFocusDetail({
  closeHref,
  canSave,
  children,
}: {
  closeHref: string;
  canSave: boolean;
  children: ReactNode;
}) {
  const jumpToStatus = () => {
    document.getElementById("focus-status")?.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("focus-status")?.focus();
  };

  const jumpToComment = () => {
    document.querySelector<HTMLButtonElement>('[data-focus-tab="comments"]')?.click();
    document.getElementById("focus-discussion")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <FocusStage closeHref={closeHref} mobile>
      <div className="pb-24">{children}</div>
      <FocusMobileFooter
        canSave={canSave}
        onStatus={jumpToStatus}
        onComment={jumpToComment}
      />
    </FocusStage>
  );
}
