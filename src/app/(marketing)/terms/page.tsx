import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of TradeHub.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="font-display text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2026</p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-foreground dark:prose-invert">
        <section>
          <h2 className="text-lg font-semibold">1. Use of the service</h2>
          <p className="mt-2 text-muted-foreground">
            TradeHub provides free access to ebooks, whitepapers, and reports
            in exchange for business contact information. Resources are
            provided for your own professional use; redistribution or resale
            without the publisher's permission is not allowed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Accurate information</h2>
          <p className="mt-2 text-muted-foreground">
            You agree to provide accurate, current information on any
            download form, including a valid business email address that you
            control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Download links</h2>
          <p className="mt-2 text-muted-foreground">
            Each download link is personal to you and time-limited. Sharing,
            scripting, or automating access to download links is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Changes</h2>
          <p className="mt-2 text-muted-foreground">
            We may update these terms from time to time. Continued use of
            TradeHub after a change constitutes acceptance of the revised
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Contact</h2>
          <p className="mt-2 text-muted-foreground">
            Questions about these terms can be sent to{" "}
            <a href="mailto:legal@tradehub.example" className="text-primary hover:underline">
              legal@tradehub.example
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
