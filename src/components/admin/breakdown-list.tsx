// A ranked list with proportional bars, used for every "top N" breakdown
// on the Analytics page (category, publisher, industry, company size).
// Chosen over a pie chart deliberately: for ranked comparisons like these,
// a sorted list with bar lengths is easier to scan than wedge angles, and
// it doesn't run into "too many thin slices" the way a pie does past 5-6
// items.
export function BreakdownList({
  rows,
  emptyMessage,
}: {
  rows: { name: string; count: number }[];
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  const max = Math.max(...rows.map((row) => row.count), 1);

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.name}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className="truncate font-medium">{row.name}</span>
            <span className="shrink-0 text-muted-foreground">{row.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
