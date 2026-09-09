import { useRef, useState } from "react";
import { AlertCircle, Camera, CheckCircle2, Loader2, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateMyProfile, uploadMyAvatar } from "@/services/accountService";

const getInitials = (name?: string | null) =>
  (name ?? "SHN")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SHN";

export default function AccountPage() {
  const { t } = useTranslation("account");
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) return null;

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError(t("validation.nameRequired"));
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateMyProfile({ name: name.trim() });
      setUser(updated);
      setName(updated.name);
      setSuccess(t("profile.saveSuccess"));
    } catch {
      setError(t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const updated = await uploadMyAvatar(file);
      setUser(updated);
      setSuccess(t("profile.avatarSuccess"));
    } catch {
      setError(t("profile.avatarError"));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <AuthLayout eyebrow={t("eyebrow")}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("description")}</p>
        </div>
        {(error || success) && <Alert variant={error ? "destructive" : "default"}>{error ? <AlertCircle className="size-4" aria-hidden="true" /> : <CheckCircle2 className="size-4" aria-hidden="true" />}<AlertDescription>{error || success}</AlertDescription></Alert>}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.title")}</CardTitle>
            <CardDescription>{t("profile.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleAvatarChange} />
                <Button type="button" variant="outline" className="min-h-11" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Camera className="size-4" aria-hidden="true" />}
                  {uploading ? t("profile.uploading") : t("profile.changeAvatar")}
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">{t("profile.avatarHint")}</p>
              </div>
            </div>
            <form onSubmit={handleSave} className="space-y-5" noValidate>
              <Field className="gap-2">
                <FieldLabel htmlFor="account-name">{t("fields.name")}</FieldLabel>
                <Input id="account-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="h-11" />
                <FieldError>{!name.trim() ? error && t("validation.nameRequired") : undefined}</FieldError>
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="account-email">{t("fields.email")}</FieldLabel>
                <Input id="account-email" value={user.email} readOnly className="h-11 bg-muted/50" />
                <p className="text-xs text-muted-foreground">{t("fields.emailReadOnly")}</p>
              </Field>
              <Button type="submit" className="min-h-11" disabled={saving || uploading}>
                {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
                {saving ? t("profile.saving") : t("profile.save")}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("security.title")}</CardTitle><CardDescription>{t("security.description")}</CardDescription></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">{t("security.passwordUnavailable")}</p></CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
