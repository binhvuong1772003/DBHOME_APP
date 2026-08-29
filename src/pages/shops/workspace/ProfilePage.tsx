import { useState } from "react";
import { Languages, Mail, Phone, Sparkles } from "lucide-react";
import { StaffAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { EditProfileSheet } from "@/features/shop/workspace/components/EditProfileSheet";
import { WorkspaceHeader } from "@/features/shop/workspace/components/WorkspaceHeader";
import { defaultStaffProfile } from "@/features/shop/workspace/mock/staff.mock";
import type { StaffProfile } from "@/features/shop/workspace/types/workspace";
import { useTranslation } from "react-i18next";

export function ProfilePage() {
  const { t } = useTranslation("workspace");
  const { user } = useAuth();
  const [profile, setProfile] = useState<StaffProfile>({
    ...defaultStaffProfile,
    fullName: user?.name || defaultStaffProfile.fullName,
    email: user?.email || defaultStaffProfile.email,
    avatarUrl: user?.avatarUrl,
  });
  const initials = profile.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-dvh">
      <WorkspaceHeader
        title={t("profile.pageTitle")}
        description={t("profile.pageDescription")}
        actions={<EditProfileSheet profile={profile} onSave={setProfile} />}
      />
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Card className="gap-5 py-6 shadow-xs">
            <CardHeader className="px-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <StaffAvatar initials={initials} avatarUrl={profile.avatarUrl} alt={profile.fullName} className="size-20" />
                <div>
                  <CardTitle className="text-2xl">{profile.fullName}</CardTitle>
                  <CardDescription className="mt-1 text-sm">{profile.specialty}</CardDescription>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge className="border-primary/20 bg-primary/10 text-primary">{t("profile.activeStaff")}</Badge>
                    <Badge className="border-secondary/20 bg-secondary/10 text-secondary">{t("profile.seniorArtist")}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-5 sm:px-6">
              <div>
                <h2 className="text-sm font-semibold">{t("profile.about")}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{profile.bio}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <section aria-labelledby="profile-specialties">
                  <h2 id="profile-specialties" className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-primary" aria-hidden="true" />{t("profile.specialties")}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">{profile.skills.map((skill) => <Badge key={skill} className="bg-muted text-foreground">{skill}</Badge>)}</div>
                </section>
                <section aria-labelledby="profile-languages">
                  <h2 id="profile-languages" className="flex items-center gap-2 text-sm font-semibold"><Languages className="size-4 text-secondary" aria-hidden="true" />{t("profile.languages")}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">{profile.languages.map((language) => <Badge key={language} className="bg-muted text-foreground">{language}</Badge>)}</div>
                </section>
              </div>
            </CardContent>
          </Card>
          <Card className="gap-4 py-5 shadow-xs">
            <CardHeader className="px-5"><CardTitle className="text-sm">{t("profile.contactDetails")}</CardTitle><CardDescription>{t("profile.contactDescription")}</CardDescription></CardHeader>
            <CardContent className="space-y-4 px-5 text-sm">
              <div className="flex min-w-0 items-start gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="min-w-0 [overflow-wrap:anywhere]">{profile.email}</span></div>
              <div className="flex items-center gap-3"><Phone className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span>{profile.phone}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
