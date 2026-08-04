import Link from "next/link";
import { ArrowUpRight, BookMarked } from "lucide-react";
import type { CategoryWithCount } from "@/actions/categories";

// Horizontal scroll on mobile, a proper grid from `sm` up. Categories don't
// have admin-set icons yet in the seed data, so every card falls back to
// the same BookMarked glyph — Module 16's category form can let Admins pick
// a per-category lucide icon later without this component needing to change.
export function CategoryScroller({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group flex w-44 shrink-0 snap-start flex-col justify-between rounded-xl border bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md sm:w-auto"
        >
          <div className="flex items-center justify-between"><BookMarked className="h-5 w-5 text-primary" /><ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" /></div>
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
