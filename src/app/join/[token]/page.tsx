import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser, normalizeEmail } from "@/lib/auth/session";
import { JoinForm } from "@/components/teams/join-form";
import {
  publicContentWidthClass,
  publicViewportPageClass,
} from "@/lib/ui/layout-contract";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { team: true },
  });
  const session = await getCurrentUser();

  if (!invite || invite.expiresAt < new Date()) {
    return (
      <main className={publicViewportPageClass()}>
        <div className={publicContentWidthClass()}>
          <h1 className="font-display text-3xl text-paper">Link expired</h1>
          <p className="mt-3 text-sm text-paper/50">
            Ask an owner or admin for a new copy-link invite.
          </p>
          <Link href="/signin" className="mt-6 inline-block text-copper">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizeEmail(invite.email) },
  });
  const mismatch =
    session && session.email !== normalizeEmail(invite.email);

  return (
    <main className={publicViewportPageClass()}>
      <div className={publicContentWidthClass()}>
        <p className="font-display text-xs tracking-[0.22em] text-copper uppercase">
          Join
        </p>
        <h1 className="mt-4 font-display text-3xl text-paper">
          {invite.team.name}
        </h1>
        {mismatch ? (
          <p className="mt-4 text-sm text-copper">
            This link is for {invite.email}. Sign out, then open it again.
          </p>
        ) : (
          <div className="mt-8">
            <JoinForm
              token={token}
              email={invite.email}
              teamName={invite.team.name}
              role={invite.role}
              isNewUser={!existing}
            />
          </div>
        )}
      </div>
    </main>
  );
}
