import Link from "next/link";

// Consistent section header for every Home page block (and reusable
// wherever else a "eyebrow + title + optional view-all link" pattern shows
// up — Category pages, Admin dashboard widgets, etc).
export function SectionHeader({
  eyebrow,
  title,
  description,
  viewAllHref,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  viewAllHref?: string;
}) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="whitespace-nowrap text-sm font-medium text-primary hover:underline"
        >
          View all →
        </Link>
      )}
    </div>
  );
}
