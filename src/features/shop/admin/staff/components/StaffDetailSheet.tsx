import { CalendarDays, Clock3, Mail, Star, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  getStaffAppointments,
  getStaffEmail,
  getStaffInitials,
  getStaffName,
  getStaffRevenue,
  getStaffSchedule,
  getStaffStatus,
} from "../constants/staff";
import type { Staff } from "../types/staff";
import { useTranslation } from "react-i18next";

interface StaffDetailSheetProps {
  staff: Staff | null;
  open: boolean;
  canEdit: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (staff: Staff) => void;
}

export function StaffDetailSheet({
  staff,
  open,
  canEdit,
  onOpenChange,
  onEdit,
}: StaffDetailSheetProps) {
  const { t, i18n } = useTranslation("staff");
  if (!staff) return null;

  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";

  const name = getStaffName(staff);
  const status = getStaffStatus(staff);
  const schedule = getStaffSchedule(staff);
  const appointments = getStaffAppointments(staff);
  const revenue = getStaffRevenue(staff);
  const avatarUrl = staff.avatarUrl ?? staff.user?.avatarUrl ?? undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5 pr-14">
          <SheetTitle>{t("details.title")}</SheetTitle>
        </SheetHeader>
        <SheetClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-4 top-4 rounded-full"
            aria-label={t("details.closeLabel")}
          >
            <X aria-hidden="true" />
          </Button>
        </SheetClose>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                {getStaffInitials(staff)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t(`roles.${staff.role.toLowerCase()}`)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {status === "ACTIVE" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {t("status.active")}
              </span>
            )}
            {status === "ON_LEAVE" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <span className="size-1.5 rounded-full bg-amber-500" />
                {t("status.onLeave")}
              </span>
            )}
            {status === "INACTIVE" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                {t("status.inactive")}
              </span>
            )}
            <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
              STF-{staff.id.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/25 p-3 text-sm">
              <Mail
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate">{getStaffEmail(staff)}</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/25 p-3 text-sm">
              <CalendarDays
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span>
                {t("details.joined", {
                  date: new Date(staff.joinedAt).toLocaleDateString(locale),
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/25 p-3 text-sm">
              <Clock3
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span>{schedule ?? t("details.noShiftToday")}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 divide-x divide-border border-y border-border/70 py-4 text-center">
            <div>
              <p className="text-xl font-bold">{appointments ?? "—"}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {t("card.appointments")}
              </p>
            </div>
            <div>
              <p className="text-xl font-bold">
                {revenue !== null
                  ? new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(revenue)
                  : "—"}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {t("card.revenue")}
              </p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 text-xl font-bold">
                {staff.avgRating > 0 && (
                  <Star
                    className="size-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                )}
                {staff.avgRating > 0 ? staff.avgRating.toFixed(1) : "—"}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {t("card.rating")}
              </p>
            </div>
          </div>

          {(staff.bio || staff.notes) && (
            <div className="mt-6 rounded-lg border border-border bg-muted/25 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("details.notes")}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {staff.bio || staff.notes}
              </p>
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
          <SheetClose asChild>
            <Button type="button" variant="outline">
              {t("details.close")}
            </Button>
          </SheetClose>
          {canEdit && (
            <Button type="button" onClick={() => onEdit(staff)}>
              {t("actions.edit")}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
