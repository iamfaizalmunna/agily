import { AppIcon } from "@/components/appearance/app-icon";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="quiet" className="gap-2">
        <AppIcon name="action.sign-out" className="size-4" />
        Sign out
      </Button>
    </form>
  );
}
