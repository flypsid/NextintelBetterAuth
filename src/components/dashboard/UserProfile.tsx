"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import {
  IconCamera,
  IconTrash,
  IconUser,
  IconMail,
  IconAlertTriangle,
  IconLock,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useSocialAuth } from "@/hooks/useSocialAuth";

// Schéma de validation pour le profil
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

// Schéma de validation pour le changement d'email
const emailChangeSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

// Schéma de validation pour le changement de mot de passe
// Schéma de validation pour le changement de mot de passe
const createPasswordChangeSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z.string().min(1, t("currentPasswordRequired")),
      newPassword: z.string().min(8, t("passwordTooShort")),
      confirmNewPassword: z.string().min(1, t("confirmPasswordRequired")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("passwordsDoNotMatch"),
      path: ["confirmNewPassword"],
    });

type ProfileFormData = z.infer<typeof profileSchema>;
type EmailChangeFormData = z.infer<typeof emailChangeSchema>;
type PasswordChangeFormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export function UserProfile() {
  const t = useTranslations("Dashboard.profile");
  const { user, refreshSession } = useAuth();
  const { hasSocialAuth } = useSocialAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.image || null
  );
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
  });
  const [emailChangeData, setEmailChangeData] = useState<EmailChangeFormData>({
    newEmail: "",
    currentPassword: "",
  });
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [emailErrors, setEmailErrors] = useState<Partial<EmailChangeFormData>>(
    {}
  );
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(user?.pendingEmail || "");
  const [passwordChangeData, setPasswordChangeData] =
    useState<PasswordChangeFormData>({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<PasswordChangeFormData>
  >({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Générer les initiales pour l'avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Gérer le changement d'avatar
  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      toast.error(t("uploadError"));
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setIsLoading(true);

      // Créer une URL temporaire pour l'aperçu
      const tempUrl = URL.createObjectURL(file);
      setAvatarUrl(tempUrl);

      // Upload vers l'API d'avatar
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      // Mettre à jour l'URL de l'avatar avec la réponse du serveur
      setAvatarUrl(result.avatarUrl);
      
      // Refresh the user session to get updated data
      await refreshSession();

      toast.success(t("avatarUpdatedSuccess"));
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error(t("uploadError"));
      setAvatarUrl(user?.image || null);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer l'avatar
  const handleRemoveAvatar = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/user/avatar", {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to remove avatar");
      }

      setAvatarUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Refresh the user session to get updated data
      await refreshSession();

      toast.success(t("avatarRemovedSuccess"));
    } catch (error) {
      console.error("Avatar removal error:", error);
      toast.error(t("avatarRemoveError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer les changements du formulaire de profil
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Gérer les changements du formulaire de changement d'email
  const handleEmailInputChange = (
    field: keyof EmailChangeFormData,
    value: string
  ) => {
    setEmailChangeData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur pour ce champ
    if (emailErrors[field]) {
      setEmailErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Gérer les changements du formulaire de changement de mot de passe
  const handlePasswordInputChange = (
    field: keyof PasswordChangeFormData,
    value: string
  ) => {
    setPasswordChangeData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur pour ce champ
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Soumettre le formulaire de profil
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Valider les données
      const validatedData = profileSchema.parse(formData);
      setErrors({});

      setIsLoading(true);

      // Appeler l'API de mise à jour du profil (sans email)
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: validatedData.name }),
      });

      if (!response.ok) {
        throw new Error(t("failedToUpdateProfile"));
      }

      const result = await response.json();

      if (result.success) {
        toast.success(t("updateSuccess"));
        // Refresh the user session to get updated data
        await refreshSession();
      } else {
        throw new Error(result.error || t("updateFailed"));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Erreurs de validation
        const fieldErrors: Partial<ProfileFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ProfileFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Profile update error:", error);
        toast.error(t("updateError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Soumettre le changement d'email
  const handleEmailChangeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Valider les données
      const validatedData = emailChangeSchema.parse(emailChangeData);
      setEmailErrors({});

      setIsLoading(true);

      // Appeler l'API de changement d'email
      const response = await fetch("/api/user/email/change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("failedToRequestEmailChange"));
      }

      if (result.success) {
        toast.success(t("emailChangeRequested"));
        setPendingEmail(validatedData.newEmail);
        setShowEmailChange(false);
        setEmailChangeData({ newEmail: "", currentPassword: "" });
      } else {
        throw new Error(result.error || t("emailChangeFailed"));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Erreurs de validation
        const fieldErrors: Partial<EmailChangeFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof EmailChangeFormData] = err.message;
          }
        });
        setEmailErrors(fieldErrors);
      } else {
        console.error("Email change error:", error);
        toast.error(t("emailChangeError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Soumettre le changement de mot de passe
  const handlePasswordChangeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Créer le schéma avec les traductions
      const passwordChangeSchema = createPasswordChangeSchema(t);
      // Valider les données
      const validatedData = passwordChangeSchema.parse(passwordChangeData);
      setPasswordErrors({});

      setIsLoading(true);

      // Appeler l'API de changement de mot de passe
      const response = await fetch("/api/user/password/change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: validatedData.currentPassword,
          newPassword: validatedData.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("failedToChangePassword"));
      }

      if (result.success) {
        toast.success(t("passwordChangeSuccess"));
        setShowPasswordChange(false);
        setPasswordChangeData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        throw new Error(result.error || t("passwordChangeFailed"));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Erreurs de validation
        const fieldErrors: Partial<PasswordChangeFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof PasswordChangeFormData] =
              err.message;
          }
        });
        setPasswordErrors(fieldErrors);
      } else {
        // Gestion spécifique des erreurs
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        if (errorMessage.includes("Current password is incorrect")) {
          // Erreur de mot de passe incorrect - afficher dans le champ
          setPasswordErrors({
            currentPassword: t("currentPasswordIncorrect"),
          });
        } else {
          // Autres erreurs - toast générique
          toast.error(t("passwordChangeError"));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler le changement d'email
  const handleCancelEmailChange = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/user/email/cancel", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("failedToCancelEmailChange"));
      }

      if (result.success) {
        toast.success(t("emailChangeCancelled"));
        setPendingEmail("");
      }
    } catch (error) {
      console.error("Cancel email change error:", error);
      toast.error(t("emailChangeCancelError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Renvoyer l'email de vérification
  const handleResendVerification = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/user/email/resend", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t("failedToResendVerification"));
      }

      if (result.success) {
        toast.success(t("emailChangeVerificationSent"));
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error(t("emailResendError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("accountDescription")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Carte Informations Personnelles */}
        <Card className="h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{t("personalInfo")}</CardTitle>
          <CardDescription className="text-sm">
            {t("personalInfoDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Section Avatar */}
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl || undefined} alt={formData.name} />
              <AvatarFallback className="text-sm">
                {formData.name ? (
                  getInitials(formData.name)
                ) : (
                  <IconUser className="h-6 w-6" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-3">
                <Label className="text-sm block">{t("avatar")}</Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="h-8 px-3 text-xs"
                >
                  <IconCamera className="mr-1 h-3 w-3" />
                  {t("changeAvatar")}
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isLoading}
                    className="h-8 px-3 text-xs"
                  >
                    <IconTrash className="mr-1 h-3 w-3" />
                    {t("removeAvatar")}
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          <Separator className="my-3" />

          {/* Formulaire de profil */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  {t("name")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("namePlaceholder")}
                  disabled={isLoading}
                  className="h-9"
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                size="sm"
                className="h-8 px-3 text-sm flex-1 sm:flex-none"
              >
                {isLoading ? t("saving") : t("save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    name: user?.name || "",
                  });
                  setAvatarUrl(user?.image || "");
                  setErrors({});
                }}
                disabled={isLoading}
                className="h-8 px-3 text-sm flex-1 sm:flex-none"
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Section Email */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <IconMail className="h-4 w-4" />
            {t("email")}
          </CardTitle>
          <CardDescription className="text-sm">
            {t("emailDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email actuel */}
          <div className="space-y-2">
            <Label className="text-sm">{t("currentEmail")}</Label>
            <div className="p-3 bg-muted rounded-md">
              <div className="space-y-2">
                <span className="text-sm break-all">{user?.email}</span>
                {!showEmailChange && !pendingEmail && (
                  <>
                    {hasSocialAuth ? (
                      <div className="mt-2 space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={true}
                          className="h-7 px-2 text-xs w-full opacity-50 cursor-not-allowed"
                        >
                          {t("changeEmail")}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          {t("socialAuthEmailChangeDisabled")}
                        </p>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEmailChange(true)}
                        className="h-7 px-2 mt-2 text-xs w-full"
                      >
                        {t("changeEmail")}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Email en attente */}
          {pendingEmail && (
            <Alert>
              <IconAlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t("pendingEmailChange")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("pendingEmailMessage", { email: pendingEmail })}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      disabled={isLoading}
                      className="h-7 px-2 text-xs"
                    >
                      {t("resendVerificationEmail")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEmailChange}
                      disabled={isLoading}
                      className="h-7 px-2 text-xs"
                    >
                      {t("cancelEmailChange")}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Formulaire de changement d'email */}
          {showEmailChange && !pendingEmail && (
            <form onSubmit={handleEmailChangeSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="newEmail" className="text-sm">
                    {t("newEmail")}
                  </Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={emailChangeData.newEmail}
                    onChange={(e) =>
                      handleEmailInputChange("newEmail", e.target.value)
                    }
                    placeholder={t("newEmailPlaceholder")}
                    disabled={isLoading}
                    className="h-9"
                  />
                  {emailErrors.newEmail && (
                    <p className="text-xs text-red-600">
                      {emailErrors.newEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm">
                    {t("currentPassword")}
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={emailChangeData.currentPassword}
                    onChange={(e) =>
                      handleEmailInputChange("currentPassword", e.target.value)
                    }
                    placeholder={t("currentPasswordPlaceholder")}
                    disabled={isLoading}
                    className="h-9"
                  />
                  {emailErrors.currentPassword && (
                    <p className="text-xs text-red-600">
                      {emailErrors.currentPassword}
                    </p>
                  )}
                </div>
              </div>

              <Alert>
                <IconAlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {t("emailChangeRequestedMessage")}
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="sm"
                  className="h-8 px-3 text-sm sm:flex-1"
                >
                  {isLoading ? t("requesting") : t("changeEmail")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEmailChange(false);
                    setEmailChangeData({ newEmail: "", currentPassword: "" });
                    setEmailErrors({});
                  }}
                  disabled={isLoading}
                  className="h-8 px-3 text-sm sm:flex-1"
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          )}

          {/* Section Mot de passe */}
          <Separator className="my-6" />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconLock className="h-4 w-4" />
              <h3 className="text-lg font-medium">{t("passwordSecurity")}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("passwordSecurityDescription")}
            </p>
            
            {!showPasswordChange ? (
              <div className="space-y-2">
                {hasSocialAuth ? (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={true}
                      className="h-8 px-3 text-sm w-full opacity-50 cursor-not-allowed"
                    >
                      {t("changePassword")}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {t("socialAuthPasswordChangeDisabled")}
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordChange(true)}
                    className="h-8 px-3 text-sm w-full"
                  >
                    {t("changePassword")}
                  </Button>
                )}
              </div>
            ) : (
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPasswordForChange" className="text-sm">
                      {t("currentPasswordForChange")}
                    </Label>
                    <Input
                      id="currentPasswordForChange"
                      type="password"
                      value={passwordChangeData.currentPassword}
                      onChange={(e) =>
                        handlePasswordInputChange(
                          "currentPassword",
                          e.target.value
                        )
                      }
                      placeholder={t("currentPasswordPlaceholder")}
                      disabled={isLoading}
                      className="h-9"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-xs text-red-600">
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm">
                      {t("newPassword")}
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordChangeData.newPassword}
                      onChange={(e) =>
                        handlePasswordInputChange("newPassword", e.target.value)
                      }
                      placeholder={t("newPasswordPlaceholder")}
                      disabled={isLoading}
                      className="h-9"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-red-600">
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword" className="text-sm">
                      {t("confirmNewPassword")}
                    </Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={passwordChangeData.confirmNewPassword}
                      onChange={(e) =>
                        handlePasswordInputChange(
                          "confirmNewPassword",
                          e.target.value
                        )
                      }
                      placeholder={t("confirmNewPasswordPlaceholder")}
                      disabled={isLoading}
                      className="h-9"
                    />
                    {passwordErrors.confirmNewPassword && (
                      <p className="text-xs text-red-600">
                        {passwordErrors.confirmNewPassword}
                      </p>
                    )}
                  </div>
                </div>

                <Alert>
                  <IconAlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {t("passwordChangeRequestedMessage")}
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="sm"
                    className="h-8 px-3 text-sm sm:flex-1"
                  >
                    {isLoading ? t("requesting") : t("changePassword")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordChangeData({
                        currentPassword: "",
                        newPassword: "",
                        confirmNewPassword: "",
                      });
                      setPasswordErrors({});
                    }}
                    disabled={isLoading}
                    className="h-8 px-3 text-sm sm:flex-1"
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
        </Card>

      </div>
    </div>
  );
}
