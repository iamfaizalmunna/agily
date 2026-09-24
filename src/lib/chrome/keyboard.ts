import type { BoardView } from "@/lib/views/views";

export type KeyboardAction =
  | { type: "show-help" }
  | { type: "toggle-lens" }
  | { type: "close-overlay" }
  | { type: "go-home" }
  | { type: "go-pulse"; slug: string }
  | { type: "go-people"; slug: string }
  | { type: "switch-view"; view: BoardView };

export function isTypingTarget(target: EventTarget | null) {
  if (!target || typeof target !== "object") return false;
  const el = target as { tagName?: string; isContentEditable?: boolean };
  if (!el.tagName) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    Boolean(el.isContentEditable)
  );
}

export function normalizeKey(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey" | "shiftKey">,
) {
  if (event.metaKey || event.ctrlKey || event.altKey) return "";
  if (event.key === "?" || (event.key === "/" && event.shiftKey)) return "?";
  return event.key.length === 1 ? event.key.toLowerCase() : event.key;
}

export function boardViewFromDigit(digit: string): BoardView | null {
  if (digit === "1") return "ledger";
  if (digit === "2") return "flow";
  if (digit === "3") return "orbit";
  return null;
}

export function resolveKeyboardChord(
  chord: string,
  ctx: {
    slug?: string;
    onBoard?: boolean;
    helpOpen?: boolean;
    lensOpen?: boolean;
  },
): KeyboardAction | null {
  if (chord === "?" || chord === "Shift+/") return { type: "show-help" };
  if (chord === "Escape") {
    if (ctx.helpOpen || ctx.lensOpen) return { type: "close-overlay" };
    return null;
  }
  if (chord === "/" || chord === "l") return { type: "toggle-lens" };
  if (chord === "g h") return { type: "go-home" };
  if (chord === "g p" && ctx.slug) return { type: "go-pulse", slug: ctx.slug };
  if (chord === "g e" && ctx.slug) return { type: "go-people", slug: ctx.slug };
  if (ctx.onBoard) {
    const view = boardViewFromDigit(chord);
    if (view) return { type: "switch-view", view };
  }
  return null;
}

export function nextChordBuffer(buffer: string, key: string, maxParts = 2) {
  const parts = buffer ? buffer.split(" ") : [];
  parts.push(key);
  while (parts.length > maxParts) parts.shift();
  return parts.join(" ");
}
