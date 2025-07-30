import * as React from "react";
import Head from "next/head";

interface EmailChangeNotificationEmailProps {
  userName: string;
  oldEmail: string;
  newEmail: string;
  supportUrl: string;
  locale: string;
}

const translations = {
  en: {
    preview: "Your email address has been changed",
    greeting: "Hello",
    title: "Email Address Change Notification",
    message1:
      "This is to inform you that your email address has been successfully changed.",
    oldEmailLabel: "Previous email:",
    newEmailLabel: "New email:",
    message2: "If you made this change, no further action is required.",
    message3:
      "If you did not request this change, your account may have been compromised. Please contact our support team immediately.",
    buttonText: "Contact Support",
    message4: "For your security, we recommend:",
    recommendation1: "• Changing your password immediately",
    recommendation2: "• Reviewing your recent account activity",
    recommendation3:
      "• Enabling two-factor authentication if not already active",
    footer: "Best regards,\nThe NextintelBetterAuth Team",
  },
  fr: {
    preview: "Votre adresse e-mail a été modifiée",
    greeting: "Bonjour",
    title: "Notification de Changement d'Adresse E-mail",
    message1:
      "Nous vous informons que votre adresse e-mail a été modifiée avec succès.",
    oldEmailLabel: "Ancienne adresse :",
    newEmailLabel: "Nouvelle adresse :",
    message2:
      "Si vous avez effectué ce changement, aucune action supplémentaire n'est requise.",
    message3:
      "Si vous n'avez pas demandé ce changement, votre compte pourrait être compromis. Veuillez contacter notre équipe de support immédiatement.",
    buttonText: "Contacter le Support",
    message4: "Pour votre sécurité, nous recommandons :",
    recommendation1: "• Changer votre mot de passe immédiatement",
    recommendation2: "• Vérifier l'activité récente de votre compte",
    recommendation3:
      "• Activer l'authentification à deux facteurs si ce n'est pas déjà fait",
    footer: "Cordialement,\nL'équipe NextintelBetterAuth",
  },
};

export const EmailChangeNotificationEmail = ({
  userName,
  oldEmail,
  newEmail,
  supportUrl,
  locale = "en",
}: EmailChangeNotificationEmailProps) => {
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
              flexDirection: "column" as const,
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
                marginBottom: "8px",
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
                textAlign: "center" as const,
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
              }}
            >
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: "8px 0 4px 0",
                }}
              >
                {t.oldEmailLabel}
              </p>
              <p
                style={{
                  color: "#1f2937",
                  fontSize: "16px",
                  fontWeight: "500",
                  margin: "0 0 12px 0",
                }}
              >
                {oldEmail}
              </p>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: "8px 0 4px 0",
                }}
              >
                {t.newEmailLabel}
              </p>
              <p
                style={{
                  color: "#1f2937",
                  fontSize: "16px",
                  fontWeight: "500",
                  margin: "0 0 12px 0",
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
                backgroundColor: "#fef3c7",
                borderLeft: "4px solid #f59e0b",
                borderRadius: "4px",
                padding: "16px",
                margin: "24px 0",
              }}
            >
              <p
                style={{
                  color: "#92400e",
                  fontSize: "16px",
                  fontWeight: "500",
                  margin: "0",
                }}
              >
                {t.message3}
              </p>
            </div>

            <div
              style={{
                textAlign: "center" as const,
                margin: "32px 0",
              }}
            >
              <a
                href={supportUrl}
                style={{
                  backgroundColor: "#dc2626",
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
              {t.message4}
            </p>

            <p
              style={{
                color: "#374151",
                fontSize: "14px",
                lineHeight: "20px",
                margin: "4px 0",
              }}
            >
              {t.recommendation1}
            </p>

            <p
              style={{
                color: "#374151",
                fontSize: "14px",
                lineHeight: "20px",
                margin: "4px 0",
              }}
            >
              {t.recommendation2}
            </p>

            <p
              style={{
                color: "#374151",
                fontSize: "14px",
                lineHeight: "20px",
                margin: "4px 0",
              }}
            >
              {t.recommendation3}
            </p>

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

export default EmailChangeNotificationEmail;
