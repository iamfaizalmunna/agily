import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { redirectIfSignedIn } from "@/lib/auth/actions";

export default async function SignUpPage() {
  await redirectIfSignedIn();

  return (
    <AuthShell
      title="Create an account"
      subtitle="Owner starts a studio. Member and viewer wait for a copy-link invite. Admin is granted by an owner."
    >
      <SignUpForm />
    </AuthShell>
  );
}
