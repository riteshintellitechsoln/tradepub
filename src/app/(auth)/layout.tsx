// Wraps /login (and any future auth pages) in a centered, chrome-free layout —
// no navbar/footer, since this is a focused task screen for admins/users.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      {children}
    </div>
  );
}
