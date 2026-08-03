import Link from "next/link";
import { BookOpen, Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import { SearchBar } from "@/components/layout/search-bar";
import { UserNav } from "@/components/layout/user-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { NavCategory } from "@/actions/categories";

export function Navbar({ categories }: { categories: NavCategory[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#153f70] bg-white text-[#06396d]">
      <div className="flex h-[73px] items-center gap-4 border-b border-[#153f70] px-4 sm:px-5">
        <MobileNav categories={categories} />
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#102f55] text-white"><BookOpen className="h-7 w-7" /></span>
          <span className="hidden leading-none sm:block"><span className="block text-[11px]">Brought to you by</span><span className="font-display text-2xl font-bold tracking-tight">TradeHub</span></span>
        </Link>
        <div className="hidden w-full max-w-xs md:block"><SearchBar /></div>
        <div className="ml-auto hidden items-center gap-3 md:flex" aria-label="Social links">
          <a href="#facebook" aria-label="Facebook"><Facebook className="h-5 w-5 fill-current" /></a><a href="#twitter" aria-label="Twitter"><Twitter className="h-5 w-5 fill-current" /></a><a href="#linkedin" aria-label="LinkedIn"><Linkedin className="h-5 w-5 fill-current" /></a><a href="mailto:hello@tradehub.example" aria-label="Email"><Mail className="h-6 w-6" /></a>
        </div>
        <div className="ml-auto md:ml-0"><UserNav /></div>
      </div>
      <nav className="hidden h-[36px] items-center justify-around text-sm font-medium uppercase md:flex" aria-label="Primary navigation">
        <Link href="/#featured" className="hover:text-[#00a6ad]">Featured eBooks</Link><Link href="/#trending" className="hover:text-[#00a6ad]">Trending Resources</Link><Link href="/#latest" className="hover:text-[#00a6ad]">New Resources</Link><Link href="/my-library" className="hover:text-[#00a6ad]">My Library</Link><Link href="/privacy" className="hover:text-[#00a6ad]">About</Link>
      </nav>
    </header>
  );
}
