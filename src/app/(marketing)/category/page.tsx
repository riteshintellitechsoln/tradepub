import type { Metadata } from "next";
import Link from "next/link";
import { BookMarked } from "lucide-react";
import { getCategoriesWithBookCounts } from "@/actions/categories";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse every category of free business and technology resources on TradeHub.",
};

export default async function CategoriesIndexPage() {
  const categories = await getCategoriesWithBookCounts();

  return (
    <div className="container py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">Browse</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">All Categories</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {categories.length} categories covering everything from cloud infrastructure to HR.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex flex-col justify-between rounded-xl border bg-card p-5 transition-colors hover:border-primary"
          >
            <BookMarked className="h-6 w-6 text-primary" />
            <div className="mt-6">
              <p className="font-display font-semibold">{category.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {category._count.books} resource{category._count.books === 1 ? "" : "s"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
