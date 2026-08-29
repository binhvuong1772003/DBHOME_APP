import { Clock3, StickyNote } from "lucide-react";
import { StaffAvatar } from "@/components/common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { appointmentStatusConfig } from "@/features/shop/admin/appointment/constants/appointmentStatus";
import type { StaffWorkspaceAppointment } from "../types/workspace";
import { useTranslation } from "react-i18next";

interface StaffAppointmentCardProps {
  appointment: StaffWorkspaceAppointment;
  highlighted?: boolean;
  timeline?: boolean;
}

export function StaffAppointmentCard({ appointment, highlighted = false, timeline = false }: StaffAppointmentCardProps) {
  const { t } = useTranslation(["workspace", "appointment", "common"]);
  const config = appointmentStatusConfig[appointment.status] ?? appointmentStatusConfig.PENDING;
  const initials = appointment.customerName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className={`relative grid w-full min-w-0 gap-3 rounded-xl border p-4 text-left shadow-xs sm:grid-cols-[5rem_minmax(0,1fr)_auto] ${
        highlighted ? "border-primary/35 bg-primary/5" : "border-border bg-card"
      } ${timeline ? "sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]" : ""}`}
    >
      {highlighted && <span className="absolute inset-y-4 left-0 w-[3px] rounded-r-full bg-primary" aria-hidden="true" />}
      <div className="flex items-baseline gap-2 font-mono tabular-nums sm:block">
        <p className={`text-base font-semibold ${config.timeClassName}`}>{appointment.startTime}</p>
        <p className="text-xs text-muted-foreground">{t("appointment.to", { time: appointment.endTime })}</p>
      </div>
      <div className="flex min-w-0 gap-3">
        <StaffAvatar
          initials={initials}
          avatarUrl={appointment.customerAvatar}
          alt={appointment.customerName}
          className="size-10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{appointment.customerName}</h3>
            {highlighted && <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">{t("appointment.upNext")}</span>}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{appointment.service || t("appointment.fallbackService")}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {t("common:time.minutes", { count: appointment.durationMinutes })}
            </span>
            {appointment.note && (
              <span className="inline-flex items-center gap-1">
                <StickyNote className="size-3.5" aria-hidden="true" />
                {t("appointment.noteAdded")}
              </span>
            )}
          </div>
        </div>
      </div>
      <Badge className={`w-fit self-start border-transparent ${config.badgeClassName}`}>
        {t(`appointment:${config.labelKey}`)}
      </Badge>
    </article>
  );
}
