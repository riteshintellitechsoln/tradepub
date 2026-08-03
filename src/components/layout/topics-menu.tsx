"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavCategory } from "@/actions/categories";

// "Topics" is a quick-access dropdown of every category (this component).
// "Categories" (rendered next to it in the Navbar) is a plain link to
// /category, the full browsable grid with filters/search/pagination
// (Module 10). Two different jobs: jump straight to a topic vs. browse
// everything — kept as two separate nav items rather than one, matching
// how TradePub itself splits "Browse by Topic" from a full category index.
export function TopicsMenu({ categories }: { categories: NavCategory[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1">
          Topics
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="grid w-[560px] grid-cols-3 gap-1 p-3">
        {categories.map((category) => (
          <DropdownMenuItem key={category.id} asChild>
            <Link
              href={`/category/${category.slug}`}
              className="cursor-pointer rounded-md px-2 py-1.5 text-sm"
            >
              {category.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
