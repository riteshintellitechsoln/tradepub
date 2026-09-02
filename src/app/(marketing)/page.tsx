import { Hero } from "@/components/home/hero";
import { SectionHeader } from "@/components/home/section-header";
import { CategoryScroller } from "@/components/home/category-scroller";
import { BookGrid } from "@/components/books/book-grid";
import { BookCard } from "@/components/books/book-card";
import { Reveal, RevealItem } from "@/components/motion/reveal";
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

  return (
    <>
      <Hero
        stats={heroStats}
        covers={trending.slice(0, 3).map((book) => ({
          slug: book.slug,
          coverImageUrl: book.coverImageUrl,
          title: book.title,
        }))}
      />

      {trending.length > 0 && (
        <section id="trending" className="border-y bg-white/60 py-12 sm:py-16">
          <div className="container">
            <Reveal>
              <SectionHeader eyebrow="Most downloaded" title="Trending Now" />
            </Reveal>
            <BookGrid>
              {trending.map((book, i) => (
                <RevealItem key={book.id} index={i}>
                  <BookCard
                    book={book}
                    badge={{ label: "Trending", variant: "default" }}
                  />
                </RevealItem>
              ))}
            </BookGrid>
          </div>
        </section>
      )}

      <section className="container py-12 sm:py-16">
        <Reveal>
          <SectionHeader
            eyebrow="Browse by topic"
            title="Popular Categories"
            viewAllHref="/category"
          />
          <CategoryScroller categories={categories} />
        </Reveal>
      </section>

      {featured.length > 0 && (
        <section id="featured" className="border-y bg-white/60 py-12 sm:py-16">
          <div className="container">
            <Reveal>
              <SectionHeader
                eyebrow="Editor's picks"
                title="Featured Resources"
                description="Hand-picked for relevance and depth."
              />
            </Reveal>
            <BookGrid>
              {featured.map((book, i) => (
                <RevealItem key={book.id} index={i}>
                  <BookCard book={book} badge={{ label: "Featured" }} />
                </RevealItem>
              ))}
            </BookGrid>
          </div>
        </section>
      )}

      <section id="latest" className="container py-12 sm:py-16">
        <Reveal>
          <SectionHeader eyebrow="Fresh off the press" title="Latest Resources" viewAllHref="/category" />
        </Reveal>
        <BookGrid>
          {latest.map((book, i) => (
            <RevealItem key={book.id} index={i}>
              <BookCard book={book} />
            </RevealItem>
          ))}
        </BookGrid>
      </section>
    </>
  );
}