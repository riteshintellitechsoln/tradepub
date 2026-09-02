import type { Metadata } from "next";
import { PublishForm } from "@/components/publish/publish-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Publish with Us",
  description: "Submit your ebook, whitepaper, or report for review on TradeHub.",
};

export default function PublishPage() {
  return (
    <div className="container max-w-2xl py-16">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-seal">For Publishers</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Publish with TradeHub</h1>
        <p className="mt-3 text-muted-foreground">
          Get your ebook, whitepaper, or report in front of thousands of verified
          business buyers. Tell us about it below.
        </p>
      </div>

      <Card className="border-t-4 border-t-seal shadow-lg">
        <CardHeader>
          <CardTitle>Submit your resource</CardTitle>
          <CardDescription>We&apos;ll review it and follow up by email.</CardDescription>
        </CardHeader>
        <CardContent>
          <PublishForm />
        </CardContent>
      </Card>
    </div>
  );
}