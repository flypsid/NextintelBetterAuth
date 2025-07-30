import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
  getLocaleFromRequest,
} from "@/lib/email";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }, request) => {
      const locale = getLocaleFromRequest(request);
      await sendForgotPasswordEmail({
        to: user.email,
        userName: user.name || user.email.split("@")[0],
        resetUrl: url,
        locale,
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      try {
        const locale = getLocaleFromRequest(request);
        console.log(
          "Better Auth: Attempting to send verification email for user:",
          user.email
        );

        await sendVerificationEmail({
          to: user.email,
          userName: user.name || user.email.split("@")[0],
          verificationUrl: url,
          locale,
        });

        console.log(
          "Better Auth: Verification email sent successfully for user:",
          user.email
        );
      } catch (error) {
        console.error(
          "Better Auth: Failed to send verification email for user:",
          user.email,
          error
        );
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [nextCookies()],
});
