//  import { redirect } from "next/navigation";
// import { Suspense } from "react";
// import { LogIn } from "lucide-react";
// import { auth } from "@/lib/auth";
// import { isAdminRole } from "@/lib/rbac";
// import { LoginForm } from "@/components/forms/login-form";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// interface LoginPageProps {
//   searchParams: Promise<{ callbackUrl?: string }>;
// }

// export default async function LoginPage({ searchParams }: LoginPageProps) {
//   const session = await auth();
//   if (session?.user) {
//     redirect(isAdminRole(session.user.role) ? "/admin" : "/my-library");
//   }

//   const sp = await searchParams;
//   const cameFromProtectedPage = !!sp.callbackUrl;

//   return (
//     <Card className="w-full max-w-sm">
//       <CardHeader>
//         <CardTitle>Sign in to TradeHub</CardTitle>
//         <CardDescription>
//           Admins and returning members sign in here.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {cameFromProtectedPage && (
//           <div className="mb-4 flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
//             <LogIn className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
//             <span>Please sign in to continue — your session may have expired.</span>
//           </div>
//         )}
//         <Suspense>
//           <LoginForm />
//         </Suspense>
//       </CardContent>
//     </Card>
//   );
// }



import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, LogIn } from "lucide-react";
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

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect(isAdminRole(session.user.role) ? "/admin" : "/my-library");
  }

  const sp = await searchParams;
  const cameFromProtectedPage = !!sp.callbackUrl;

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
          <CardTitle>Sign in to TradeHub</CardTitle>
          <CardDescription>
            Admins and returning members sign in here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cameFromProtectedPage && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
              <LogIn className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Please sign in to continue — your session may have expired.</span>
            </div>
          )}
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}