"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check, Ellipsis, EyeOff, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ResourceActions({ title, url }: { title: string; url: string }) {
  const [saved, setSaved] = useState(false);
  const storageKey = `tradehub:saved:${url}`;

  useEffect(() => {
    setSaved(window.localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function toggleSaved() {
    const nextSaved = !saved;
    setSaved(nextSaved);
    window.localStorage.setItem(storageKey, String(nextSaved));
    toast.success(nextSaved ? "Saved for later" : "Removed from your saved list");
  }

  async function share() {
    const shareData = { title, text: `Take a look at ${title}` };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(new URL(url, window.location.origin).toString());
        toast.success("Link copied to your clipboard");
      }
    } catch {
      // Dismissing the native share dialog is an expected user choice.
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/90 shadow-sm backdrop-blur hover:bg-background"
          aria-label={`More choices for ${title}`}
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={toggleSaved}
        >
          {saved ? <Check /> : <Bookmark />}
          {saved ? "Saved" : "Save for later"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={share}>
          <Share2 /> Share resource
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast.info("We’ll show you fewer resources like this.")}>
          <EyeOff /> Not interested
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
