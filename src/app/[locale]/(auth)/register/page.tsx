"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const locale = useLocale();

  const handleGoogleSignIn = async () => {
    const dashboardPath =
      locale === "fr" ? "/fr/tableau-de-bord" : "/en/dashboard";
    await authClient.signIn.social({
      provider: "google",
      callbackURL: dashboardPath,
    });
  };

  const handleDiscordSignIn = async () => {
    const dashboardPath =
      locale === "fr" ? "/fr/tableau-de-bord" : "/en/dashboard";
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: dashboardPath,
    });
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-12 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Image
                src="/images/logo.png"
                alt="NextintelBetterAuth Logo"
                width={58}
                height={58}
                className="mx-auto mb-2"
                priority
              />
            </Link>
            <h1 className="text-title mb-1 mt-3 text-xl font-semibold">
              {t("registerTitle")}
            </h1>
            <p className="text-sm">{t("registerWelcome")}</p>
          </div>

          <div className="mt-3 md:mt-4">
            <div className="grid grid-cols-2 gap-3 mb-3 md:mb-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="mr-2 flex-shrink-0" size={16} />
                <span>Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDiscordSignIn}
              >
                <FaDiscord
                  className="mr-2 flex-shrink-0"
                  size={16}
                  style={{ color: "#5865F2" }}
                />
                <span>Discord</span>
              </Button>
            </div>

            <div className="my-3 md:my-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <hr className="border-dashed" />
              <span className="text-muted-foreground text-xs">
                {t("orContinueWith")}
              </span>
              <hr className="border-dashed" />
            </div>

            <RegisterForm />
          </div>
        </div>

        <div className="p-2 md:p-3">
          <p className="text-accent-foreground text-center text-sm">
            {t("alreadyHaveAccount")}
            <Button asChild variant="link" className="px-2">
              <Link href="/login">{t("signIn")}</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
