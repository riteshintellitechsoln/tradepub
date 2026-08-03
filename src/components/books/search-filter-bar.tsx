"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilterParams } from "@/hooks/use-filter-params";
import { BOOK_FORMAT_OPTIONS, SORT_OPTIONS } from "@/lib/constants";
import type { NavCategory } from "@/actions/categories";

// Same URL-is-the-state pattern as CategoryFilterBar (Module 10), plus a
// Category selector — /search isn't scoped to one category the way
// /category/[slug] is, so it needs a way to narrow results to one.
export function SearchFilterBar({
  categories,
  companies,
}: {
  categories: NavCategory[];
  companies: { id: string; name: string }[];
}) {
  const { searchParams, updateParams } = useFilterParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (debouncedQuery === current) return;
    updateParams({ q: debouncedQuery || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const selectClass =
    "h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all resources..."
          aria-label="Search"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          className={selectClass}
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateParams({ category: e.target.value || null })}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={searchParams.get("format") ?? ""}
          onChange={(e) => updateParams({ format: e.target.value || null })}
          aria-label="Filter by format"
        >
          <option value="">All formats</option>
          {BOOK_FORMAT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {companies.length > 0 && (
          <select
            className={selectClass}
            value={searchParams.get("company") ?? ""}
            onChange={(e) => updateParams({ company: e.target.value || null })}
            aria-label="Filter by publisher"
          >
            <option value="">All publishers</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        )}

        <select
          className={selectClass}
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateParams({ sort: e.target.value === "newest" ? null : e.target.value })}
          aria-label="Sort"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
