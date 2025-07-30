"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type VerificationStatus = "loading" | "success" | "error" | "expired";

export function EmailChangeVerificationHandler() {
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const t = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    const verifyEmailChange = async () => {
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
        const response = await fetch("/api/user/email/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (!response.ok) {
          if (result.error?.includes("expired")) {
            setStatus("expired");
          } else {
            setStatus("error");
          }
          return;
        }

        setStatus("success");
        toast.success(t("emailChangeSuccess"));
        
        // Rediriger vers le profil après un délai
        setTimeout(() => {
          router.push(locale === "fr" ? "/fr/tableau-de-bord/profil" : "/en/dashboard/profile");
        }, 3000);
      } catch (error) {
        console.error("Email change verification error:", error);
        setStatus("error");
      }
    };

    verifyEmailChange();
  }, [token, error, t, locale, router]);

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
                {t("emailChangeVerified")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("emailChangeVerifiedSuccess")}
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href={locale === "fr" ? "/fr/tableau-de-bord/profil" : "/en/dashboard/profile"}>
                    {t("goToProfile")}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={locale === "fr" ? "/fr/tableau-de-bord" : "/en/dashboard"}>
                    {t("goToDashboard")}
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
                {t("emailChangeExpiredMessage")}
              </p>
              <Button asChild className="w-full">
                <Link href={locale === "fr" ? "/fr/tableau-de-bord/profil" : "/en/dashboard/profile"}>
                  {t("goToProfile")}
                </Link>
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
                {t("emailChangeFailedMessage")}
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href={locale === "fr" ? "/fr/tableau-de-bord/profil" : "/en/dashboard/profile"}>
                    {t("goToProfile")}
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
    }
  };

  return <div className="w-full">{renderContent()}</div>;
}