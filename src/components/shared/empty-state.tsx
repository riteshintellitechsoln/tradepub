import { SearchX, type LucideIcon } from "lucide-react";

// Generic "nothing here" panel — Category/Search results now, Admin tables
// (Leads, Downloads, Books) in Module 16.
export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
      <p className="mt-4 font-medium">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
