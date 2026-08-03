import { Loader2 } from "lucide-react";

// Root-level loading UI — shown while any route segment without its own
// loading.tsx is still rendering on the server. Individual sections (Book
// grids in Module 11, Admin tables in Module 16) get their own skeletons
// where a spinner alone would feel unpolished.
export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
