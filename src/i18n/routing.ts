import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "fr"],

  // Used when no locale matches
  defaultLocale: "en",

  pathnames: {
    "/": {
      en: "/",
      fr: "/",
    },
    "/dashboard": {
      en: "/dashboard",
      fr: "/tableau-de-bord",
    },
    "/login": {
      en: "/login",
      fr: "/connexion",
    },
    "/register": {
      en: "/register",
      fr: "/inscription",
    },
    "/forgot-password": {
      en: "/forgot-password",
      fr: "/mot-de-passe-oublie",
    },
    "/reset-password": {
      en: "/reset-password",
      fr: "/reinitialiser-mot-de-passe",
    },
    "/verify-email": {
      en: "/verify-email",
      fr: "/verifier-email",
    },
    "/contact": {
      en: "/contact-us",
      fr: "/contactez-nous",
    },
    "/dashboard/profile": {
      en: "/dashboard/profile",
      fr: "/tableau-de-bord/profil",
    },
  },
});
