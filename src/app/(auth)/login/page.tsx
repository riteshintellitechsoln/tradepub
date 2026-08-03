import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";
import { LoginForm } from "@/components/forms/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Server Component: checks the session before rendering anything, so an
// already-signed-in Admin never sees the login form — they're bounced
// straight to /admin, and a signed-in User to /my-library.
export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect(isAdminRole(session.user.role) ? "/admin" : "/my-library");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in to TradeHub</CardTitle>
        <CardDescription>
          Admins and returning members sign in here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* useSearchParams (for callbackUrl) requires a Suspense boundary */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
