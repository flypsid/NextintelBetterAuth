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

type ProfileFormData = z.infer<typeof profileSchema>;
type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

export function UserProfile() {
  const t = useTranslations("Dashboard.profile");
  const { user } = useAuth();
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
    <div className="max-w-sm mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("accountDescription")}
        </p>
      </div>

      <Card>
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
            <div className="text-center space-y-2">
              <Label className="text-sm block">{t("avatar")}</Label>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
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
                  <div className="flex flex-col gap-2">
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

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="sm"
                  className="h-8 px-3 text-sm flex-1 sm:flex-none"
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
                  className="h-8 px-3 text-sm flex-1 sm:flex-none"
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
