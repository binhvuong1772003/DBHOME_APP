import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { STAFF_ROLE_FILTER_OPTIONS } from "../constants/staff";
import type {
  InviteStaffInput,
  Staff,
  StaffRole,
  UpdateStaffInput,
} from "../types/staff";
import { useTranslation } from "react-i18next";

interface StaffFormSheetProps {
  mode: "CREATE" | "EDIT";
  staff: Staff | null;
  open: boolean;
  canChangeRole: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (input: InviteStaffInput) => Promise<boolean>;
  onUpdate: (input: UpdateStaffInput) => Promise<boolean>;
}

export function StaffFormSheet({
  mode,
  staff,
  open,
  canChangeRole,
  isSubmitting,
  onOpenChange,
  onInvite,
  onUpdate,
}: StaffFormSheetProps) {
  const { t } = useTranslation("staff");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>(staff?.role ?? "STAFF");
  const [isActive, setIsActive] = useState(staff?.isActive ?? true);
  useEffect(() => {
    setEmail("");
    setRole(mode === "CREATE" ? "STAFF" : (staff?.role ?? "STAFF"));
    setIsActive(staff?.isActive ?? true);
  }, [mode, open, staff]);

  const roleOptions = STAFF_ROLE_FILTER_OPTIONS.filter(
    (option) =>
      option.value !== "ALL" &&
      // An OWNER cannot be invited through this form. For new invitations,
      // managers are limited to STAFF while owners can choose MANAGER/STAFF.
      mode !== "CREATE" ||
        (canChangeRole
          ? option.value !== "OWNER"
          : option.value === "STAFF"),
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "CREATE") {
      await onInvite({ invitedEmail: email.trim(), role });
      return;
    }
    const input: UpdateStaffInput = { isActive };
    if (canChangeRole) input.role = role;
    await onUpdate(input);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5 pr-14">
          <SheetTitle>
            {mode === "CREATE" ? t("form.addTitle") : t("form.editTitle")}
          </SheetTitle>
          <SheetDescription>
            {mode === "CREATE"
              ? t("form.addDescription")
              : t("form.editDescription")}
          </SheetDescription>
        </SheetHeader>
        <SheetClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-4 top-4 rounded-full"
            aria-label={t("form.close")}
          >
            <X aria-hidden="true" />
          </Button>
        </SheetClose>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {mode === "CREATE" && (
              <div className="space-y-2">
                <Label htmlFor="staff-email">{t("form.email")}</Label>
                <Input
                  id="staff-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder={t("form.emailPlaceholder")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <p className="text-xs leading-5 text-muted-foreground">
                  {t("form.emailHint")}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="staff-role">{t("form.role")}</Label>
              <Select
                value={role}
                disabled={!canChangeRole}
                onValueChange={(value) => setRole(value as StaffRole)}
              >
                <SelectTrigger id="staff-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(`roles.${option.value.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {mode === "CREATE" && !canChangeRole && (
                <p className="text-xs leading-5 text-muted-foreground">
                  Quản lý chỉ có thể thêm nhân viên. Chỉ owner mới được thêm quản lý.
                </p>
              )}
            </div>

            {mode === "EDIT" && (
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/25 p-4">
                <div>
                  <Label htmlFor="staff-active">{t("form.active")}</Label>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {t("form.activeHint")}
                  </p>
                </div>
                <Switch
                  id="staff-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                {t("form.cancel")}
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("form.saving")
                : mode === "CREATE"
                  ? t("form.sendInvitation")
                  : t("form.saveChanges")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
