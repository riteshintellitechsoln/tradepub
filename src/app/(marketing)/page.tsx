import { Hero } from "@/components/home/hero";
import { SectionHeader } from "@/components/home/section-header";
import { CategoryScroller } from "@/components/home/category-scroller";
import { BookGrid } from "@/components/books/book-grid";
import { BookCard } from "@/components/books/book-card";
import { getFeaturedBooks, getLatestBooks, getTrendingBooks } from "@/actions/books";
import { getCategoriesWithBookCounts } from "@/actions/categories";
import { getHomeStats } from "@/actions/stats";

export default async function HomePage() {
  const [featured, latest, trending, categories, stats] = await Promise.all([
    getFeaturedBooks(4),
    getLatestBooks(8),
    getTrendingBooks(4),
    getCategoriesWithBookCounts(6),
    getHomeStats(),
  ]);

  const heroStats = [
    { label: "Categories", value: `${stats.totalCategories}+` },
    { label: "Resources", value: `${stats.totalBooks}+` },
    { label: "Publishers", value: `${stats.totalCompanies}+` },
  ];

  // Falls back to latest books' covers if nothing is flagged as featured yet
  // (e.g. a fresh install before an Admin has curated anything).
  const heroCovers = (featured.length ? featured : latest)
    .slice(0, 3)
    .map((book) => book.coverImageUrl);

  return (
    <>
      <Hero stats={heroStats} coverImages={heroCovers} />

      <section className="container py-10">
        <SectionHeader
          eyebrow="Browse by topic"
          title="Popular Categories"
          viewAllHref="/category"
        />
        <CategoryScroller categories={categories} />
      </section>

      {featured.length > 0 && (
        <section id="featured" className="border-t bg-muted/20 py-10">
          <div className="container">
            <SectionHeader
              eyebrow="Editor's picks"
              title="Featured Resources"
              description="Hand-picked for relevance and depth."
            />
            <BookGrid>
              {featured.map((book) => (
                <BookCard key={book.id} book={book} badge={{ label: "Featured" }} />
              ))}
            </BookGrid>
          </div>
        </section>
      )}

      <section id="latest" className="container py-10">
        <SectionHeader eyebrow="Fresh off the press" title="Latest Resources" viewAllHref="/category" />
        <BookGrid>
          {latest.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </BookGrid>
      </section>

      {trending.length > 0 && (
        <section id="trending" className="border-t bg-muted/20 py-10">
          <div className="container">
            <SectionHeader eyebrow="Most downloaded" title="Trending Now" />
            <BookGrid>
              {trending.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  badge={{ label: "Trending", variant: "default" }}
                />
              ))}
            </BookGrid>
          </div>
        </section>
      )}
    </>
  );
}
