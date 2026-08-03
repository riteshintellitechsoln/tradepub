"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { archiveBook } from "@/actions/admin/books";

export function ArchiveBookButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (
      !confirm(
        "Archive this book? It disappears from the public site, but its download history is kept.",
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await archiveBook(bookId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Book archived");
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={isPending}>
      <Archive className="h-4 w-4" />
      Archive
    </Button>
  );
}
