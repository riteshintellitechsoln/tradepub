import { db } from "@/lib/db";
import { CategoryManager } from "@/components/admin/category-manager";

// Fetches ALL categories, including inactive ones — the public
// getActiveCategories() (Module 7) filters those out on purpose, but an
// Admin needs to see (and re-activate) an inactive category too.
export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Categories</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
