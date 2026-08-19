// export function getMonthRange(month?: string): { gte: Date; lt: Date } | undefined {
//   if (!month) return undefined;
//   const [year, mon] = month.split("-").map(Number);
//   if (!year || !mon || mon < 1 || mon > 12) return undefined;

//   const start = new Date(year, mon - 1, 1);
//   const end = new Date(year, mon, 1);
//   return { gte: start, lt: end };
// }


export function getDateRange(from?: string, to?: string): { gte?: Date; lt?: Date } | undefined {
  if (!from && !to) return undefined;

  const range: { gte?: Date; lt?: Date } = {};
  if (from) {
    const [y, m, d] = from.split("-").map(Number);
    if (y && m && d) range.gte = new Date(y, m - 1, d);
  }
  if (to) {
    const [y, m, d] = to.split("-").map(Number);
    if (y && m && d) range.lt = new Date(y, m - 1, d + 1);
  }
  return range;
}