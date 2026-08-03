"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck } from "lucide-react";

import { companyEmailSchema } from "@/lib/validations/email";
import type { BookPreview } from "@/actions/books";
import { LeadForm } from "@/components/forms/lead-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Step 1's schema stays here — it's the "Company Email Check" gate
// (Module 13), a separate concern from the Lead Form itself (Module 14),
// which is why it isn't in lib/validations/lead.ts alongside leadSchema.
const emailStepSchema = z.object({ email: companyEmailSchema });
type EmailStepInput = z.infer<typeof emailStepSchema>;

// Orchestrates the two-step flow: Company Email Check (inline, Module 13)
// → Lead Form (now its own component, Module 14). This component only
// owns the step state and the email gate; LeadForm owns everything from
// "Full name" onward.
export function DownloadWizard({ book }: { book: BookPreview }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");

  const emailForm = useForm<EmailStepInput>({
    resolver: zodResolver(emailStepSchema),
    defaultValues: { email: "" },
  });

  function onEmailSubmit(values: EmailStepInput) {
    setEmail(values.email);
    setStep(2);
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[200px_1fr]">
      <div className="mx-auto w-40 lg:w-full">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg border shadow-sm">
          <Image
            src={book.coverImageUrl}
            alt={book.title}
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {book.companyName}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{book.title}</h1>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <span className={step === 1 ? "font-semibold text-primary" : undefined}>
            1. Verify email
          </span>
          <span aria-hidden>→</span>
          <span className={step === 2 ? "font-semibold text-primary" : undefined}>
            2. Your details
          </span>
          
        </div>

        {step === 1 && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="mt-6 space-y-4"
              noValidate
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Business email required — no Gmail, Yahoo, Hotmail, Outlook.com, or iCloud.
              </p>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <div className="mt-6">
            <LeadForm
              email={email}
              bookSlug={book.slug}
              onSuccess={() => router.push(`/thank-you?book=${book.slug}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
