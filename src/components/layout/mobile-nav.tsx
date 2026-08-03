"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SearchBar } from "@/components/layout/search-bar";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { isAdminRole } from "@/lib/rbac";
import type { NavCategory } from "@/actions/categories";

export function MobileNav({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = isAdminRole(session?.user?.role);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[85vw] flex-col gap-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">TradeHub</SheetTitle>
        </SheetHeader>

        <SearchBar />

        <nav className="flex flex-col gap-1">
          <Link
            href="/category"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
          >
            All Categories
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
            >
              Admin Dashboard
            </Link>
          )}
          <Link
            href="/my-library"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
          >
            My Library
          </Link>
          {!session?.user && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
            >
              Sign In
            </Link>
          )}
        </nav>

        <Separator />

        <div>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Topics
          </p>
          <nav className="flex flex-col gap-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm hover:bg-accent"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto flex items-center justify-between border-t pt-4">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
