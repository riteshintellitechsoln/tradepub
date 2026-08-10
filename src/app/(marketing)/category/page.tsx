import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoriesWithBookCounts } from "@/actions/categories";
import { getCategoryIcon } from "@/lib/category-icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse every category of free business and technology resources on TradeHub.",
};

export default async function CategoriesIndexPage() {
  const categories = await getCategoriesWithBookCounts();
  const totalResources = categories.reduce((sum, c) => sum + c._count.books, 0);

  return (
    <div className="container py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">Browse</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">All Categories</h1>
        <div className="my-4 h-px w-16 bg-seal" />
        <p className="max-w-2xl text-muted-foreground">
          {categories.length} categories, {totalResources} resource
          {totalResources === 1 ? "" : "s"} — everything from cloud infrastructure to HR.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          const hasResources = category._count.books > 0;

          return (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border bg-card p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-lg",
                !hasResources && "opacity-70",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" />
              </div>

              <div className="mt-5">
                <p className="font-display font-semibold leading-snug">{category.name}</p>
                <Badge
                  variant={hasResources ? "seal" : "secondary"}
                  className="mt-2 text-[10px] font-medium"
                >
                  {hasResources
                    ? `${category._count.books} resource${category._count.books === 1 ? "" : "s"}`
                    : "Coming soon"}
                </Badge>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}