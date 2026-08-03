"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Shared logic behind every filter/sort control in the app: write straight
// to the URL's query string, drop `page` back to 1 whenever a filter
// changes, and let the Server Component page re-fetch on navigation. First
// used by CategoryFilterBar (Module 10); SearchFilterBar (Module 11) uses it
// too rather than re-implementing the same URLSearchParams juggling.
export function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
    });
  }

  return { searchParams, updateParams, isPending };
}
