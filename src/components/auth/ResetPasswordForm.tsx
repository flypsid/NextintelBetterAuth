"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { createResetPasswordSchema } from "@/lib/schemas/auth";
import Link from "next/link";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const resetPasswordSchema = createResetPasswordSchema(t);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error(t("invalidResetLink"));
      return;
    }

    try {
      resetPasswordSchema.parse({ password, confirmPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        toast.error(error.message || t("resetPasswordError"));
        return;
      }

      toast.success(t("passwordResetSuccess"));
      router.push("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(t("resetPasswordError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Show error if token is invalid or expired
  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">{t("invalidOrExpiredToken")}</p>
        <Button asChild variant="outline">
          <Link href="/forgot-password">{t("requestNewLink")}</Link>
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">{t("invalidResetLink")}</p>
        <Button asChild variant="outline">
          <Link href="/forgot-password">{t("requestNewLink")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">{t("newPassword")}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          placeholder={t("enterNewPassword")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
          placeholder={t("confirmNewPassword")}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("resetting") : t("resetPassword")}
      </Button>
    </form>
  );
}
