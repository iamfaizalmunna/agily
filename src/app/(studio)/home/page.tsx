import Link from "next/link";
import { CreateTeamForm } from "@/components/teams/create-team-form";
import { requireUser } from "@/lib/auth/session";
import { listTeamsForUser } from "@/lib/teams/queries";

export default async function HomePage() {
  const user = await requireUser();
  const teams = await listTeamsForUser(user.id);

  return (
    <section className="flex flex-col gap-8">
      <div>
        <p className="font-display text-xs tracking-[0.22em] text-copper uppercase">
          Studio
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-paper sm:text-5xl">
          {teams.length ? "Your studios" : "No team yet"}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/50 sm:text-base">
          Signed in as {user.name}. Owner starts a studio. Member and viewer
          join with a copied link — nothing is emailed.
        </p>
      </div>

      {teams.length ? (
        <ul className="flex flex-col gap-2">
          {teams.map((team) => (
            <li key={team.id}>
              <Link
                href={`/t/${team.slug}`}
                className="flex min-h-14 items-center justify-between rounded-2xl border border-paper/10 px-4"
              >
                <span>{team.name}</span>
                <span className="text-xs uppercase tracking-[0.14em] text-paper/40">
                  {team.role}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div>
        <h2 className="mb-4 font-display text-xl text-paper">Start a studio</h2>
        <CreateTeamForm />
      </div>
    </section>
  );
}
