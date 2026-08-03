import Link from "next/link";
import { Home, Rss } from "lucide-react";
import type { NavCategory } from "@/actions/categories";

export function DesktopSidebar({ categories }: { categories: NavCategory[] }) {
  const technology = categories.slice(0, 12);
  const business = categories.slice(12);

  return (
    <aside className="hidden w-60 shrink-0 border-r border-[#cbd5df] bg-white lg:block">
      <div className="sticky top-[110px] max-h-[calc(100vh-110px)] overflow-y-auto px-4 py-4 text-[13px] leading-[1.25] text-[#06396d]">
        <Link href="/" className="flex items-center gap-2 font-bold hover:underline">
          <Home className="h-5 w-5 fill-[#08a7aa] text-[#08a7aa]" /> Home
        </Link>
        <nav className="mt-3" aria-label="Resource topics">
          {technology.length > 0 && <>
            <Link href={`/category/${technology[0].slug}`} className="block font-medium hover:underline">{technology[0].name}</Link>
            <div className="mt-1 space-y-0.5 pl-4">
              {technology.slice(1).map((category) => <Link key={category.id} href={`/category/${category.slug}`} className="block hover:text-[#00a6ad] hover:underline">{category.name}</Link>)}
            </div>
          </>}
          <div className="my-4 border-t border-[#153f70]" />
          <div className="space-y-0.5">
            {business.map((category) => <Link key={category.id} href={`/category/${category.slug}`} className="block hover:text-[#00a6ad] hover:underline">{category.name}</Link>)}
          </div>
          <Link href="/category" className="mt-1 block font-medium hover:underline">View All Topics &gt;</Link>
        </nav>
        <div className="my-4 border-t border-[#153f70]" />
        <nav className="space-y-1" aria-label="Account links">
          <a href="#rss" className="flex items-center gap-1 hover:underline"><Rss className="h-3.5 w-3.5" /> Get RSS Updates</a>
          <Link href="/my-library" className="block hover:underline">My Library</Link>
          <Link href="/login" className="block hover:underline">Sign In</Link>
        </nav>
      </div>
    </aside>
  );
}
