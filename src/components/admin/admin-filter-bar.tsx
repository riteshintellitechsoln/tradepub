import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";

export function AdminFilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <SlidersHorizontal className="h-3.5 w-3.5 text-seal" />
        Filters
      </div>
      <div className="flex flex-wrap items-end gap-3">{children}</div>
    </div>
  );
}

export function AdminFilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}