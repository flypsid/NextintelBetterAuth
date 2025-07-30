"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import Link from "next/link";

export function EmailSentConfirmation() {
  const [isResending, setIsResending] = useState(false);
  const t = useTranslations("Auth");
  const locale = useLocale();
  const { user } = useAuth();

  const handleResendVerification = async () => {
    if (!user?.email) {
      toast.error(t("emailVerificationError"));
      return;
    }

    setIsResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: `/${locale}/verify-email`
      });
      
      if (error) {
        toast.error(error.message || t("emailVerificationError"));
        return;
      }

      toast.success(t("emailVerificationSent"));
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error(t("emailVerificationError"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="text-center space-y-4">
      <Mail className="h-12 w-12 mx-auto text-blue-600" />
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {t("emailSentTitle")}
        </h3>
        <p className="text-gray-600 mb-4">
          {t("emailSentMessage")}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          {t("emailSentInstructions")}
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={handleResendVerification}
          disabled={isResending}
          variant="outline"
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
        
        <Button asChild variant="ghost" className="w-full">
          <Link href={`/${locale}/login`}>{t("backToLogin")}</Link>
        </Button>
      </div>
    </div>
  );
}