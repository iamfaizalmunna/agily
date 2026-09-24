import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getMembership } from "@/lib/teams/queries";

export default async function TeamHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const ctx = await getMembership(user.id, slug);
  if (!ctx) notFound();

  return (
    <section className="flex flex-col gap-6">
      <p className="font-display text-xs tracking-[0.22em] text-copper uppercase">
        Pulse
      </p>
      <h1 className="font-display text-3xl leading-tight text-paper sm:text-5xl">
        {ctx.team.name}
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-paper/50 sm:text-base">
        You are {ctx.role} here. Boards arrive in phase 3. Invite people now —
        copy a join link, do not wait on email.
      </p>
      <Link
        href={`/t/${slug}/people`}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-copper px-5 text-sm font-medium text-ink"
      >
        People
      </Link>
    </section>
  );
}
