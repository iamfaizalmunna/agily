import Link from "next/link";
import { lensQueryRecord, type LensSpec } from "@/lib/lenses/lenses";

export function BoardExportLink({
  slug,
  projectSlug,
  spec,
  savedId,
}: {
  slug: string;
  projectSlug: string;
  spec: LensSpec;
  savedId?: string;
}) {
  const params = new URLSearchParams();
  const extra = lensQueryRecord(spec, savedId);
  for (const [key, value] of Object.entries(extra)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  const href = `/t/${slug}/p/${projectSlug}/export${qs ? `?${qs}` : ""}`;
  return (
    <Link
      href={href}
      className="text-xs font-medium text-primary hover:underline"
      prefetch={false}
    >
      Export CSV
    </Link>
  );
}
