"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// A plain, uncontrolled-feeling search box that just routes to /search?q=...
// on submit. Module 11 (Books) owns what /search actually does with that
// query string (full-text match, filters, pagination); this component's
// only job is capturing intent and getting the visitor there.
//
// Deliberately does NOT read the current ?q= via useSearchParams — that
// hook requires a Suspense boundary wherever it's used, and this component
// is rendered inside the Navbar on every single page. `defaultValue` lets
// the /search page itself pre-fill this input if it wants to, without
// forcing every route to pay for a Suspense boundary.
export function SearchBar({
  className,
  defaultValue = "",
}: {
  className?: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search ebooks, whitepapers, reports..."
          aria-label="Search ebooks"
          className="pl-9"
        />
      </div>
    </form>
  );
}
