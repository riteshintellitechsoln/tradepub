import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { getActiveCategories } from "@/actions/categories";

// Wraps every public-facing page: /, /category, /category/[slug], /book/[slug],
// /search, /my-library, /download, /thank-you
//
// Categories are fetched ONCE here (Server Component, direct Prisma read —
// see actions/categories.ts) and passed to both the Navbar (Topics dropdown
// + mobile Sheet) and the Footer (Browse column). No client waterfall, no
// duplicate queries.
export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getActiveCategories();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar categories={categories} />
      <div className="flex flex-1">
        <DesktopSidebar categories={categories} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <div className="lg:pl-60"><Footer categories={categories} /></div>
    </div>
  );
}
