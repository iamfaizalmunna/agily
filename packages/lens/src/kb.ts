export type KbDoc = {
  path: string;
  title: string;
  body: string;
};

export type KbHit = {
  path: string;
  title: string;
  snippet: string;
  score: number;
};

export function parseKbMarkdown(filePath: string, raw: string): KbDoc {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const heading = lines.find((line) => line.startsWith("# "));
  const title = heading ? heading.slice(2).trim() : filePath;
  return { path: filePath, title, body: raw };
}

export function tokenize(raw: string) {
  return raw
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);
}

export function scoreKbDoc(doc: KbDoc, query: string) {
  const terms = [...new Set(tokenize(query))];
  if (!terms.length) return 0;
  const hay = `${doc.title} ${doc.body}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (hay.includes(term)) score += 1;
    if (doc.title.toLowerCase().includes(term)) score += 1;
  }
  return score;
}

export function snippetAround(body: string, query: string, size = 180) {
  const terms = tokenize(query);
  const lower = body.toLowerCase();
  let index = 0;
  for (const term of terms) {
    const found = lower.indexOf(term);
    if (found >= 0) {
      index = found;
      break;
    }
  }
  const start = Math.max(0, index - 40);
  const slice = body.slice(start, start + size).replace(/\s+/g, " ").trim();
  return start > 0 ? `…${slice}` : slice;
}

export function retrieveKb(docs: KbDoc[], query: string, limit = 3): KbHit[] {
  return docs
    .map((doc) => ({
      path: doc.path,
      title: doc.title,
      snippet: snippetAround(doc.body, query),
      score: scoreKbDoc(doc, query),
    }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
