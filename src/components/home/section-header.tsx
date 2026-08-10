// import Link from "next/link";

// // Consistent section header for every Home page block (and reusable
// // wherever else a "eyebrow + title + optional view-all link" pattern shows
// // up — Category pages, Admin dashboard widgets, etc).
// export function SectionHeader({
//   eyebrow,
//   title,
//   description,
//   viewAllHref,
// }: {
//   eyebrow?: string;
//   title: string;
//   description?: string;
//   viewAllHref?: string;
// }) {
//   return (
//     <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
//       <div>
//         {eyebrow && (
//           <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">
//             {eyebrow}
//           </p>
//         )}
//         <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
//         {description && (
//           <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
//         )}
//       </div>
//       {viewAllHref && (
//         <Link
//           href={viewAllHref}
//           className="whitespace-nowrap text-sm font-medium text-primary hover:underline"
//         >
//           View all →
//         </Link>
//       )}
//     </div>
//   );
// }


import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Consistent section header for every Home page block and reusable
// wherever an "eyebrow + title + optional view-all link" pattern appears.
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
    <div className="group/header relative mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      {/* Left Content */}
      <div className="relative">
        {/* Eyebrow */}
        {eyebrow && (
          <div className="relative mb-1 inline-flex items-center">
            {/* Eyebrow glow */}
            <span className="pointer-events-none absolute -inset-2 rounded-full bg-primary/0 blur-xl transition-all duration-500 group-hover/header:bg-primary/10" />

            <p className="relative text-xs font-semibold uppercase tracking-[0.15em] text-seal transition-all duration-300 group-hover/header:tracking-[0.18em]">
              {eyebrow}
            </p>
          </div>
        )}

        {/* Title */}
        <div className="relative">
          {/* Title ambient glow */}
          <div className="pointer-events-none absolute -left-3 top-1/2 h-10 w-24 -translate-y-1/2 rounded-full bg-primary/0 blur-2xl transition-all duration-500 group-hover/header:bg-primary/10" />

          <h2 className="relative mt-1 font-display text-2xl font-bold tracking-tight transition-all duration-300 sm:text-3xl">
            {title}
          </h2>

          {/* Animated underline */}
          <div className="mt-2 h-[2px] w-14 overflow-hidden rounded-full bg-primary/20">
            <div className="h-full w-0 rounded-full bg-primary transition-all duration-500 group-hover/header:w-full" />
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground transition-colors duration-300 group-hover/header:text-foreground/75">
            {description}
          </p>
        )}
      </div>

      {/* View All */}
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group/view relative inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
        >
          <span>View all</span>

          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/view:translate-x-1" />

          {/* Button glow */}
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/0 blur-xl transition-all duration-300 group-hover/view:bg-primary/15" />
        </Link>
      )}
    </div>
  );
}
