import Link from "next/link";
import { SaveLensForm } from "@/components/lenses/save-lens-form";
import { Button } from "@/components/ui/button";
import { deleteLensAction } from "@/lib/lenses/actions";
import {
  LENS_KIND_LABEL,
  LENS_KINDS,
  isEmptyLens,
  lensQueryRecord,
  sameLensSpec,
  toggleLensKind,
  toggleLensPerson,
  toggleLensStatus,
  type LensSpec,
} from "@/lib/lenses/lenses";
import { ITEM_STATUSES, STATUS_LABEL } from "@/lib/items/status";
import { boardViewHref, type BoardView } from "@/lib/views/views";
import { cn } from "@/lib/cn";

type SavedLens = { id: string; name: string; spec: LensSpec };
type Person = { id: string; name: string };

function chipClass(on: boolean) {
  return cn(
    "inline-flex min-h-11 items-center rounded-full px-4 text-sm",
    on ? "bg-copper text-on-copper" : "border border-paper/15 text-paper/70",
  );
}

export function LensBar({
  slug,
  projectSlug,
  view,
  yearMonth,
  spec,
  savedId,
  saved,
  people,
}: {
  slug: string;
  projectSlug: string;
  view: BoardView;
  yearMonth?: string;
  spec: LensSpec;
  savedId?: string;
  saved: SavedLens[];
  people: Person[];
}) {
  const hrefFor = (next: LensSpec, id?: string) =>
    boardViewHref(slug, projectSlug, view, yearMonth, lensQueryRecord(next, id));
  const here = boardViewHref(
    slug,
    projectSlug,
    view,
    yearMonth,
    lensQueryRecord(spec, savedId),
  );

  return (
    <div className="flex flex-col gap-3">
      <nav className="flex flex-wrap gap-2" aria-label="Lenses">
        <Link href={hrefFor({})} className={chipClass(isEmptyLens(spec) && !savedId)}>
          All
        </Link>
        {saved.map((lens) => (
          <span key={lens.id} className="inline-flex items-center gap-1">
            <Link
              href={hrefFor(lens.spec, lens.id)}
              className={chipClass(savedId === lens.id || (!savedId && sameLensSpec(spec, lens.spec)))}
            >
              {lens.name}
            </Link>
            <form action={deleteLensAction}>
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="lensId" value={lens.id} />
              <input type="hidden" name="next" value={hrefFor({})} />
              <Button type="submit" variant="quiet" className="min-h-11 px-2">
                ×
              </Button>
            </form>
          </span>
        ))}
        {LENS_KINDS.map((kind) => (
          <Link
            key={kind}
            href={hrefFor(toggleLensKind(spec, kind))}
            className={chipClass(!savedId && spec.kind === kind)}
          >
            {LENS_KIND_LABEL[kind]}
          </Link>
        ))}
        {ITEM_STATUSES.map((status) => (
          <Link
            key={status}
            href={hrefFor(toggleLensStatus(spec, status))}
            className={chipClass(!savedId && spec.status === status)}
          >
            {STATUS_LABEL[status]}
          </Link>
        ))}
        {people.map((person) => (
          <Link
            key={person.id}
            href={hrefFor(toggleLensPerson(spec, person.id))}
            className={chipClass(!savedId && spec.personId === person.id)}
          >
            {person.name}
          </Link>
        ))}
      </nav>
      <SaveLensForm slug={slug} next={here} spec={spec} />
    </div>
  );
}
