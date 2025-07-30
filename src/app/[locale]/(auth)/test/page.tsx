import * as React from "react";
import Head from "next/head";

interface EmailChangeVerificationEmailProps {
  userName: string;
  newEmail: string;
  verificationUrl: string;
  locale: string;
}

const translations = {
  en: {
    preview: "Verify your new email address",
    greeting: "Hello",
    title: "Verify Your New Email Address",
    message1: "You have requested to change your email address to:",
    message2:
      "To complete this change, please click the button below to verify your new email address:",
    buttonText: "Verify New Email",
    message3: "This verification link will expire in 24 hours.",
    message4:
      "If you didn't request this change, please ignore this email or contact our support team.",
    alternativeText:
      "If the button doesn't work, you can copy and paste this link into your browser:",
    footer: "Best regards,\nThe NextintelBetterAuth Team",
  },
  fr: {
    preview: "Vérifiez votre nouvelle adresse e-mail",
    greeting: "Bonjour",
    title: "Vérifiez Votre Nouvelle Adresse E-mail",
    message1: "Vous avez demandé à changer votre adresse e-mail vers :",
    message2:
      "Pour finaliser ce changement, veuillez cliquer sur le bouton ci-dessous pour vérifier votre nouvelle adresse e-mail :",
    buttonText: "Vérifier la Nouvelle Adresse",
    message3: "Ce lien de vérification expirera dans 24 heures.",
    message4:
      "Si vous n'avez pas demandé ce changement, veuillez ignorer cet e-mail ou contacter notre équipe de support.",
    alternativeText:
      "Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :",
    footer: "Cordialement,\nL'équipe NextintelBetterAuth",
  },
};

export const EmailChangeVerificationEmail = ({
  userName,
  newEmail,
  verificationUrl,
  locale = "en",
}: EmailChangeVerificationEmailProps) => {
  const t =
    translations[locale as keyof typeof translations] || translations.en;

  return (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{t.preview}</title>
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dvc22eldv/image/upload/v1753544352/logo_zq36nx.png"
              alt="NextintelBetterAuth Logo"
              style={{
                height: "40px",
                width: "auto",
                display: "block",
                margin: "0 auto 8px auto",
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
                marginBottom: "16px",
              }}
            >
              {t.message1}
            </p>

            <div
              style={{
                backgroundColor: "#f3f4f6",
                borderRadius: "8px",
                padding: "16px",
                margin: "16px 0",
                textAlign: "center" as const,
              }}
            >
              <p
                style={{
                  color: "#1f2937",
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "0",
                }}
              >
                {newEmail}
              </p>
            </div>

            <p
              style={{
                fontSize: "16px",
                marginBottom: "16px",
              }}
            >
              {t.message2}
            </p>

            <div
              style={{
                textAlign: "center" as const,
                margin: "32px 0",
              }}
            >
              <a
                href={verificationUrl}
                style={{
                  backgroundColor: "#3b82f6",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  textAlign: "center" as const,
                  display: "inline-block",
                  padding: "12px 24px",
                }}
              >
                {t.buttonText}
              </a>
            </div>

            <p
              style={{
                fontSize: "16px",
                marginBottom: "16px",
              }}
            >
              {t.message3}
            </p>

            <p
              style={{
                fontSize: "16px",
                marginBottom: "16px",
              }}
            >
              {t.message4}
            </p>

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
                color: "#6b7280",
                fontSize: "14px",
                lineHeight: "24px",
                margin: "32px 0 0",
                textAlign: "center" as const,
                whiteSpace: "pre-line" as const,
              }}
            >
              {t.footer}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default EmailChangeVerificationEmail;
