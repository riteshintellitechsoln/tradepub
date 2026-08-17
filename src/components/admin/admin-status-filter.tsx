"use client";

import { useFilterParams } from "@/hooks/use-filter-params";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminStatusFilterProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  paramName?: string;
}

export function AdminStatusFilter({
  options,
  placeholder = "All",
  paramName = "status",
}: AdminStatusFilterProps) {
  const { searchParams, updateParams } = useFilterParams();
  const value = searchParams.get(paramName) ?? "all";

  return (
    <Select
      value={value}
      onValueChange={(next) => updateParams({ [paramName]: next === "all" ? null : next })}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}