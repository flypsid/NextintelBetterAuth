"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
// import { toast } from "sonner"; // Removed toast usage
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

type VerificationStatus = "loading" | "success" | "error" | "expired";

export function EmailVerificationHandler() {
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [isResending, setIsResending] = useState(false);
  const t = useTranslations("Auth");
  const locale = useLocale();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      if (error) {
        if (error === "expired") {
          setStatus("expired");
        } else {
          setStatus("error");
        }
        return;
      }

      try {
        const { error: verifyError } = await authClient.verifyEmail({
          query: {
            token,
          },
        });

        if (verifyError) {
          if (verifyError.message?.includes("expired")) {
            setStatus("expired");
          } else {
            setStatus("error");
          }
          return;
        }

        setStatus("success");
      } catch (error) {
        console.error("Email verification error:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, error, t]);

  const handleResendVerification = async () => {
    // Get current user session to obtain email
    const { data: session } = await authClient.getSession();
    if (!session?.user?.email) {
      console.error("No user email found for resending verification");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: session.user.email,
        callbackURL: `/${locale}/verify-email`,
      });

      if (error) {
        console.error("Resend verification error:", error.message || t("emailVerificationError"));
        return;
      }

      console.log("Verification email sent successfully");
    } catch (error) {
      console.error("Resend verification error:", error);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <p className="text-gray-600">{t("pleaseWaitVerifying")}</p>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                {t("emailVerified")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("emailVerifiedSuccess")}
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href={locale === "fr" ? "/fr/tableau-de-bord" : "/en/dashboard"}>
                    {t("goToDashboard")}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={locale === "fr" ? "/fr" : "/en"}>
                    {t("goToHomepage")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );

      case "expired":
        return (
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 mx-auto text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-2">
                {t("verificationLinkExpired")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("verificationLinkExpiredMessage")}
              </p>
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("sending")}
                  </>
                ) : (
                  t("resendVerification")
                )}
              </Button>
            </div>
          </div>
        );

      case "error":
      default:
        return (
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 mx-auto text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                {t("verificationFailed")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("verificationFailedMessage")}
              </p>
              <div className="space-y-2">
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {t("sending")}
                    </>
                  ) : (
                    t("resendVerification")
                  )}
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={locale === "fr" ? "/fr/connexion" : "/en/login"}>
                    {t("backToLogin")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
}
