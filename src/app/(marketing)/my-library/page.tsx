import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getLibraryByEmail } from "@/actions/library";
import { LibraryLookupForm } from "@/components/library/library-lookup-form";
import { LibraryResendButton } from "@/components/library/library-resend-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "My Library" };

interface MyLibraryPageProps {
  searchParams: Promise<{ email?: string }>;
}

// A signed-in User (Module 5) skips the lookup form entirely — their
// session email is used directly. Everyone else (the overwhelming
// majority, since downloading never requires an account) looks themselves
// up by email, the same way TradePub's real "My Library" works.
export default async function MyLibraryPage({ searchParams }: MyLibraryPageProps) {
  const session = await auth();
  const sp = await searchParams;
  const email = session?.user?.email ?? sp.email;

  if (!email) {
    return (
      <div className="container flex min-h-[50vh] max-w-md flex-col items-center justify-center py-20 text-center">
        <h1 className="font-display text-2xl font-bold">My Library</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email you used to download resources to see your history — no
          account needed.
        </p>
        <LibraryLookupForm className="mt-6 w-full" />
      </div>
    );
  }

  const result = await getLibraryByEmail(email);

  if (!result.success) {
    return (
      <div className="container max-w-md py-20 text-center">
        <p className="text-sm font-medium text-destructive">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-16">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">My Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Showing downloads for <span className="font-medium text-foreground">{email}</span>
          {!session?.user && (
            <>
              {" "}
              ·{" "}
              <Link href="/my-library" className="underline">
                Look up a different email
              </Link>
            </>
          )}
        </p>
      </div>

      {result.downloads.length === 0 ? (
        <EmptyState
          title="No downloads yet for this email"
          description="Browse the catalog and download something — it'll show up here."
        />
      ) : (
        <div className="space-y-4">
          {result.downloads.map((download) => (
            <div key={download.id} className="flex items-center gap-4 rounded-lg border p-4">
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded border">
                <Image
                  src={download.book.coverImageUrl}
                  alt={download.book.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <Link href={`/book/${download.book.slug}`} className="font-medium hover:underline">
                  {download.book.title}
                </Link>
                <p className="text-xs text-muted-foreground">{download.book.company.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Requested {format(download.createdAt, "MMM d, yyyy")}
                </p>
              </div>

              <Badge
                variant={
                  download.status === "FAILED"
                    ? "destructive"
                    : download.status === "DOWNLOADED" || download.status === "EMAIL_SENT"
                      ? "default"
                      : "secondary"
                }
              >
                {download.status}
              </Badge>

              <LibraryResendButton downloadId={download.id} email={email} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
