import Link from "next/link";
import { ErrorPanel } from "@/components/chrome/empty-state";

export default function NotFound() {
  return (
    <ErrorPanel
      title="Not here"
      body="That studio, board, or note is not on this machine. Check the link or go back to your studios."
    >
      <Link
        href="/home"
        className="inline-flex min-h-11 items-center rounded-full bg-copper px-5 text-sm font-medium text-on-copper"
        data-testid="not-found-home"
      >
        Your studios
      </Link>
    </ErrorPanel>
  );
}
