import { SignInForm } from "@/components/auth/sign-in-form";
import { redirectIfSignedIn } from "@/lib/auth/actions";

export default async function SignInPage() {
  await redirectIfSignedIn();

  return (
    <main className="flex min-h-dvh flex-1 flex-col px-4 pb-10 pt-8 sm:items-center sm:justify-center sm:px-6">
      <div className="w-full max-w-[22rem] sm:max-w-sm">
        <p className="font-display text-xs tracking-[0.22em] text-copper uppercase sm:text-sm">
          Agily
        </p>
        <h1 className="mt-4 font-display text-3xl leading-tight text-paper sm:mt-6 sm:text-4xl">
          Sign in
        </h1>
        <p className="mt-3 mb-8 text-sm leading-relaxed text-paper/50">
          Email is your login key. Nothing leaves this machine.
        </p>
        <SignInForm />
      </div>
    </main>
  );
}
