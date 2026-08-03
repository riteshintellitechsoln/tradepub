import Link from "next/link";
import { BookMarked } from "lucide-react";
import type { CategoryWithCount } from "@/actions/categories";

// Horizontal scroll on mobile, a proper grid from `sm` up. Categories don't
// have admin-set icons yet in the seed data, so every card falls back to
// the same BookMarked glyph — Module 16's category form can let Admins pick
// a per-category lucide icon later without this component needing to change.
export function CategoryScroller({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group flex w-40 shrink-0 flex-col justify-between rounded-xl border bg-card p-4 transition-colors hover:border-primary sm:w-auto"
        >
          <BookMarked className="h-5 w-5 text-primary" />
          <div className="mt-4">
            <p className="font-display text-sm font-semibold leading-snug">
              {category.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {category._count.books} resource{category._count.books === 1 ? "" : "s"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
