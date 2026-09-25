import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { redirectIfSignedIn } from "@/lib/auth/actions";

export default async function SignInPage() {
  await redirectIfSignedIn();

  return (
    <AuthShell
      title="Sign in"
      subtitle="Email is your login key. Nothing leaves this machine."
    >
      <SignInForm />
    </AuthShell>
  );
}
