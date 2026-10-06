/* c8 ignore next */
export const NOTICE_PREFS_KEY = "agily:notice-prefs";

export type NoticePrefs = {
  sound: boolean;
  toast: boolean;
  boardActivity: boolean;
};

export const DEFAULT_NOTICE_PREFS: NoticePrefs = {
  sound: true,
  toast: true,
  boardActivity: true,
};

export function parseNoticePrefs(raw: string | null): NoticePrefs {
  if (!raw) return DEFAULT_NOTICE_PREFS;
  try {
    const parsed = JSON.parse(raw) as Partial<NoticePrefs>;
    return {
      sound: parsed.sound ?? DEFAULT_NOTICE_PREFS.sound,
      toast: parsed.toast ?? DEFAULT_NOTICE_PREFS.toast,
      boardActivity:
        parsed.boardActivity ?? DEFAULT_NOTICE_PREFS.boardActivity,
    };
  } catch {
    return DEFAULT_NOTICE_PREFS;
  }
}

export function readNoticePrefs(storage: Storage): NoticePrefs {
  return parseNoticePrefs(storage.getItem(NOTICE_PREFS_KEY));
}

export function writeNoticePrefs(storage: Storage, prefs: NoticePrefs) {
  storage.setItem(NOTICE_PREFS_KEY, JSON.stringify(prefs));
}
