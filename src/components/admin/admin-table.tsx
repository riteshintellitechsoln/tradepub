import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

// Plain server-renderable table — no client-side table library. Every admin
// list (Books, Leads, Downloads, Email Logs, Users) uses the same
// URL-is-the-state search/pagination pattern as the public Category/Search
// pages (useFilterParams + Pagination), so this component only needs to
// render whatever rows the page already fetched.
export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "No records found.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className={cn("whitespace-nowrap px-4 py-3 font-medium", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-muted/20">
              {columns.map((col) => (
                <td key={col.header} className={cn("px-4 py-3", col.className)}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
