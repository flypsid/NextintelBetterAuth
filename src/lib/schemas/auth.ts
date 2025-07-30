import { z } from "zod";

// Schémas de base pour l'authentification
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schémas avec traductions pour le côté client
export const createLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t("validation.emailInvalid")),
  password: z.string().min(1, t("validation.passwordRequired")),
});

export const createRegisterSchema = (t: (key: string) => string) => z
  .object({
    name: z.string().min(2, t("validation.nameRequired")),
    email: z.string().email(t("validation.emailInvalid")),
    password: z.string().min(8, t("validation.passwordMinLength")),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("validation.passwordsNoMatch"),
    path: ["confirmPassword"],
  });

export const createForgotPasswordSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t("validation.emailInvalid")),
});

export const createResetPasswordSchema = (t: (key: string) => string) => z.object({
  password: z.string().min(8, t("validation.passwordMinLength")),
  confirmPassword: z.string().min(8, t("validation.passwordMinLength")),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("validation.passwordsDoNotMatch"),
  path: ["confirmPassword"],
});

// Types inférés
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;