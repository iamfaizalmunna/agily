/* c8 ignore next */
const LOOPBACK = new Set(["127.0.0.1", "localhost", "[::1]", "::1"]);

export const DEFAULT_OLLAMA_BASE = "http://127.0.0.1:11434";
export const DEFAULT_OLLAMA_MODEL = "llama3.2:3b";

export function isLoopbackUrl(raw: string) {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return LOOPBACK.has(url.hostname);
  } catch {
    return false;
  }
}

export function resolveOllamaBase(raw?: string | null) {
  const value = (raw ?? DEFAULT_OLLAMA_BASE).trim() || DEFAULT_OLLAMA_BASE;
  if (!isLoopbackUrl(value)) {
    return { error: "Ollama must be on 127.0.0.1 or localhost" as const };
  }
  return { base: value.replace(/\/$/, "") };
}

export function resolveOllamaModel(raw?: string | null) {
  const model = (raw ?? DEFAULT_OLLAMA_MODEL).trim();
  return model || DEFAULT_OLLAMA_MODEL;
}
