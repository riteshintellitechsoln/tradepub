"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

// Root-level error boundary. Must be a Client Component per Next.js
// convention. Logs to the console for now — swap the console.error for a
// real error-tracking call (Sentry, etc.) when one is wired up.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. You can try again, or head back to the homepage.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
