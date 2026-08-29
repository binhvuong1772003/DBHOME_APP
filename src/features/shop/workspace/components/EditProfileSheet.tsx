import { useState, type FormEvent } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { StaffProfile } from "../types/workspace";
import { useTranslation } from "react-i18next";

interface EditProfileSheetProps {
  profile: StaffProfile;
  onSave: (profile: StaffProfile) => void;
}

export function EditProfileSheet({ profile, onSave }: EditProfileSheetProps) {
  const { t } = useTranslation(["workspace", "common"]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(profile);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraft(profile);
    setOpen(nextOpen);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave(draft);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className="h-11">
          <Pencil aria-hidden="true" />
          {t("profile.edit")}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="border-b px-5 py-5 pr-16">
          <SheetTitle>{t("profile.editTitle")}</SheetTitle>
          <SheetDescription>{t("profile.editDescription")}</SheetDescription>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 size-11" aria-label={t("accessibility.closeProfile")}>
              <X aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <FieldGroup className="p-5">
            <Field>
              <FieldLabel htmlFor="profile-name">{t("profile.fullName")}</FieldLabel>
              <Input id="profile-name" className="h-11" value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-specialty">{t("profile.professionalTitle")}</FieldLabel>
              <Input id="profile-specialty" className="h-11" value={draft.specialty} onChange={(event) => setDraft({ ...draft, specialty: event.target.value })} required />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="profile-email">{t("common:labels.email")}</FieldLabel>
                <Input id="profile-email" type="email" className="h-11" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-phone">{t("common:labels.phone")}</FieldLabel>
                <Input id="profile-phone" type="tel" className="h-11" value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} required />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="profile-bio">{t("profile.bio")}</FieldLabel>
              <Textarea id="profile-bio" className="min-h-28" value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} />
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-skills">{t("profile.skills")}</FieldLabel>
              <Input id="profile-skills" className="h-11" value={draft.skills.join(", ")} onChange={(event) => setDraft({ ...draft, skills: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} />
              <FieldDescription>{t("profile.skillsHint")}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-languages">{t("profile.languages")}</FieldLabel>
              <Input id="profile-languages" className="h-11" value={draft.languages.join(", ")} onChange={(event) => setDraft({ ...draft, languages: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} />
              <FieldDescription>{t("profile.languagesHint")}</FieldDescription>
            </Field>
          </FieldGroup>
          <SheetFooter className="mt-auto border-t bg-background p-5">
            <Button type="submit" className="h-11">{t("common:actions.saveChanges")}</Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" className="h-11">{t("common:actions.cancel")}</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
