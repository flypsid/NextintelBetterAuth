import { Resend } from "resend";
import { ForgotPasswordEmail } from "@/components/emails/ForgotPasswordEmail";
import { EmailVerificationEmail } from "@/components/emails/EmailVerificationEmail";
import { EmailChangeVerificationEmail } from "@/components/emails/EmailChangeVerificationEmail";
import { EmailChangeNotificationEmail } from "@/components/emails/EmailChangeNotificationEmail";
import { PasswordChangeNotificationEmail } from "@/components/emails/PasswordChangeNotificationEmail";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendForgotPasswordEmailParams {
  to: string;
  userName: string;
  resetUrl: string;
  locale: "en" | "fr";
}

interface SendVerificationEmailParams {
  to: string;
  userName: string;
  verificationUrl: string;
  locale: "en" | "fr";
}

interface SendEmailChangeVerificationParams {
  to: string;
  userName: string;
  newEmail: string;
  verificationUrl: string;
  locale: "en" | "fr";
}

interface SendEmailChangeNotificationParams {
  to: string;
  userName: string;
  newEmail: string;
  locale: "en" | "fr";
}

interface SendPasswordChangeNotificationParams {
  to: string;
  userName: string;
  locale: "en" | "fr";
}

const getSubject = (
  type:
    | "forgot-password"
    | "email-verification"
    | "email-change-verification"
    | "email-change-notification"
    | "password-change-notification",
  locale: "en" | "fr"
) => {
  const subjects = {
    "forgot-password": {
      en: "Reset your password - NextintelBetterAuth",
      fr: "Réinitialisez votre mot de passe - NextintelBetterAuth",
    },
    "email-verification": {
      en: "Verify your email address - NextintelBetterAuth",
      fr: "Vérifiez votre adresse email - NextintelBetterAuth",
    },
    "email-change-verification": {
      en: "Verify your new email address - NextintelBetterAuth",
      fr: "Vérifiez votre nouvelle adresse email - NextintelBetterAuth",
    },
    "email-change-notification": {
      en: "Email address change request - NextintelBetterAuth",
      fr: "Demande de changement d'adresse email - NextintelBetterAuth",
    },
    "password-change-notification": {
      en: "Password changed - NextintelBetterAuth",
      fr: "Mot de passe modifié - NextintelBetterAuth",
    },
  };

  return subjects[type][locale];
};

export async function sendForgotPasswordEmail({
  to,
  userName,
  resetUrl,
  locale,
}: SendForgotPasswordEmailParams) {
  try {
    const emailHtml = await render(
      ForgotPasswordEmail({ userName, resetUrl, locale })
    );

    const { data, error } = await resend.emails.send({
      from: "noreply@deff-fondation.com", // Domaine temporaire vérifié - permet l'envoi à toutes adresses
      to: [to],
      subject: getSubject("forgot-password", locale),
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending forgot password email:", error);
      throw new Error("Failed to send forgot password email");
    }

    console.log("Forgot password email sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendForgotPasswordEmail:", error);
    throw error;
  }
}

export async function sendVerificationEmail({
  to,
  userName,
  verificationUrl,
  locale,
}: SendVerificationEmailParams) {
  try {
    console.log("Starting email verification send process:", {
      to,
      userName,
      locale,
      hasResendKey: !!process.env.RESEND_API_KEY,
    });

    const emailHtml = await render(
      EmailVerificationEmail({ userName, verificationUrl, locale })
    );

    console.log("Email HTML rendered successfully");

    const { data, error } = await resend.emails.send({
      from: "noreply@deff-fondation.com", // Domaine temporaire vérifié - permet l'envoi à toutes adresses
      to: [to],
      subject: getSubject("email-verification", locale),
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(
        `Failed to send verification email: ${JSON.stringify(error)}`
      );
    }

    console.log("Verification email sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
}

// Fonction utilitaire pour extraire la locale depuis une requête
export function getLocaleFromRequest(request?: Request): "en" | "fr" {
  if (!request) return "en";

  try {
    const url = new URL(request.url);

    // Vérifier d'abord les paramètres de requête (callbackURL)
    const callbackURL = url.searchParams.get("callbackURL");
    if (callbackURL) {
      const callbackSegments = callbackURL.split("/");
      const callbackLocale = callbackSegments[1];
      if (callbackLocale === "fr" || callbackLocale === "en") {
        return callbackLocale;
      }
    }

    // Ensuite vérifier le chemin de l'URL
    const pathSegments = url.pathname.split("/");
    const locale = pathSegments[1];
    if (locale === "fr" || locale === "en") {
      return locale;
    }

    // Vérifier le header Referer comme fallback
    const referer = request.headers.get("referer");
    if (referer) {
      const refererUrl = new URL(referer);
      const refererSegments = refererUrl.pathname.split("/");
      const refererLocale = refererSegments[1];
      if (refererLocale === "fr" || refererLocale === "en") {
        return refererLocale;
      }
    }
  } catch (error) {
    console.error("Error parsing URL in getLocaleFromRequest:", error);
  }

  // Si la locale n'est pas trouvée, utiliser 'en' par défaut
  return "en";
}

// Fonction pour envoyer l'email de vérification du changement d'adresse
export async function sendEmailChangeVerification({
  to,
  userName,
  newEmail,
  verificationUrl,
  locale,
}: SendEmailChangeVerificationParams) {
  try {
    console.log("Starting email change verification send process:", {
      to,
      userName,
      newEmail,
      locale,
      hasResendKey: !!process.env.RESEND_API_KEY,
    });

    // Utiliser le template spécialisé pour la vérification de changement d'email
    const emailHtml = await render(
      EmailChangeVerificationEmail({
        userName,
        newEmail,
        verificationUrl,
        locale,
      })
    );

    console.log("Email change verification HTML rendered successfully");

    const { data, error } = await resend.emails.send({
      from: "noreply@deff-fondation.com",
      to: [to],
      subject: getSubject("email-change-verification", locale),
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error for email change verification:", error);
      throw new Error(
        `Failed to send email change verification: ${JSON.stringify(error)}`
      );
    }

    console.log("Email change verification sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendEmailChangeVerification:", error);
    throw error;
  }
}

// Fonction pour envoyer la notification de changement d'email à l'ancienne adresse
export async function sendEmailChangeNotification({
  to,
  userName,
  newEmail,
  locale,
}: SendEmailChangeNotificationParams) {
  try {
    console.log("Starting email change notification send process:", {
      to,
      userName,
      newEmail,
      locale,
      hasResendKey: !!process.env.RESEND_API_KEY,
    });

    // Utiliser le template React Email pour la notification de changement d'email
    const emailHtml = await render(
      EmailChangeNotificationEmail({
        userName,
        oldEmail: to,
        newEmail,
        supportUrl: `${process.env.NEXT_PUBLIC_URL}/contact`,
        locale,
      })
    );

    const { data, error } = await resend.emails.send({
      from: "noreply@deff-fondation.com",
      to: [to],
      subject: getSubject("email-change-notification", locale),
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error for email change notification:", error);
      throw new Error(
        `Failed to send email change notification: ${JSON.stringify(error)}`
      );
    }

    console.log("Email change notification sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendEmailChangeNotification:", error);
    throw error;
  }
}

// Fonction pour envoyer la notification de changement de mot de passe
export async function sendPasswordChangeNotification({
  to,
  userName,
  locale,
}: SendPasswordChangeNotificationParams) {
  try {
    console.log("Starting password change notification send process:", {
      to,
      userName,
      locale,
      hasResendKey: !!process.env.RESEND_API_KEY,
    });

    // Utiliser le template React Email pour la notification de changement de mot de passe
    const emailHtml = await render(
      PasswordChangeNotificationEmail({
        userName,
        userEmail: to,
        changeDate: new Date().toLocaleString(
          locale === "fr" ? "fr-FR" : "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          }
        ),
        supportUrl: `${process.env.NEXT_PUBLIC_URL}/contact`,
        locale,
      })
    );

    const { data, error } = await resend.emails.send({
      from: "noreply@deff-fondation.com",
      to: [to],
      subject: getSubject("password-change-notification", locale),
      html: emailHtml,
    });

    if (error) {
      console.error(
        "Resend API error for password change notification:",
        error
      );
      throw new Error(
        `Failed to send password change notification: ${JSON.stringify(error)}`
      );
    }

    console.log("Password change notification sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error in sendPasswordChangeNotification:", error);
    throw error;
  }
}
