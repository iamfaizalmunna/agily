import { createReadStream } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import { config as loadEnv } from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  boardCounts,
  buildLensPrompt,
  extractiveAnswer,
  parseKbMarkdown,
  parseOllamaChat,
  resolveOllamaBase,
  resolveOllamaModel,
  retrieveKb,
  type KbDoc,
} from "@agily/lens";

const SESSION_COOKIE = "agily_session";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
loadEnv({ path: path.join(root, ".env") });

function resolveDatabaseUrl(raw: string | undefined) {
  const value = raw ?? "file:./prisma/dev.db";
  if (!value.startsWith("file:")) return value;
  const filePath = value.slice("file:".length);
  if (path.isAbsolute(filePath)) return value;
  return `file:${path.resolve(path.join(root, "prisma"), filePath)}`;
}

process.env.DATABASE_URL = resolveDatabaseUrl(process.env.DATABASE_URL);

const PORT = Number(process.env.LENS_API_PORT ?? 43124);
const prisma = new PrismaClient();
const kbDir = process.env.LENS_KB_DIR ?? path.join(root, "kb");

const askSchema = z.object({
  slug: z.string().min(1),
  question: z.string().trim().min(1).max(500),
  itemId: z.string().optional(),
});

async function loadKb(): Promise<KbDoc[]> {
  const names = await readdir(kbDir).catch(() => []);
  const docs: KbDoc[] = [];
  for (const name of names) {
    if (!name.endsWith(".md")) continue;
    const raw = await readFile(path.join(kbDir, name), "utf8");
    docs.push(parseKbMarkdown(name, raw));
  }
  return docs;
}

async function userFromCookie(token: string | undefined) {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || session.expiresAt.getTime() <= Date.now()) return null;
  return session.user;
}

async function ollamaHealth(base: string) {
  try {
    const res = await fetch(`${base}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function ollamaChat(base: string, model: string, prompt: string) {
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: "user", content: prompt }],
    }),
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return null;
  return parseOllamaChat(await res.json());
}

export function createApp() {
  const app = express();
  app.use(express.json({ limit: "32kb" }));
  app.use(cookieParser());

  app.get("/v1/health", (_req, res) => {
    res.json({ ok: true, service: "agily-api" });
  });

  app.get("/v1/lens/health", async (_req, res) => {
    const resolved = resolveOllamaBase(process.env.OLLAMA_BASE_URL);
    if ("error" in resolved) {
      res.status(400).json({ ok: false, ollama: false, error: resolved.error });
      return;
    }
    const live = await ollamaHealth(resolved.base);
    res.json({
      ok: true,
      ollama: live,
      base: resolved.base,
      model: resolveOllamaModel(process.env.OLLAMA_MODEL),
    });
  });

  app.get("/v1/lens/kb/:name", async (req, res) => {
    const name = path.basename(req.params.name ?? "");
    if (!name.endsWith(".md")) {
      res.status(404).end();
      return;
    }
    res.type("text/markdown");
    createReadStream(path.join(kbDir, name)).on("error", () =>
      res.status(404).end(),
    ).pipe(res);
  });

  app.post("/v1/lens/ask", async (req, res) => {
    const user = await userFromCookie(req.cookies?.[SESSION_COOKIE]);
    if (!user) {
      res.status(401).json({ error: "Sign in first" });
      return;
    }
    const parsed = askSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Bad ask" });
      return;
    }
    const member = await prisma.teamMember.findFirst({
      where: { userId: user.id, team: { slug: parsed.data.slug } },
      include: { team: true },
    });
    if (!member) {
      res.status(404).json({ error: "Studio not found" });
      return;
    }

    const items = await prisma.item.findMany({
      where: { project: { teamId: member.teamId, archived: false } },
      select: { id: true, title: true, status: true, dueOn: true },
    });
    const now = Date.now();
    const counts = boardCounts(
      items.map((item) => ({
        title: item.title,
        status: item.status,
        overdue: Boolean(item.dueOn && item.dueOn.getTime() < now && item.status !== "done"),
      })),
    );
    const focused = parsed.data.itemId
      ? items.find((item) => item.id === parsed.data.itemId)
      : undefined;
    const docs = await loadKb();
    const hits = retrieveKb(docs, parsed.data.question);
    const context = [
      `Studio ${member.team.name}: ${counts.total} tickets, ${counts.overdue} overdue.`,
      focused ? `Open ticket: ${focused.title} (${focused.status}).` : "",
      ...hits.map((hit) => `${hit.title}: ${hit.snippet}`),
    ]
      .filter(Boolean)
      .join("\n");

    const local = extractiveAnswer(parsed.data.question, hits, {
      counts,
      itemTitle: focused?.title,
    });
    const resolved = resolveOllamaBase(process.env.OLLAMA_BASE_URL);
    if ("error" in resolved) {
      res.json({ ...local, hits });
      return;
    }
    const live = await ollamaHealth(resolved.base);
    if (!live) {
      res.json({ ...local, hits, ollama: false });
      return;
    }
    const text = await ollamaChat(
      resolved.base,
      resolveOllamaModel(process.env.OLLAMA_MODEL),
      buildLensPrompt(parsed.data.question, context),
    );
    res.json({
      source: text ? "ollama" : local.source,
      text: text ?? local.text,
      hits,
      ollama: true,
    });
  });

  return app;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  createApp().listen(PORT, "127.0.0.1", () => {
    console.log(`Agily API on 127.0.0.1:${PORT}`);
  });
}
