import type { KbHit } from "./kb";

export function cleanTitle(raw: string) {
  return raw.replace(/\s+/g, " ").trim().replace(/[.!?]+$/, "");
}

export function checklistFromBody(body: string) {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""));
}

export type BoardFact = {
  title: string;
  status: string;
  overdue?: boolean;
};

export function boardCounts(items: BoardFact[]) {
  const byStatus: Record<string, number> = {};
  let overdue = 0;
  for (const item of items) {
    byStatus[item.status] = (byStatus[item.status] ?? 0) + 1;
    if (item.overdue) overdue += 1;
  }
  return { total: items.length, overdue, byStatus };
}

export function extractiveAnswer(
  question: string,
  hits: KbHit[],
  facts?: { counts?: ReturnType<typeof boardCounts>; itemTitle?: string },
) {
  const q = question.toLowerCase();
  if (facts?.counts && /(how many|count|board)/.test(q)) {
    const { total, overdue, byStatus } = facts.counts;
    const status = Object.entries(byStatus)
      .map(([name, n]) => `${n} ${name}`)
      .join(", ");
    return {
      source: "local" as const,
      text: `This studio has ${total} tickets${status ? ` (${status})` : ""}. ${overdue} overdue.`,
    };
  }
  if (facts?.itemTitle && /(this ticket|title|cleanup)/.test(q)) {
    return {
      source: "local" as const,
      text: `Suggested title: ${cleanTitle(facts.itemTitle)}`,
    };
  }
  if (hits.length) {
    return {
      source: "local" as const,
      text: hits.map((hit) => `${hit.title}: ${hit.snippet}`).join("\n\n"),
    };
  }
  return {
    source: "local" as const,
    text: "I only know this studio and the bundled KB. Install Ollama and run `ollama pull llama3.2:3b` for a rewrite on this machine.",
  };
}

export function buildLensPrompt(
  question: string,
  context: string,
) {
  return [
    "You are Agily Lens. Answer only from the context. If the context is missing the answer, say so. Do not invent cloud APIs.",
    `Context:\n${context}`,
    `Question: ${question}`,
  ].join("\n\n");
}

export function parseOllamaChat(raw: unknown) {
  if (!raw || typeof raw !== "object") return null;
  const message = (raw as { message?: { content?: unknown } }).message;
  if (!message || typeof message.content !== "string") return null;
  const text = message.content.trim();
  return text || null;
}
