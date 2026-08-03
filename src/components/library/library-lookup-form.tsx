"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Plain email input that navigates to /my-library?email=... on submit —
// same URL-is-the-state pattern as every filterable page since Module 10,
// which is what lets someone bookmark or share their own library link (to
// their own email, which is theirs to share or not).
export function LibraryLookupForm({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    router.push(`/my-library?email=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Your email"
        required
      />
      <Button type="submit">View</Button>
    </form>
  );
}
