import Link from "next/link";
import { AppIcon } from "@/components/appearance/app-icon";
import { NavIconRow } from "@/components/appearance/nav-icon-row";
import { UserAvatar } from "@/components/profile/user-avatar";
import { CreateTeamForm } from "@/components/teams/create-team-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { listTeamsForUser } from "@/lib/teams/queries";

export default async function HomePage() {
  const user = await requireUser();
  const teams = await listTeamsForUser(user.id);

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Studios
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          {teams.length ? "Your studios" : "Start your first studio"}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <UserAvatar
            userId={user.id}
            name={user.name}
            hasAvatar={Boolean(user.avatarPath)}
          />
          <div>
            <p className="text-sm text-muted-foreground">
              Signed in as {user.name}
            </p>
            <Link
              href="/home/profile"
              className="inline-flex text-sm font-medium text-primary hover:underline"
            >
              <NavIconRow icon="nav.profile">Profile & appearance</NavIconRow>
            </Link>
          </div>
        </div>
      </div>

      {teams.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {teams.map((team) => (
            <li key={team.id}>
              <Link href={`/t/${team.slug}`}>
                <Card className="flex min-h-[4.5rem] items-center justify-between p-4 transition-colors hover:border-primary/40 hover:bg-muted/30">
                  <div>
                    <p className="font-medium">{team.name}</p>
                    <p className="text-xs text-muted-foreground">Open pulse</p>
                  </div>
                  <AppIcon
                    name="nav.pulse"
                    className="size-5 shrink-0 text-muted-foreground"
                  />
                  <Badge variant="outline" className="uppercase">
                    {team.role}
                  </Badge>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Create a studio</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A studio holds boards, people, and settings — like a Jira workspace.
        </p>
        <div className="mt-4">
          <CreateTeamForm />
        </div>
      </Card>
    </section>
  );
}
