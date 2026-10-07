"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_NOTICE_PREFS,
  readNoticePrefs,
  writeNoticePrefs,
  type NoticePrefs,
} from "@/lib/notices/prefs";
import { AppIcon } from "@/components/appearance/app-icon";
import { NavIconRow } from "@/components/appearance/nav-icon-row";
import { playNoticeChime, unlockNoticeAudio } from "@/lib/notices/sound";

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        className="mt-1 size-4 rounded border-border"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

export function NotificationPrefsPanel() {
  const [prefs, setPrefs] = useState<NoticePrefs>(DEFAULT_NOTICE_PREFS);

  useEffect(() => {
    setPrefs(readNoticePrefs(window.localStorage));
  }, []);

  function update(patch: Partial<NoticePrefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      writeNoticePrefs(window.localStorage, next);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <NavIconRow icon="nav.notices">Notification preferences</NavIconRow>
      </p>
      <p className="text-sm text-muted-foreground">
        In-app notices appear in the Bell inbox. When teammates move cards or add
        tickets, other members get notified here (this device only for sound and
        pop-ups).
      </p>
      <ToggleRow
        label="Pop-up alerts"
        description="Show a short toast when a new notice arrives while you are online."
        checked={prefs.toast}
        onChange={(toast) => update({ toast })}
      />
      <ToggleRow
        label="Sound"
        description="Play a short chime with each pop-up (respects browser mute)."
        checked={prefs.sound}
        onChange={(sound) => update({ sound })}
      />
      <ToggleRow
        label="Board activity"
        description="Notify the studio when tickets are created or moved on the kanban board."
        checked={prefs.boardActivity}
        onChange={(boardActivity) => update({ boardActivity })}
      />
      <button
        type="button"
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-primary hover:underline"
        onClick={() => {
          unlockNoticeAudio();
          playNoticeChime();
        }}
      >
        <AppIcon name="action.volume" className="size-4" />
        Test sound
      </button>
    </div>
  );
}
