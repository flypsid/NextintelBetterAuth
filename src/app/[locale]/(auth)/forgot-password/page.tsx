import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 dark:bg-transparent">
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
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              {t("resetPassword")}
            </h1>
            <p className="text-sm">{t("enterEmailForReset")}</p>
          </div>

          <div className="mt-6">
            <ForgotPasswordForm />
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            {t("rememberedPassword")}
            <Button asChild variant="link" className="px-2">
              <Link href="/login">{t("signIn")}</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
