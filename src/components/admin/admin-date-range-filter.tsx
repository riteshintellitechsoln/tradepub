"use client";

import { useFilterParams } from "@/hooks/use-filter-params";
import { Input } from "@/components/ui/input";

export function AdminDateRangeFilter() {
  const { searchParams, updateParams } = useFilterParams();
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={from}
        onChange={(e) => updateParams({ from: e.target.value || null })}
        className="w-36"
        aria-label="From date"
      />
      <span className="text-xs text-muted-foreground">to</span>
      <Input
        type="date"
        value={to}
        onChange={(e) => updateParams({ to: e.target.value || null })}
        className="w-36"
        aria-label="To date"
      />
      {(from || to) && (
        <button
          type="button"
          onClick={() => updateParams({ from: null, to: null })}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          Clear
        </button>
      )}
    </div>
  );
}