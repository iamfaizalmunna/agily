import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="quiet">
        Sign out
      </Button>
    </form>
  );
}
