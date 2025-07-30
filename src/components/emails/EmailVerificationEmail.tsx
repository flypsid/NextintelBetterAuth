import * as React from "react";
import Head from "next/head";

interface EmailVerificationEmailProps {
  userName: string;
  verificationUrl: string;
  locale: "en" | "fr";
}

const translations = {
  en: {
    subject: "Verify your email address",
    title: "Verify your email address",
    greeting: "Hello",
    message:
      "Thank you for signing up for NextintelBetterAuth! Please verify your email address by clicking the button below:",
    buttonText: "Verify Email",
    alternativeText:
      "If the button doesn't work, you can copy and paste this link into your browser:",
    expiry: "This link will expire in 24 hours.",
    noRequest: "If you didn't create an account, please ignore this email.",
    footer: "Best regards,\nThe NextintelBetterAuth Team",
  },
  fr: {
    subject: "Vérifiez votre adresse email",
    title: "Vérifiez votre adresse email",
    greeting: "Bonjour",
    message:
      "Merci de vous être inscrit sur NextintelBetterAuth ! Veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :",
    buttonText: "Vérifier l'email",
    alternativeText:
      "Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :",
    expiry: "Ce lien expirera dans 24 heures.",
    noRequest: "Si vous n'avez pas créé de compte, veuillez ignorer cet email.",
    footer: "Cordialement,\nL'équipe NextintelBetterAuth",
  },
};

export function EmailVerificationEmail({
  userName,
  verificationUrl,
  locale,
}: EmailVerificationEmailProps) {
  const t = translations[locale];

  return (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t.subject}</title>
      </Head>
      <body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: "1.6",
          color: "#333333",
          backgroundColor: "#f8f9fa",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#1f2937",
              padding: "32px 24px",
              textAlign: "center" as const,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dvc22eldv/image/upload/v1753544352/logo_zq36nx.png"
              alt="NextintelBetterAuth Logo"
              style={{
                height: "40px",
                width: "auto",
                marginBottom: "8px",
              }}
            />
            <h1
              style={{
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              NextintelBetterAuth
            </h1>
          </div>

          {/* Content */}
          <div
            style={{
              padding: "32px 24px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "16px",
              }}
            >
              {t.title}
            </h2>

            <p
              style={{
                fontSize: "16px",
                marginBottom: "16px",
              }}
            >
              {t.greeting} {userName},
            </p>

            <p
              style={{
                fontSize: "16px",
                marginBottom: "24px",
              }}
            >
              {t.message}
            </p>

            {/* Verification Button */}
            <div
              style={{
                textAlign: "center" as const,
                marginBottom: "24px",
              }}
            >
              <a
                href={verificationUrl}
                style={{
                  display: "inline-block",
                  backgroundColor: "#10b981",
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                {t.buttonText}
              </a>
            </div>

            {/* Alternative link section */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "16px",
                margin: "24px 0",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#475569",
                }}
              >
                {t.alternativeText}
              </p>
              <a
                href={verificationUrl}
                style={{
                  color: "#3b82f6",
                  fontSize: "12px",
                  textDecoration: "none",
                  wordBreak: "break-all" as const,
                  fontFamily: "monospace",
                  backgroundColor: "#ffffff",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                  display: "block",
                }}
              >
                {verificationUrl}
              </a>
            </div>

            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "16px",
              }}
            >
              {t.expiry}
            </p>

            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "24px",
              }}
            >
              {t.noRequest}
            </p>

            <p
              style={{
                fontSize: "16px",
                whiteSpace: "pre-line" as const,
              }}
            >
              {t.footer}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px 24px",
              textAlign: "center" as const,
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                margin: 0,
              }}
            >
              © 2025 NextintelBetterAuth. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

export default EmailVerificationEmail;
