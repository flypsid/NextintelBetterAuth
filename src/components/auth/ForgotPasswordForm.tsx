"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { createForgotPasswordSchema } from "@/lib/schemas/auth";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate email
      const forgotPasswordSchema = createForgotPasswordSchema(t);
      const validatedData = forgotPasswordSchema.parse({ email });

      // Send reset password email
      const { error } = await authClient.forgetPassword({
        email: validatedData.email,
        redirectTo: "/reset-password", // URL where user will be redirected to reset password
      });

      if (error) {
        toast.error(error.message || t("failedToSendResetEmail"));
        return;
      }

      setIsSubmitted(true);
      toast.success(t("passwordResetEmailSent"));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error(t("failedToSendResetEmail"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-sm font-medium text-green-800">
            {t("resetEmailSent")}
          </h3>
          <p className="text-sm text-green-700 mt-1">
            {t("resetEmailSentMessage", { email })}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            setEmail("");
          }}
        >
          {t("sendAnotherEmail")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="block text-sm">
          {t("email")}
        </Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
          placeholder={t("placeholders.email")}
          className={errors.email ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("sending") : t("resetPassword")}
      </Button>
    </form>
  );
}
