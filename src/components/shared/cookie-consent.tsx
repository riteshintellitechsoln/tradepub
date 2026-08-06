 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_NAME = "tradehub_cookie_consent";
const COOKIE_MAX_AGE_DAYS = 365;

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] ?? null : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookie(COOKIE_NAME)) {
      setVisible(true);
    }
  }, []);

  function respond(choice: "accepted" | "rejected") {
    setCookie(COOKIE_NAME, choice, COOKIE_MAX_AGE_DAYS);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border bg-background shadow-2xl">
        <div className="h-1 bg-seal" />

        <div className="p-6">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-seal" />
            <h2 id="cookie-consent-title" className="font-display text-lg font-bold">
              We use cookies
            </h2>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            TradeHub uses a small, essential cookie to remember this choice, plus
            functional cookies that keep you signed in and remember your theme
            preference. We don&apos;t use cookies to sell your data.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={() => respond("accepted")}>
              Accept all
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => respond("rejected")}
            >
              Reject non-essential
            </Button>
          </div>

          <Link
            href="/privacy"
            className="mt-4 inline-block text-xs text-muted-foreground underline hover:text-foreground"
          >
            Read our Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}