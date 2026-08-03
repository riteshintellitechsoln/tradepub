import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TradeHub collects, uses, and protects your information.",
};

// A real (if template-level) policy page — linked from the Footer and from
// the Lead Form's consent checkbox (Module 14). Replace the placeholder
// contact address and adapt the specifics (retention periods, sub-processors,
// etc.) to your actual data practices and applicable law before launch —
// this is a starting point, not legal advice.
export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: January 2026</p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-foreground dark:prose-invert">
        <section>
          <h2 className="text-lg font-semibold">1. What we collect</h2>
          <p className="mt-2 text-muted-foreground">
            When you download a resource, we collect the information you
            provide on the download form: your name, business email address,
            phone number, company, job title, location, department, industry,
            and company size. We also automatically record your IP address
            and browser user agent for fraud prevention and analytics.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. How we use it</h2>
          <p className="mt-2 text-muted-foreground">
            Your information is used to deliver the resource you requested,
            to maintain your download history ("My Library"), and — with
            your consent — is shared with the publisher of the resource you
            downloaded, who may contact you about related products and
            services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Business email requirement</h2>
          <p className="mt-2 text-muted-foreground">
            TradeHub only accepts business/company email addresses for
            downloads. Free consumer email providers (Gmail, Yahoo, Hotmail,
            Outlook.com, iCloud, and similar) are not accepted, since our
            publishers are specifically seeking to reach business
            professionals.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Your choices</h2>
          <p className="mt-2 text-muted-foreground">
            You may request access to, correction of, or deletion of your
            personal information at any time by contacting{" "}
            <a href="mailto:privacy@tradehub.example" className="text-primary hover:underline">
              privacy@tradehub.example
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Contact</h2>
          <p className="mt-2 text-muted-foreground">
            Questions about this policy can be sent to{" "}
            <a href="mailto:privacy@tradehub.example" className="text-primary hover:underline">
              privacy@tradehub.example
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
