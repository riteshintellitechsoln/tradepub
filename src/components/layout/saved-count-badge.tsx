"use client";

import { useSavedBooksCount } from "@/hooks/use-saved-books-count";

export function SavedCountBadge() {
  const count = useSavedBooksCount();
  if (count === 0) return null;

  return (
    // <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-background bg-seal px-1 text-[10px] font-bold leading-none text-white shadow-sm">

<span className="absolute -right-1.5 -top-1.5 z-20 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-background bg-seal px-1 text-[10px] font-bold leading-none text-white shadow-sm">    {count > 9 ? "9+" : count}
    </span>
  );
}