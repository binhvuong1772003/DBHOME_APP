import { Clock3, Mail, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { StaffActionsMenu } from "./StaffActionsMenu";
import { useTranslation } from "react-i18next";

interface StaffCardProps {
  staff: Staff;
  canEdit: boolean;
  canDeactivate: boolean;
  onView: (staff: Staff) => void;
  onViewSchedule: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onDeactivate: (staff: Staff) => void;
}

export function StaffCard({
  staff,
  canEdit,
  canDeactivate,
  onView,
  onViewSchedule,
  onEdit,
  onDeactivate,
}: StaffCardProps) {
  const { t, i18n } = useTranslation("staff");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const name = getStaffName(staff);
  const status = getStaffStatus(staff);
  const schedule = getStaffSchedule(staff);
  const appointments = getStaffAppointments(staff);
  const revenue = getStaffRevenue(staff);
  const rating = staff.avgRating > 0 ? staff.avgRating : null;
  const avatarUrl = staff.avatarUrl ?? staff.user?.avatarUrl ?? undefined;

  return (
    <Card className="gap-0 py-0 shadow-xs transition-colors hover:border-primary/30">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Avatar className="size-12">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
              {getStaffInitials(staff)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
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
            <StaffActionsMenu
              staff={staff}
              canEdit={canEdit}
              canDeactivate={canDeactivate}
              onView={onView}
              onViewSchedule={onViewSchedule}
              onEdit={onEdit}
              onDeactivate={onDeactivate}
            />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">{name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t(`roles.${staff.role.toLowerCase()}`)} · STF-
            {staff.id.slice(-6).toUpperCase()}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="size-3.5" aria-hidden="true" />
            {getStaffEmail(staff)}
          </div>
        </div>
        <div className="mt-5 rounded-lg bg-muted/35 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {t("card.todayShift")}
          </p>
          {schedule ? (
            <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold tabular-nums">
              <Clock3 className="size-4 text-primary" aria-hidden="true" />
              {schedule}
            </div>
          ) : (
            <p className="mt-1.5 text-sm font-medium text-muted-foreground">
              {t("card.noShift")}
            </p>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 divide-x divide-border border-y border-border/70 py-3 text-center">
          <div>
            <p
              className={
                appointments === null
                  ? "text-lg font-bold text-muted-foreground"
                  : "text-lg font-bold"
              }
            >
              {appointments ?? "—"}
            </p>
            <p className="text-[10px] text-muted-foreground">{t("card.appointments")}</p>
          </div>
          <div>
            <p
              className={
                revenue === null
                  ? "text-lg font-bold text-muted-foreground"
                  : "text-lg font-bold"
              }
            >
              {revenue !== null
                ? new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(revenue)
                : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground">{t("card.revenue")}</p>
          </div>
          <div>
            {rating !== null ? (
              <p className="flex items-center justify-center gap-1 text-lg font-bold">
                <Star
                  className="size-3.5 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                {rating.toFixed(1)}
              </p>
            ) : (
              <p className="text-lg font-bold text-muted-foreground">—</p>
            )}
            <p className="text-[10px] text-muted-foreground">{t("card.rating")}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full rounded-lg"
          onClick={() => onView(staff)}
        >
          {t("card.viewProfile")}
        </Button>
      </CardContent>
    </Card>
  );
}
