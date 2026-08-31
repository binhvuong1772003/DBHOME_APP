import { Clock3, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface StaffTableRowProps {
  staff: Staff;
  canEdit: boolean;
  canDeactivate: boolean;
  onView: (staff: Staff) => void;
  onViewSchedule: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onDeactivate: (staff: Staff) => void;
}

export function StaffTableRow({
  staff,
  canEdit,
  canDeactivate,
  onView,
  onViewSchedule,
  onEdit,
  onDeactivate,
}: StaffTableRowProps) {
  const { t, i18n } = useTranslation("staff");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  const name = getStaffName(staff);
  const email = getStaffEmail(staff);
  const status = getStaffStatus(staff);
  const schedule = getStaffSchedule(staff);
  const appointments = getStaffAppointments(staff);
  const revenue = getStaffRevenue(staff);
  const rating = staff.avgRating > 0 ? staff.avgRating : null;
  const avatarUrl = staff.avatarUrl ?? staff.user?.avatarUrl ?? undefined;

  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-11 ring-2 ring-background shadow-xs">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {getStaffInitials(staff)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="truncate">{email}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[10px]">
                STF-{staff.id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {t(`roles.${staff.role.toLowerCase()}`)}
        </span>
      </td>
      <td className="px-4 py-4">
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
      </td>
      <td className="px-4 py-4">
        {schedule ? (
          <div className="flex items-center gap-2 text-sm">
            <Clock3
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="font-medium tabular-nums">{schedule}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-4 text-center">
        {appointments !== null ? (
          <span className="inline-flex min-w-8 justify-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
            {appointments}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-4 text-right text-sm font-semibold tabular-nums">
        {revenue !== null
          ? new Intl.NumberFormat(locale, {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(revenue)
          : "—"}
      </td>
      <td className="px-4 py-4">
        {rating !== null ? (
          <div className="flex items-center justify-center gap-1 text-sm font-semibold">
            <Star
              className="size-3.5 fill-amber-400 text-amber-400"
              aria-hidden="true"
            />
            {rating.toFixed(1)}
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">—</div>
        )}
      </td>
      <td className="px-4 py-4 text-right">
        <StaffActionsMenu
          staff={staff}
          canEdit={canEdit}
          canDeactivate={canDeactivate}
          onView={onView}
          onViewSchedule={onViewSchedule}
          onEdit={onEdit}
          onDeactivate={onDeactivate}
        />
      </td>
    </tr>
  );
}
