// Shared by both Module 17 (Dashboard) and Module 18 (Analytics) — pulled
// out once the same "bucket timestamps into calendar days" logic showed up
// in a second place (getDownloadsTimeSeries and getDownloadsSeriesForRange).
// A pure function, not a DB query, so it's trivially testable on its own.
export function bucketByDay(
  timestamps: Date[],
  since: Date,
  days: number,
): { date: string; count: number }[] {
  const buckets = new Map<string, number>();

  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const timestamp of timestamps) {
    const key = timestamp.toISOString().slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}
