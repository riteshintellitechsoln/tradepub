"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilterParams } from "@/hooks/use-filter-params";

// Same URL-is-the-state debounced pattern as CategoryFilterBar/SearchFilterBar
// (Modules 10-11), reused here for every Admin list's search box instead of
// writing the same debounce-and-push logic a fourth time.
export function AdminSearchBox({ placeholder = "Search..." }: { placeholder?: string }) {
  const { searchParams, updateParams } = useFilterParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (debouncedQuery === current) return;
    updateParams({ q: debouncedQuery || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div className="relative max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label="Search"
      />
    </div>
  );
}
