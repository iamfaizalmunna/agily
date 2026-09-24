"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center bg-[#12100e] px-4 text-[#f4efe6]">
        <main className="max-w-md text-center">
          <h1 className="text-2xl">Agily hit a wall</h1>
          <p className="mt-3 text-sm text-[#f4efe6]/60">
            Reload the app. Nothing was sent to the cloud.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#c9844a] px-5 text-sm font-medium text-[#12100e]"
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
