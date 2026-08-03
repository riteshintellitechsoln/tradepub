import { db } from "@/lib/db";

// Read used directly by the (marketing) layout (a Server Component) to
// populate the Navbar's Topics mega-menu — no API round trip needed since
// it's rendered on the server anyway. Module 10 (Categories) reuses this
// same query for the /category index page.
export async function getActiveCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, icon: true },
  });
}

export type NavCategory = Awaited<ReturnType<typeof getActiveCategories>>[number];

// Used by the Home page's "Popular Categories" section — same category list,
// plus a count of books in each so the card can show "12 resources" etc.
export async function getCategoriesWithBookCounts(limit?: number) {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      _count: { select: { books: true } },
    },
  });
}

export type CategoryWithCount = Awaited<
  ReturnType<typeof getCategoriesWithBookCounts>
>[number];

// Powers the /category/[slug] page header (name + description) — returns
// null for an unknown slug so the page can call notFound().
export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, description: true },
  });
}
