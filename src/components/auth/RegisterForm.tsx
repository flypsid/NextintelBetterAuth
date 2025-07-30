"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import { createRegisterSchema } from "@/lib/schemas/auth";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      const registerSchema = createRegisterSchema(t);
      const validatedData = registerSchema.parse(formData);

      // Attempt registration
      const { data, error } = await authClient.signUp.email({
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      });

      if (error) {
        toast.error(error.message || t("registerError"));
        return;
      }

      if (data) {
        toast.success(t("registerSuccess"));
        // Rediriger vers la page de confirmation d'envoi d'email
        // pour informer l'utilisateur qu'un email de vérification a été envoyé
        router.push(`/${locale}/email-sent`);
        router.refresh();
      }
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
        toast.error(t("registerError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="name" className="block text-sm">
          {t("name")}
        </Label>
        <Input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder={t("placeholders.name")}
          className={errors.name ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="email" className="block text-sm">
          {t("email")}
        </Label>
        <Input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder={t("placeholders.email")}
          className={errors.email ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="password" className="block text-sm">
          {t("password")}
        </Label>
        <Input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder={t("placeholders.password")}
          className={errors.password ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="space-y-1 md:space-y-2">
        <Label htmlFor="confirmPassword" className="block text-sm">
          {t("confirmPassword")}
        </Label>
        <Input
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          placeholder={t("placeholders.confirmPassword")}
          className={errors.confirmPassword ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("signingUp") : t("signUp")}
      </Button>
    </form>
  );
}
