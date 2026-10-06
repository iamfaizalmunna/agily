"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NotificationToastStack, type ToastNotice } from "@/components/notices/notification-toast-stack";
import { NOTICE_LIVE_POLL_MS } from "@/lib/notices/notices";
import { readNoticePrefs } from "@/lib/notices/prefs";
import { playNoticeChime } from "@/lib/notices/sound";
import { teamSlugFromPath } from "@/lib/nav/studio";

type LivePayload = {
  notices: {
    id: string;
    kind: string;
    title: string;
    body: string;
    href: string;
    createdAt: string;
  }[];
  unread: number;
  serverTime: string;
};

const BOARD_KINDS = new Set(["status_changed", "ticket_created"]);

export function NotificationLiveProvider({
  onUnread,
}: {
  onUnread?: (teamSlug: string, count: number) => void;
}) {
  const path = usePathname();
  const slug = teamSlugFromPath(path);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);
  const seenRef = useRef<Set<string>>(new Set());
  const sinceRef = useRef<string>(new Date().toISOString());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((row) => row.id !== id));
  }, []);

  useEffect(() => {
    seenRef.current = new Set();
    sinceRef.current = new Date().toISOString();
    setToasts([]);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function poll() {
      const prefs = readNoticePrefs(window.localStorage);
      try {
        const url = new URL("/api/notices/live", window.location.origin);
        url.searchParams.set("team", slug!);
        url.searchParams.set("since", sinceRef.current);
        const res = await fetch(url.toString(), { credentials: "include" });
        if (!res.ok) return;
        const data = (await res.json()) as LivePayload;
        if (cancelled) return;
        sinceRef.current = data.serverTime;
        onUnread?.(slug!, data.unread);

        if (document.visibilityState === "hidden") return;

        const fresh = data.notices.filter((row) => !seenRef.current.has(row.id));
        for (const row of fresh) {
          seenRef.current.add(row.id);
        }
        if (!fresh.length || !prefs.toast) return;

        const toastable = fresh.filter(
          (row) =>
            !BOARD_KINDS.has(row.kind) || prefs.boardActivity,
        );
        if (!toastable.length) return;

        if (prefs.sound) {
          playNoticeChime();
        }

        setToasts((prev) => {
          const next = [
            ...toastable.map((row) => ({
              id: row.id,
              title: row.title,
              body: row.body,
              href: row.href,
            })),
            ...prev,
          ];
          return next.slice(0, 4);
        });

        for (const row of toastable) {
          window.setTimeout(() => dismiss(row.id), 12_000);
        }
      } catch {
        /* offline / sleep */
      }
    }

    const id = window.setInterval(poll, NOTICE_LIVE_POLL_MS);
    void poll();
    const onVis = () => {
      if (document.visibilityState === "visible") void poll();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [slug, dismiss, onUnread]);

  return <NotificationToastStack items={toasts} onDismiss={dismiss} />;
}
