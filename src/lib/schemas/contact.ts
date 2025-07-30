import { z } from "zod";

export const getContactSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("form.errors.name.min"))
      .nonempty(t("form.errors.name.required")),
    email: z
      .string()
      .email(t("form.errors.email.email"))
      .nonempty(t("form.errors.email.required")),
    message: z
      .string()
      .min(5, t("form.errors.message.min"))
      .nonempty(t("form.errors.message.required")),
  });
