import { Skeleton } from "@/components/ui/skeleton";
import { BookGridSkeleton } from "@/components/books/book-grid-skeleton";

export default function CategoryDetailLoading() {
  return (
    <div className="container py-12">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-full max-w-xs" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <BookGridSkeleton count={8} />
    </div>
  );
}