// import Link from "next/link";
// import { ArrowUpRight, BookMarked } from "lucide-react";
// import type { CategoryWithCount } from "@/actions/categories";

// // Horizontal scroll on mobile, a proper grid from `sm` up. Categories don't
// // have admin-set icons yet in the seed data, so every card falls back to
// // the same BookMarked glyph — Module 16's category form can let Admins pick
// // a per-category lucide icon later without this component needing to change.
// export function CategoryScroller({ categories }: { categories: CategoryWithCount[] }) {
//   return (
//     <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
//       {categories.map((category) => (
//         <Link
//           key={category.id}
//           href={`/category/${category.slug}`}
//           className="group flex w-44 shrink-0 snap-start flex-col justify-between rounded-xl border bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md sm:w-auto"
//         >
//           <div className="flex items-center justify-between"><BookMarked className="h-5 w-5 text-primary" /><ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" /></div>
//           <div className="mt-4">
//             <p className="font-display text-sm font-semibold leading-snug">
//               {category.name}
//             </p>
//             <p className="mt-1 text-xs text-muted-foreground">
//               {category._count.books} resource{category._count.books === 1 ? "" : "s"}
//             </p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }



import Link from "next/link";
import type { CategoryWithCount } from "@/actions/categories";
import { getCategoryIcon } from "@/lib/category-icons";

export function CategoryScroller({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.name);

        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex w-40 shrink-0 flex-col justify-between rounded-xl border bg-card p-4 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_20px_40px_-8px_rgba(22,35,78,0.25),0_8px_16px_-4px_rgba(22,35,78,0.15)] sm:w-auto"
          >
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute inset-0 scale-100 rounded-full bg-primary/0 blur-md transition-all duration-300 group-hover:scale-150 group-hover:bg-primary/30" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="relative mt-4">
              <p className="font-display text-sm font-semibold leading-snug">
                {category.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {category._count.books} resource{category._count.books === 1 ? "" : "s"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
