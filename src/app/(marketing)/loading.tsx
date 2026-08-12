import { Skeleton } from "@/components/ui/skeleton";
import { BookGridSkeleton } from "@/components/books/book-grid-skeleton";

export default function HomeLoading() {
  return (
    <div>
      <div className="border-b bg-muted/20 py-16">
        <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-3/4 max-w-sm" />
            <Skeleton className="mt-4 h-4 w-full max-w-sm" />
            <div className="mt-6 flex gap-3">
              <Skeleton className="h-11 w-40" />
              <Skeleton className="h-11 w-40" />
            </div>
          </div>
          <Skeleton className="hidden h-80 w-full max-w-sm lg:block" />
        </div>
      </div>

      <div className="container py-16">
        <Skeleton className="mb-8 h-8 w-64" />
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>

      <div className="border-t bg-muted/20 py-16">
        <div className="container">
          <Skeleton className="mb-8 h-8 w-64" />
          <BookGridSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}