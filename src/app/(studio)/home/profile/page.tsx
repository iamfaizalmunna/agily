import Link from "next/link";
import { ProfileAppearanceForm } from "@/components/profile/profile-appearance-form";
import { ProfileAvatarForm } from "@/components/profile/profile-avatar-form";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getUserProfile } from "@/lib/profile/queries";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const user = await requireUser();
  const profile = await getUserProfile(user.id);
  if (!profile) {
    return null;
  }
  const query = await searchParams;
  const saved = query.saved;
  const error = query.error ? decodeURIComponent(query.error) : null;

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-8">
      <div>
        <Link
          href="/home"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Studios
        </Link>
        <h1 className="mt-3 text-2xl font-semibold">Your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {profile.email} · Saved to your account on this server.
        </p>
        {saved ? (
          <p className="mt-2 text-sm text-primary" role="status">
            Saved {saved === "appearance" ? "appearance" : "profile photo"}.
          </p>
        ) : null}
        {error ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Photo</h2>
        <div className="mt-4">
          <ProfileAvatarForm
            userId={profile.id}
            name={profile.name}
            hasAvatar={Boolean(profile.avatarPath)}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Theme and icons follow you in every studio.
        </p>
        <div className="mt-4">
          <ProfileAppearanceForm appearance={profile.appearance} />
        </div>
      </Card>
    </section>
  );
}
