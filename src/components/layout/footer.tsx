import Link from "next/link";
import { BookOpen, Linkedin, Twitter, Youtube } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { NavCategory } from "@/actions/categories";

// Server Component — reuses the same `categories` the (marketing) layout
// already fetched for the Navbar, so the Footer's "Browse" column costs
// nothing extra. Shows the first 6 (by the same `order` used in Topics);
// "View all" covers the rest via /category.
//
// /privacy and /terms are real pages built in this module (see
// src/app/(marketing)/privacy and /terms) — the spec's 20 modules don't
// have a dedicated slot for legal pages, but a form that captures personal
// data behind a consent checkbox needs somewhere for that checkbox to link
// to, so they're added here rather than left as dead links.
export function Footer({ categories }: { categories: NavCategory[] }) {
  const year = new Date().getFullYear();
  const featuredCategories = categories.slice(0, 6);

  return (
    <footer className="border-t bg-muted/30">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            {siteConfig.name}
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://twitter.com/tradehub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TradeHub on Twitter"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/company/tradehub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TradeHub on LinkedIn"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://youtube.com/@tradehub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TradeHub on YouTube"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Browse</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {featuredCategories.map((category) => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`} className="hover:text-foreground">
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/category" className="font-medium text-foreground hover:underline">
                View all categories →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
            </li>
            <li>
              <a href="mailto:hello@tradehub.example" className="hover:text-foreground">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">For Publishers</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Get your ebook, whitepaper, or report in front of thousands of
            verified business buyers.
          </p>
          <a
            href="mailto:publishers@tradehub.example"
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            Publish with us →
          </a>
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Downloads require a valid business email address.</p>
        </div>
      </div>
    </footer>
  );
}
