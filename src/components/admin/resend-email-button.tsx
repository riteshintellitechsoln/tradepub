"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resendDownloadEmail } from "@/actions/download";

// Calls resendDownloadEmail() (Module 15) directly as a Server Action —
// the same function backing the spec's POST /api/send-email, just invoked
// without a fetch() round trip since this button already lives inside the
// authenticated Admin app.
export function ResendEmailButton({ downloadId }: { downloadId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await resendDownloadEmail(downloadId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Email resent");
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={isPending}>
      <RotateCw className="h-4 w-4" />
      Resend
    </Button>
  );
}
