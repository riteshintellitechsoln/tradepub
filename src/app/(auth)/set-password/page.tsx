import Link from "next/link";
import { BookOpen, ShieldAlert } from "lucide-react";
import { SetPasswordForm } from "@/components/forms/set-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function SetPasswordPage({ searchParams }: SetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <div className="w-full max-w-sm">
      <Link
        href="/"
        className="mb-6 flex items-center justify-center gap-2 font-display text-xl font-bold"
      >
        <BookOpen className="h-6 w-6 text-primary" />
        TradeHub
      </Link>

      <Card className="border-t-4 border-t-seal shadow-lg">
        <CardHeader>
          <CardTitle>Set your password</CardTitle>
          <CardDescription>Choose a password to finish creating your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <div className="flex flex-col items-center py-6 text-center">
              <ShieldAlert className="mb-3 h-8 w-8 text-destructive" />
              <p className="text-sm text-muted-foreground">
                This link is missing its token. Please use the link from your email, or{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  sign up again
                </Link>
                .
              </p>
            </div>
          ) : (
            <SetPasswordForm token={token} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}