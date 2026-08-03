"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestLibraryResend } from "@/actions/library";

// The self-service counterpart to Admin's ResendEmailButton (Module 16) —
// same underlying resendDownloadEmail(), but reached through
// requestLibraryResend()'s ownership check instead of an admin-only guard,
// since this button is reachable by any visitor on a public page.
export function LibraryResendButton({
  downloadId,
  email,
}: {
  downloadId: string;
  email: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await requestLibraryResend(downloadId, email);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Email sent — check your inbox");
      router.refresh();
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={isPending}>
      <RotateCw className="h-4 w-4" />
      Resend
    </Button>
  );
}
