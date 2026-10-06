import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { publicDocumentPageClass } from "@/lib/ui/layout-contract";

async function listKb() {
  const dir = path.join(process.cwd(), "kb");
  const names = (await readdir(dir).catch(() => [])).filter((name) =>
    name.endsWith(".md"),
  );
  return Promise.all(
    names.sort().map(async (name) => {
      const raw = await readFile(path.join(dir, name), "utf8");
      const heading = raw.split("\n").find((line) => line.startsWith("# "));
      return {
        slug: name.replace(/\.md$/, ""),
        title: heading ? heading.slice(2).trim() : name,
      };
    }),
  );
}

export default async function KbIndexPage() {
  const docs = await listKb();

  return (
    <main className={publicDocumentPageClass()}>
      <div>
        <p className="font-display text-xs uppercase tracking-[0.22em] text-copper">
          Lens
        </p>
        <h1 className="mt-3 font-display text-3xl text-paper">Knowledge</h1>
        <p className="mt-3 text-sm leading-relaxed text-paper/50">
          Bundled markdown on this machine. Lens reads these files. Nothing is
          fetched from the public internet.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {docs.map((doc) => (
          <li key={doc.slug}>
            <Link
              href={`/kb/${doc.slug}`}
              className="flex min-h-14 items-center rounded-2xl border border-paper/10 px-4"
            >
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/home" className="text-sm text-copper">
        Back to studio
      </Link>
    </main>
  );
}
