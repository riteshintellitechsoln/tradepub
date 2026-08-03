import { requireAdmin } from "@/lib/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Deliberately informational rather than editable — the spec's 11 tables
// don't include a Settings model, so there's nowhere to persist arbitrary
// admin-editable config yet. Everything here comes from environment
// variables (see .env.example), which is the right call for values that
// change rarely and matter for security (the email blocklist, sender
// identity). A proper Settings table could be added later if that changes.
export default async function AdminSettingsPage() {
  const session = await requireAdmin();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your account</CardTitle>
          <CardDescription>
            Signed in as {session.user.email} ({session.user.role})
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site configuration</CardTitle>
          <CardDescription>
            The company-email blocklist, file storage, and email sender identity are all
            configured via environment variables today, not a database table — see the
            note above on why.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Email sender: <code>{process.env.EMAIL_FROM ?? "not set"}</code>
          </p>
          <p>
            Download link expiry:{" "}
            <code>{process.env.DOWNLOAD_TOKEN_TTL_MINUTES ?? "30"} minutes</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
