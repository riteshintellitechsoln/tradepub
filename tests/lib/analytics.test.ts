import { describe, expect, it } from "vitest";
import { bucketByDay } from "@/lib/analytics";

describe("bucketByDay", () => {
  it("returns exactly `days` buckets even with no timestamps at all", () => {
    const since = new Date("2026-01-01T00:00:00.000Z");
    const result = bucketByDay([], since, 5);
    expect(result).toHaveLength(5);
    expect(result.every((r) => r.count === 0)).toBe(true);
  });

  it("counts timestamps into the correct calendar-day bucket", () => {
    const since = new Date("2026-01-01T00:00:00.000Z");
    const timestamps = [
      new Date("2026-01-01T08:00:00.000Z"),
      new Date("2026-01-01T20:00:00.000Z"),
      new Date("2026-01-03T12:00:00.000Z"),
    ];
    const result = bucketByDay(timestamps, since, 5);

    expect(result[0]).toEqual({ date: "2026-01-01", count: 2 });
    expect(result[1]).toEqual({ date: "2026-01-02", count: 0 });
    expect(result[2]).toEqual({ date: "2026-01-03", count: 1 });
  });

  it("ignores timestamps outside the requested window — this is what keeps a 7-day chart from silently including older data", () => {
    const since = new Date("2026-01-10T00:00:00.000Z");
    const timestamps = [new Date("2026-01-01T00:00:00.000Z")];
    const result = bucketByDay(timestamps, since, 3);
    expect(result.every((r) => r.count === 0)).toBe(true);
  });

  it("returns buckets in chronological order", () => {
    const since = new Date("2026-06-01T00:00:00.000Z");
    const result = bucketByDay([], since, 3);
    expect(result.map((r) => r.date)).toEqual(["2026-06-01", "2026-06-02", "2026-06-03"]);
  });
});
