import { db } from "@/lib/db";

// Deliberately does NOT include a raw download count. On a freshly seeded or
// pre-launch database that number is 0, which reads as broken rather than
// honest ("0 resources downloaded" is worse than not mentioning it at all).
// Categories/Resources/Publishers counts stay meaningful from day one.
// Admin > Analytics (Module 18) is where real download totals belong.
export async function getHomeStats() {
  const [totalBooks, totalCategories, totalCompanies] = await Promise.all([
    db.book.count({ where: { status: "PUBLISHED" } }),
    db.category.count({ where: { isActive: true } }),
    db.company.count(),
  ]);

  return { totalBooks, totalCategories, totalCompanies };
}
