"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { getContactSchema } from "@/lib/schemas/contact";

// Définition d'un type pour les erreurs de champ
interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactPage = () => {
  const t = useTranslations("ContactPage");

  // Schéma de validation Zod avec messages d'erreur traduits
  const schema = getContactSchema(t);

  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] && typeof err.path[0] === "string")
          fieldErrors[err.path[0] as keyof FieldErrors] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      // ...traitement du formulaire (envoi, etc.)
    }
  };

  return (
    <div className="max-w-md mx-auto my-44 bg-background border border-muted rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-2 tracking-tight text-foreground">
        {t("title")}
      </h1>
      <p className="text-muted-foreground mb-8 text-base leading-relaxed">
        {t("description")}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="font-medium text-foreground">
            {t("form.name")}
          </Label>
          <Input
            id="name"
            name="name"
            placeholder={t("form.namePlaceholder")}
            className="h-12 px-4 py-2 rounded-lg border border-input bg-card text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 transition"
            autoComplete="name"
          />
          {errors.name && (
            <span className="text-destructive text-xs mt-1 flex items-center gap-1 animate-in fade-in duration-200">
              <svg
                className="w-4 h-4 text-destructive"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
                />
              </svg>
              {errors.name}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-medium text-foreground">
            {t("form.email")}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("form.emailPlaceholder")}
            className="h-12 px-4 py-2 rounded-lg border border-input bg-card text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 transition"
            autoComplete="email"
          />
          {errors.email && (
            <span className="text-destructive text-xs mt-1 flex items-center gap-1 animate-in fade-in duration-200">
              <svg
                className="w-4 h-4 text-destructive"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
                />
              </svg>
              {errors.email}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="message" className="font-medium text-foreground">
            {t("form.message")}
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder={t("form.messagePlaceholder")}
            className="min-h-[110px] px-4 py-3 rounded-lg border border-input bg-card text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 transition resize-none"
          />
          {errors.message && (
            <span className="text-destructive text-xs mt-1 flex items-center gap-1 animate-in fade-in duration-200">
              <svg
                className="w-4 h-4 text-destructive"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
                />
              </svg>
              {errors.message}
            </span>
          )}
        </div>
        <Button
          type="submit"
          className="h-12 mt-2 bg-primary text-primary-foreground font-semibold rounded-lg text-lg shadow-sm hover:bg-primary/90 transition-colors"
        >
          {t("form.submit")}
        </Button>
      </form>
    </div>
  );
};

export default ContactPage;
