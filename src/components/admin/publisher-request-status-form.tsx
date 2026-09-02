"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { PublisherRequestStatus } from "@prisma/client";
// import { updatePublisherRequestStatus } from "@/actions/publisher-requests";
import { updatePublisherRequestStatus } from "@/actions/admin/publisher-requests";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PublisherRequestStatusForm({
  id,
  initialStatus,
  initialNotes,
}: {
  id: string;
  initialStatus: PublisherRequestStatus;
  initialNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<PublisherRequestStatus>(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    await updatePublisherRequestStatus(id, status, notes);
    setIsSaving(false);
    toast.success("Saved");
    router.refresh();
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div>
        <label className="text-sm font-medium">Status</label>
        <Select value={status} onValueChange={(v) => setStatus(v as PublisherRequestStatus)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="REVIEWING">Reviewing</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Internal notes</label>
        <Textarea
          className="mt-1.5"
          rows={4}
          placeholder="e.g. Called Aug 30, waiting on final PDF..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save
      </Button>
    </div>
  );
}