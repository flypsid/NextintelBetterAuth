import { Suspense } from "react";
import { EmailChangeVerificationHandler } from "@/components/auth/EmailChangeVerificationHandler";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { Loader2 } from "lucide-react";

export default async function VerifyEmailChangePage() {
  const t = await getTranslations("Auth");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {t("emailChangeVerificationTitle")}
            </CardTitle>
            <CardDescription>
              {t("emailChangeVerificationDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                  <p className="text-gray-600">{t("pleaseWaitVerifying")}</p>
                </div>
              }
            >
              <EmailChangeVerificationHandler />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}