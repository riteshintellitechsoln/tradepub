"use client";

import { useFilterParams } from "@/hooks/use-filter-params";
import { Input } from "@/components/ui/input";

export function AdminMonthFilter() {
  const { searchParams, updateParams } = useFilterParams();
  const month = searchParams.get("month") ?? "";

  return (
    <div className="flex items-center gap-2">
      <Input
        type="month"
        value={month}
        onChange={(e) => updateParams({ month: e.target.value || null })}
        className="w-40"
        aria-label="Filter by month"
      />
      {month && (
        <button
          type="button"
          onClick={() => updateParams({ month: null })}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          Clear
        </button>
      )}
    </div>
  );
}