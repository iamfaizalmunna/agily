import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";

function safeName(raw: string) {
  return /^[a-z0-9-]+$/.test(raw) ? raw : null;
}

export default async function KbDocPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const slug = safeName(name);
  if (!slug) notFound();

  const file = path.join(process.cwd(), "kb", `${slug}.md`);
  const raw = await readFile(file, "utf8").catch(() => null);
  if (!raw) notFound();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-10">
      <Link href="/kb" className="text-sm text-copper">
        All notes
      </Link>
      <article className="whitespace-pre-wrap text-sm leading-relaxed text-paper/80">
        {raw}
      </article>
    </main>
  );
}
