import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";
import { SignupForm } from "@/components/forms/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) {
    redirect(isAdminRole(session.user.role) ? "/admin" : "/my-library");
  }

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
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Sign in with a password from now on — no need to look up your
            downloads by email every time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}