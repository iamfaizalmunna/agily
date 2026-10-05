import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  boardCounts,
  buildLensPrompt,
  checklistFromBody,
  cleanTitle,
  extractiveAnswer,
  isLoopbackUrl,
  parseKbMarkdown,
  parseOllamaChat,
  resolveOllamaBase,
  resolveOllamaModel,
  retrieveKb,
} from "./index.ts";

describe("phase 9 lens", () => {
  it("allows only loopback Ollama URLs", () => {
    assert.equal(isLoopbackUrl("http://127.0.0.1:11434"), true);
    assert.equal(isLoopbackUrl("http://localhost:11434"), true);
    assert.equal(isLoopbackUrl("https://api.openai.com"), false);
    assert.equal(isLoopbackUrl("not a url"), false);
    assert.deepEqual(resolveOllamaBase("http://10.0.0.2:11434"), {
      error: "Ollama must be on 127.0.0.1 or localhost",
    });
    assert.equal(resolveOllamaBase("http://127.0.0.1:11434/").base, "http://127.0.0.1:11434");
    assert.equal(resolveOllamaBase().base, "http://127.0.0.1:11434");
    assert.equal(resolveOllamaBase("   ").base, "http://127.0.0.1:11434");
    assert.equal(isLoopbackUrl("https://localhost:11434"), true);
    assert.equal(isLoopbackUrl("http://[::1]:11434"), true);
    assert.equal(isLoopbackUrl("ftp://127.0.0.1"), false);
    assert.equal(isLoopbackUrl(""), false);
    assert.equal(resolveOllamaModel("  "), "llama3.2:3b");
    assert.equal(resolveOllamaModel("phi3:mini"), "phi3:mini");
    assert.equal(resolveOllamaModel(null), "llama3.2:3b");
  });

  it("retrieves KB snippets by keyword", () => {
    const docs = [
      parseKbMarkdown("roles.md", "# Roles\nOwner starts a studio. Viewer is read only."),
      parseKbMarkdown("views.md", "# Views\nPulse, Ledger, Flow, and Orbit share Item rows."),
    ];
    const hits = retrieveKb(docs, "viewer read");
    assert.equal(hits[0]?.path, "roles.md");
    assert.ok(hits[0]?.snippet.toLowerCase().includes("viewer"));
    assert.deepEqual(retrieveKb(docs, "zzzz"), []);
    assert.equal(parseKbMarkdown("plain.md", "no heading here").title, "plain.md");
    const padded = parseKbMarkdown(
      "pad.md",
      `${"x".repeat(50)} viewer later in the body`,
    );
    assert.ok(retrieveKb([padded], "viewer")[0]?.snippet.startsWith("…"));
    assert.equal(retrieveKb(docs, "   ").length, 0);
    const titleOnly = parseKbMarkdown(
      "title-hit.md",
      "# Viewer\nOnly the title matches viewer.",
    );
    const titleHits = retrieveKb([titleOnly], "viewer");
    assert.equal(titleHits[0]?.path, "title-hit.md");
  });

  it("answers locally when Ollama is down", () => {
    assert.equal(cleanTitle("  Ship   lenses!! "), "Ship lenses");
    assert.deepEqual(checklistFromBody("- one\n* two\n3. three\nplain"), [
      "one",
      "two",
      "three",
    ]);
    const counts = boardCounts([
      { title: "A", status: "doing" },
      { title: "B", status: "done", overdue: true },
    ]);
    assert.equal(counts.total, 2);
    assert.equal(counts.overdue, 1);
    const counted = extractiveAnswer("how many on the board", [], { counts });
    assert.match(counted.text, /2 tickets/);
    const emptyBoard = extractiveAnswer("count the board", [], {
      counts: boardCounts([]),
    });
    assert.match(emptyBoard.text, /0 tickets/);
    const titled = extractiveAnswer("cleanup this ticket title", [], {
      itemTitle: "  messy title. ",
    });
    assert.match(titled.text, /messy title/);
    const kb = extractiveAnswer("roles", [
      { path: "r.md", title: "Roles", snippet: "Owner starts.", score: 2 },
    ]);
    assert.match(kb.text, /Owner starts/);
    const empty = extractiveAnswer("hello", []);
    assert.match(empty.text, /ollama pull/);
    assert.match(buildLensPrompt("Q", "CTX"), /Context/);
    assert.equal(parseOllamaChat({ message: { content: "  Hi  " } }), "Hi");
    assert.equal(parseOllamaChat({ message: { content: "   " } }), null);
    assert.equal(parseOllamaChat({ message: { content: 1 } }), null);
    assert.equal(parseOllamaChat({ message: null }), null);
    assert.equal(parseOllamaChat({}), null);
    assert.equal(parseOllamaChat(null), null);
    assert.equal(parseOllamaChat("nope"), null);
  });
});
