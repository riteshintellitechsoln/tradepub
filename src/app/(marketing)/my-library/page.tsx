// // import Image from "next/image";
// // import Link from "next/link";
// // import { format } from "date-fns";
// // import type { Metadata } from "next";
// // import { Mail, PackageCheck, PackageX, Clock } from "lucide-react";
// // import { auth } from "@/lib/auth";
// // import { getLibraryByEmail } from "@/actions/library";
// // import { LibraryLookupForm } from "@/components/library/library-lookup-form";
// // import { LibraryResendButton } from "@/components/library/library-resend-button";
// // import { EmptyState } from "@/components/shared/empty-state";
// // import { Badge } from "@/components/ui/badge";

// // export const metadata: Metadata = { title: "My Library" };

// // interface MyLibraryPageProps {
// //   searchParams: Promise<{ email?: string }>;
// // }

// // const STATUS_CONFIG = {
// //   EMAIL_SENT: { label: "Email Sent", variant: "default" as const, icon: Mail },
// //   DOWNLOADED: { label: "Downloaded", variant: "default" as const, icon: PackageCheck },
// //   PENDING: { label: "Pending", variant: "secondary" as const, icon: Clock },
// //   FAILED: { label: "Failed", variant: "destructive" as const, icon: PackageX },
// //   EXPIRED: { label: "Expired", variant: "outline" as const, icon: Clock },
// // };

// // export default async function MyLibraryPage({ searchParams }: MyLibraryPageProps) {
// //   const session = await auth();
// //   const sp = await searchParams;
// //   const email = session?.user?.email ?? sp.email;

// //   if (!email) {
// //     return (
// //       <div className="container flex min-h-[60vh] max-w-md flex-col items-center justify-center py-20 text-center">
// //         <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
// //           <Mail className="h-6 w-6 text-primary" />
// //         </div>
// //         <h1 className="font-display text-2xl font-bold">My Library</h1>
// //         <p className="mt-2 text-sm text-muted-foreground">
// //           Enter the email you used to download resources to see your history — no
// //           account needed.
// //         </p>
// //         <div className="mt-6 w-full rounded-xl border bg-card p-5 shadow-sm">
// //           <LibraryLookupForm className="w-full" />
// //         </div>
// //       </div>
// //     );
// //   }

// //   const result = await getLibraryByEmail(email);

// //   if (!result.success) {
// //     return (
// //       <div className="container max-w-md py-20 text-center">
// //         <p className="text-sm font-medium text-destructive">{result.error}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container max-w-3xl py-16">
// //       <div className="mb-8">
// //         <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">Your history</p>
// //         <h1 className="mt-1 font-display text-3xl font-bold">My Library</h1>
// //         <div className="my-4 h-px w-16 bg-seal" />
// //         <p className="text-sm text-muted-foreground">
// //           Showing downloads for <span className="font-medium text-foreground">{email}</span>
// //           {!session?.user && (
// //             <>
// //               {" "}
// //               ·{" "}
// //               <Link href="/my-library" className="underline hover:text-foreground">
// //                 Look up a different email
// //               </Link>
// //             </>
// //           )}
// //         </p>
// //       </div>

// //       {result.downloads.length === 0 ? (
// //         <EmptyState
// //           title="No downloads yet for this email"
// //           description="Browse the catalog and download something — it'll show up here."
// //         />
// //       ) : (
// //         <div className="space-y-4">
// //           {result.downloads.map((download) => {
// //             const statusConfig = STATUS_CONFIG[download.status];
// //             const StatusIcon = statusConfig.icon;

// //             return (
// //               <div
// //                 key={download.id}
// //                 className="group flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_20px_40px_-8px_rgba(22,35,78,0.15),0_8px_16px_-4px_rgba(22,35,78,0.1)] sm:flex-row sm:items-center"
// //               >
// //                 <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border shadow-sm">
// //                   <Image
// //                     src={download.book.coverImageUrl}
// //                     alt={download.book.title}
// //                     fill
// //                     sizes="64px"
// //                     className="object-cover transition-transform duration-300 group-hover:scale-105"
// //                   />
// //                 </div>

// //                 <div className="min-w-0 flex-1">
// //                   <Link
// //                     href={`/book/${download.book.slug}`}
// //                     className="font-display font-semibold leading-snug hover:underline"
// //                   >
// //                     {download.book.title}
// //                   </Link>
// //                   <p className="text-xs text-muted-foreground">{download.book.company.name}</p>
// //                   <p className="mt-1 text-xs text-muted-foreground">
// //                     Requested {format(download.createdAt, "MMM d, yyyy")}
// //                   </p>
// //                 </div>

// //                 <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
// //                   <Badge variant={statusConfig.variant} className="gap-1">
// //                     <StatusIcon className="h-3 w-3" />
// //                     {statusConfig.label}
// //                   </Badge>
// //                   <LibraryResendButton downloadId={download.id} email={email} />
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import Image from "next/image";
// import Link from "next/link";
// import { format } from "date-fns";
// import type { Metadata } from "next";
// import { Mail, Download } from "lucide-react";
// import { auth } from "@/lib/auth";
// import { getLibraryByEmail } from "@/actions/library";
// import { LibraryLookupForm } from "@/components/library/library-lookup-form";
// import { EmptyState } from "@/components/shared/empty-state";
// import { Button } from "@/components/ui/button";

// export const metadata: Metadata = { title: "My Library" };

// interface MyLibraryPageProps {
//   searchParams: Promise<{ email?: string }>;
// }

// export default async function MyLibraryPage({ searchParams }: MyLibraryPageProps) {
//   const session = await auth();
//   const sp = await searchParams;
//   const email = session?.user?.email ?? sp.email;

//   if (!email) {
//     return (
//       <div className="container flex min-h-[60vh] max-w-md flex-col items-center justify-center py-20 text-center">
//         <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
//           <Mail className="h-6 w-6 text-primary" />
//         </div>
//         <h1 className="font-display text-2xl font-bold">My Library</h1>
//         <p className="mt-2 text-sm text-muted-foreground">
//           Enter the email you used to download resources to see your history — no
//           account needed.
//         </p>
//         <div className="mt-6 w-full rounded-xl border bg-card p-5 shadow-sm">
//           <LibraryLookupForm className="w-full" />
//         </div>
//       </div>
//     );
//   }

//   const result = await getLibraryByEmail(email);

//   if (!result.success) {
//     return (
//       <div className="container max-w-md py-20 text-center">
//         <p className="text-sm font-medium text-destructive">{result.error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container max-w-4xl py-16">
//       <div className="mb-8">
//         <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">Your history</p>
//         <h1 className="mt-1 font-display text-3xl font-bold">My Library</h1>
//         <div className="my-4 h-px w-16 bg-seal" />
//         <p className="text-sm text-muted-foreground">
//           Showing downloads for <span className="font-medium text-foreground">{email}</span>
//           {!session?.user && (
//             <>
//               {" "}
//               ·{" "}
//               <Link href="/my-library" className="underline hover:text-foreground">
//                 Look up a different email
//               </Link>
//             </>
//           )}
//         </p>
//       </div>

//       {result.downloads.length === 0 ? (
//         <EmptyState
//           title="No downloads yet for this email"
//           description="Browse the catalog and download something — it'll show up here."
//         />
//       ) : (
//         <div className="space-y-4">
//           {result.downloads.map((download) => (
//                        <div
//               key={download.id}
//               className="group flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-seal/10 hover:shadow-[0_20px_40px_-8px_rgba(22,35,78,0.2),0_8px_16px_-4px_rgba(22,35,78,0.12)] sm:flex-row sm:items-center"
//             >
//               <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border shadow-sm">
//                 <Image
//                   src={download.book.coverImageUrl}
//                   alt={download.book.title}
//                   fill
//                   sizes="64px"
//                   className="object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <Link
//                   href={`/book/${download.book.slug}`}
//                   className="font-display font-semibold leading-snug hover:underline"
//                 >
//                   {download.book.title}
//                 </Link>
//                 <p className="text-xs text-muted-foreground">{download.book.company.name}</p>
//                 <p className="mt-1 text-xs text-muted-foreground">
//                   Requested {format(download.createdAt, "MMM d, yyyy")}
//                 </p>
//               </div>

//               {/* <Button
//                 asChild
//                 className="shrink-0 transition-transform duration-200 group-hover:scale-105"
//               >
//                 <Link href={`/download?book=${download.book.slug}`}>
//                   <Download className="h-4 w-4" />
//                   Get it again
//                 </Link>
//               </Button> */}

//                             <Button
//                 asChild
//                 className="shrink-0 bg-gradient-to-r from-primary to-seal text-primary-foreground transition-transform duration-200 hover:opacity-90 group-hover:scale-105"
//               >
//                 <Link href={`/download?book=${download.book.slug}`}>
//                   <Download className="h-4 w-4" />
//                   Get it again
//                 </Link>
//               </Button>
              
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



// import Image from "next/image";
// import Link from "next/link";
// import { format } from "date-fns";
// import type { Metadata } from "next";
// import { Mail, Download } from "lucide-react";
// import { auth } from "@/lib/auth";
// import { getLibraryByEmail } from "@/actions/library";
// import { getRecommendationsForSlugs } from "@/actions/books";
// import { LibraryLookupForm } from "@/components/library/library-lookup-form";
// import { EmptyState } from "@/components/shared/empty-state";
// import { Button } from "@/components/ui/button";
// import { BookCard } from "@/components/books/book-card";
// import { SectionHeader } from "@/components/home/section-header";

// export const metadata: Metadata = { title: "My Library" };

// interface MyLibraryPageProps {
//   searchParams: Promise<{ email?: string }>;
// }

// export default async function MyLibraryPage({ searchParams }: MyLibraryPageProps) {
//   const session = await auth();
//   const sp = await searchParams;
//   const email = session?.user?.email ?? sp.email;

//   if (!email) {
//     return (
//       <div className="container flex min-h-[60vh] max-w-md flex-col items-center justify-center py-20 text-center">
//         <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
//           <Mail className="h-6 w-6 text-primary" />
//         </div>
//         <h1 className="font-display text-2xl font-bold">My Library</h1>
//         <p className="mt-2 text-sm text-muted-foreground">
//           Enter the email you used to download resources to see your history — no
//           account needed.
//         </p>
//         <div className="mt-6 w-full rounded-xl border bg-card p-5 shadow-sm">
//           <LibraryLookupForm className="w-full" />
//         </div>
//       </div>
//     );
//   }

//   const result = await getLibraryByEmail(email);

//   if (!result.success) {
//     return (
//       <div className="container max-w-md py-20 text-center">
//         <p className="text-sm font-medium text-destructive">{result.error}</p>
//       </div>
//     );
//   }

//   if (!result.found) {
//     return (
//       <div className="container flex min-h-[60vh] max-w-md flex-col items-center justify-center py-20 text-center">
//         <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
//           <Mail className="h-6 w-6 text-destructive" />
//         </div>
//         <h1 className="font-display text-2xl font-bold">No account found</h1>
//         <p className="mt-2 text-sm text-muted-foreground">
//           An account has not been created for <span className="font-medium text-foreground">{email}</span>.
//           To create one, request a resource and verify your email address — your
//           library will start automatically after that.
//         </p>
//         <div className="mt-6 flex gap-3">
//           <Button asChild>
//             <Link href="/category">Browse resources</Link>
//           </Button>
//           <Button variant="outline" asChild>
//             <Link href="/my-library">Try a different email</Link>
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const recentSlugs = result.downloads.slice(0, 3).map((d) => d.book.slug);
//   const recommendations =
//     recentSlugs.length > 0 ? await getRecommendationsForSlugs(recentSlugs, 8) : [];

//   return (
//     <div className="container max-w-7xl py-16">
//       <div className="mb-8">
//         <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">Your history</p>
//         <h1 className="mt-1 font-display text-3xl font-bold">My Library</h1>
//         <div className="my-4 h-px w-16 bg-seal" />
//         <p className="text-sm text-muted-foreground">
//           Showing downloads for <span className="font-medium text-foreground">{email}</span>
//           {!session?.user && (
//             <>
//               {" "}
//               ·{" "}
//               <Link href="/my-library" className="underline hover:text-foreground">
//                 Look up a different email
//               </Link>
//             </>
//           )}
//         </p>
//       </div>

//       {result.downloads.length === 0 ? (
//         <EmptyState
//           title="No downloads yet for this email"
//           description="Browse the catalog and download something — it'll show up here."
//         />
//       ) : (
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//   {result.downloads.map((download) => (
//     <div
//       key={download.id}
//       className="group flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-seal/10 hover:shadow-[0_20px_40px_-8px_rgba(22,35,78,0.2),0_8px_16px_-4px_rgba(22,35,78,0.12)] sm:flex-row sm:items-center"
//     >
//       <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border shadow-sm">
//         <Image
//           src={download.book.coverImageUrl}
//           alt={download.book.title}
//           fill
//           sizes="64px"
//           className="object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>

//               <div className="min-w-0 flex-1">
//                 <Link
//                   href={`/book/${download.book.slug}`}
//                   className="font-display font-semibold leading-snug transition-colors duration-300 hover:underline group-hover:text-primary"
//                 >
//                   {download.book.title}
//                 </Link>
//                 <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
//                   {download.book.company.name}
//                 </p>
//                 <p className="mt-1 text-xs text-muted-foreground">
//                   Requested {format(download.createdAt, "MMM d, yyyy")}
//                 </p>
//               </div>

//               <Button
//                 asChild
//                 className="shrink-0 bg-gradient-to-r from-primary to-seal text-primary-foreground transition-transform duration-200 hover:opacity-90 group-hover:scale-105"
//               >
//                 <Link href={`/download?book=${download.book.slug}`}>
//                   <Download className="h-4 w-4" />
//                   Get it again
//                 </Link>
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}

//       {recommendations.length > 0 && (
//         <div className="mt-16 border-t pt-10">
//           <SectionHeader
//             eyebrow="Based on your downloads"
//             title="You might also like"
//             description="Picked from the same topics as what you've downloaded."
//           />
//           <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
//             {recommendations.map((book) => (
//               <div key={book.id} className="w-44 shrink-0 sm:w-48">
//                 <BookCard book={book} />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";
import { Mail, Download } from "lucide-react";

import { auth } from "@/lib/auth";
import { getLibraryByEmail } from "@/actions/library";
import { getRecommendationsForSlugs } from "@/actions/books";

import { LibraryLookupForm } from "@/components/library/library-lookup-form";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { RecommendationCarousel } from "@/components/library/recommendation-carousel";

export const metadata: Metadata = {
  title: "My Library",
};

interface MyLibraryPageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function MyLibraryPage({
  searchParams,
}: MyLibraryPageProps) {
  const session = await auth();
  const sp = await searchParams;

  const email = session?.user?.email ?? sp.email;

  // No email
  if (!email) {
    return (
      <div className="container flex min-h-[60vh] max-w-md flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>

        <h1 className="font-display text-2xl font-bold">
          My Library
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email you used to download resources to see your history —
          no account needed.
        </p>

        <div className="mt-6 w-full rounded-xl border bg-card p-5 shadow-sm">
          <LibraryLookupForm className="w-full" />
        </div>
      </div>
    );
  }

  // Get library
  const result = await getLibraryByEmail(email);

  // Error
  if (!result.success) {
    return (
      <div className="container max-w-md py-20 text-center">
        <p className="text-sm font-medium text-destructive">
          {result.error}
        </p>
      </div>
    );
  }

  // Account not found
  if (!result.found) {
    return (
      <div className="container flex min-h-[60vh] max-w-md flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <Mail className="h-6 w-6 text-destructive" />
        </div>

        <h1 className="font-display text-2xl font-bold">
          No account found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          An account has not been created for{" "}
          <span className="font-medium text-foreground">
            {email}
          </span>
          . To create one, request a resource and verify your email address —
          your library will start automatically after that.
        </p>

        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/category">
              Browse resources
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/my-library">
              Try a different email
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Recommendations
  const recentSlugs = result.downloads
    .slice(0, 3)
    .map((download) => download.book.slug);

  const recommendations =
    recentSlugs.length > 0
      ? await getRecommendationsForSlugs(recentSlugs, 8)
      : [];

  return (
    <div className="container max-w-7xl py-16">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">
          Your history
        </p>

        <h1 className="mt-1 font-display text-3xl font-bold">
          My Library
        </h1>

        <div className="my-4 h-px w-16 bg-seal" />

        <p className="text-sm text-muted-foreground">
          Showing downloads for{" "}
          <span className="font-medium text-foreground">
            {email}
          </span>

          {!session?.user && (
            <>
              {" "}
              ·{" "}
              <Link
                href="/my-library"
                className="underline hover:text-foreground"
              >
                Look up a different email
              </Link>
            </>
          )}
        </p>
      </div>

      {/* ================= DOWNLOADS ================= */}
      {result.downloads.length === 0 ? (
        <EmptyState
          title="No downloads yet for this email"
          description="Browse the catalog and download something — it'll show up here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {result.downloads.map((download) => (
            <div
              key={download.id}
              className="group flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-seal/10 hover:shadow-[0_20px_40px_-8px_rgba(22,35,78,0.2),0_8px_16px_-4px_rgba(22,35,78,0.12)] sm:flex-row sm:items-center"
            >
              {/* Book Cover */}
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border shadow-sm">
                <Image
                  src={download.book.coverImageUrl}
                  alt={download.book.title}
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Book Information */}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/book/${download.book.slug}`}
                  className="font-display font-semibold leading-snug transition-colors duration-300 hover:underline group-hover:text-primary"
                >
                  {download.book.title}
                </Link>

                <p className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {download.book.company.name}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Requested{" "}
                  {format(download.createdAt, "MMM d, yyyy")}
                </p>
              </div>

              {/* Get Again Button */}
              <Button
                asChild
                className="shrink-0 bg-gradient-to-r from-primary to-seal text-primary-foreground transition-transform duration-200 hover:opacity-90 group-hover:scale-105"
              >
                <Link
                  href={`/download?book=${download.book.slug}`}
                >
                  <Download className="h-4 w-4" />
                  Get it again
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ================= RECOMMENDATIONS ================= */}
      <RecommendationCarousel
        recommendations={recommendations}
      />
    </div>
  );
}