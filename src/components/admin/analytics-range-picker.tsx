import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AnalyticsRange } from "@/actions/admin/analytics";

const OPTIONS: { value: AnalyticsRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

// Plain server-renderable Links, not a client dropdown — three options is
// few enough that a segmented control is both simpler to build and clearer
// to use than a Select, and it needs zero client JS to work.
export function AnalyticsRangePicker({ current }: { current: AnalyticsRange }) {
  return (
    <div className="flex gap-1 rounded-md border p-1">
      {OPTIONS.map((opt) => (
        <Link
          key={opt.value}
          href={opt.value === "30d" ? "/admin/analytics" : `/admin/analytics?range=${opt.value}`}
          className={cn(
            "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
            current === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}
