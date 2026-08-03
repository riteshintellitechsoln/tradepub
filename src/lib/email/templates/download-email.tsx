import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface DownloadEmailProps {
  recipientName: string;
  bookTitle: string;
  coverImageUrl: string;
  publisherName: string;
  downloadUrl: string;
  expiresInMinutes: number;
}

// Colors are hardcoded hex, not Tailwind classes or CSS variables — email
// clients strip <style> blocks and don't resolve custom properties, so
// every color here has to be an inline, literal value. Matches the app's
// navy + brass/gold brand identity from Module 9 as closely as an inbox
// allows.
const brand = {
  navy: "#1a2b4d",
  gold: "#b7862c",
  muted: "#64748b",
  border: "#e2e8f0",
  ink: "#0f172a",
};

// The one real transactional email in the app right now. Sent by
// sendDownloadEmail() (this module) from inside initiateDownload()
// (Module 13/14) once a lead has been validated and saved.
export function DownloadEmail({
  recipientName,
  bookTitle,
  coverImageUrl,
  publisherName,
  downloadUrl,
  expiresInMinutes,
}: DownloadEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your download — {bookTitle} — is ready</Preview>
      <Body
        style={{
          backgroundColor: "#f8fafc",
          fontFamily: "Helvetica, Arial, sans-serif",
          margin: 0,
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            maxWidth: 480,
            margin: "0 auto",
            padding: 32,
            border: `1px solid ${brand.border}`,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: brand.gold,
              margin: "0 0 8px",
            }}
          >
            TradeHub
          </Text>

          <Heading style={{ fontSize: 20, color: brand.navy, margin: "0 0 16px" }}>
            Hi {recipientName}, your download is ready
          </Heading>

          <Img
            src={coverImageUrl}
            alt={bookTitle}
            width="120"
            style={{
              borderRadius: 8,
              border: `1px solid ${brand.border}`,
              marginBottom: 16,
            }}
          />

          <Text style={{ fontSize: 15, color: brand.ink, fontWeight: 600, margin: "0 0 4px" }}>
            {bookTitle}
          </Text>
          <Text style={{ fontSize: 13, color: brand.muted, margin: "0 0 24px" }}>
            Published by {publisherName}
          </Text>

          <Button
            href={downloadUrl}
            style={{
              backgroundColor: brand.navy,
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: 8,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Download now
          </Button>

          <Text style={{ fontSize: 12, color: brand.muted, marginTop: 16 }}>
            This link expires in {expiresInMinutes} minutes and can only be used once. If
            it&apos;s expired, just request the download again from TradeHub.
          </Text>

          <Hr style={{ borderColor: brand.border, margin: "24px 0" }} />

          <Text style={{ fontSize: 11, color: brand.muted, margin: 0 }}>
            You&apos;re receiving this because you requested this resource on TradeHub with
            your business email.{" "}
            <Link href="https://tradehub.example/privacy" style={{ color: brand.muted }}>
              Privacy Policy
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default DownloadEmail;
