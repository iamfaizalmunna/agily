"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppIcon } from "@/components/appearance/app-icon";
import { Button } from "@/components/ui/button";
import { useLensStore } from "@/lib/lens/store";

export function LensPanel({ slug }: { slug?: string }) {
  const search = useSearchParams();
  const focus = search.get("focus") ?? undefined;
  const { open, pending, ollama, messages, setOpen, setPending, setOllama, push } =
    useLensStore();
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (!open) return;
    void fetch("/lens-api/lens/health")
      .then((res) => res.json())
      .then((data: { ollama?: boolean }) => setOllama(Boolean(data.ollama)))
      .catch(() => setOllama(false));
  }, [open, setOllama]);

  if (!open || !slug) return null;

  async function ask() {
    const text = question.trim();
    if (!text || pending) return;
    setQuestion("");
    push({ role: "user", text });
    setPending(true);
    try {
      const res = await fetch("/lens-api/lens/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, question: text, itemId: focus }),
      });
      const data = (await res.json()) as {
        text?: string;
        source?: "ollama" | "local";
        ollama?: boolean;
        error?: string;
      };
      if (typeof data.ollama === "boolean") setOllama(data.ollama);
      push({
        role: "lens",
        text: data.text ?? data.error ?? "Lens could not answer.",
        source: data.source,
      });
    } catch {
      push({
        role: "lens",
        text: "The Express Lens API is not running. Use `npm run dev`.",
        source: "local",
      });
      setOllama(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-16 z-30 mx-auto flex max-h-[70dvh] w-full max-w-lg flex-col border border-paper/15 bg-ink/95 p-4 md:bottom-6 md:right-6 md:left-auto md:mx-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.18em] text-copper">
            <AppIcon name="action.lens" className="size-4" />
            Lens
          </p>
          <p className="text-xs text-paper/45">
            {ollama
              ? "Ollama on this machine"
              : "Local helpers · install Ollama, then ollama pull llama3.2:3b"}
          </p>
        </div>
        <button
          type="button"
          className="flex min-h-10 min-w-10 items-center justify-center text-copper"
          aria-label="Close Lens"
          onClick={() => setOpen(false)}
        >
          <AppIcon name="action.close" className="size-5" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {messages.length ? (
          messages.map((message, index) => (
            <p
              key={`${message.role}-${index}`}
              className={`whitespace-pre-wrap text-sm ${
                message.role === "user" ? "text-paper" : "text-paper/70"
              }`}
            >
              {message.text}
            </p>
          ))
        ) : (
          <p className="text-sm text-paper/40">
            Ask about roles, views, or this board. No API key. Nothing leaves
            127.0.0.1. Browse{" "}
            <Link href="/kb" className="text-copper">
              /kb
            </Link>
            .
          </p>
        )}
      </div>
      <form
        className="mt-3 flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void ask();
        }}
      >
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={2}
          placeholder="Ask Lens"
          className="w-full rounded-2xl border border-paper/10 bg-paper/[0.04] px-3 py-2 text-sm text-paper outline-none focus:border-copper/70"
        />
        <Button className="min-h-11" disabled={pending || !question.trim()}>
          {pending ? "Thinking…" : "Ask"}
        </Button>
      </form>
    </div>
  );
}

export function LensTrigger() {
  const { open, setOpen } = useLensStore();
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-paper/50 hover:text-paper"
      aria-pressed={open}
    >
      <AppIcon name="action.lens" className="size-3.5" />
      Lens
    </button>
  );
}
