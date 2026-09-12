import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StaffAvatar } from "@/components/common/UserAvatar";
import type { Staff } from "@/features/shop/admin/staff/types/staff";
import type { Appointment } from "../type/appointment";
import { appointmentStatusConfig } from "../constants/appointmentStatus";
import { getAppointmentDurationMinutes, getOverlappingAppointmentLayout, parseTimeToMinutes, clamp, formatTimeLabel } from "../utils/scheduleUtils";

interface ScheduleLane {
  key: string;
  label: string;
  staff?: Staff;
  appointments: Appointment[];
}

interface ScheduleGridProps {
  lanes: ScheduleLane[];
  openMinutes: number;
  closeMinutes: number;
  timezone: string | null;
  isLoading: boolean;
  error: string | null;
  isWorkDay: boolean;
  hasValidSchedule: boolean;
  message?: string | null;
  hasFilteredResults: boolean;
  hasFilters: boolean;
  onRetry: () => void;
  onSelect: (appointment: Appointment) => void;
}

function AppointmentCard({
  appointment,
  laneLayout,
  openMinutes,
  calendarMinutes,
  onSelect,
}: {
  appointment: Appointment;
  laneLayout: { column: number; columns: number };
  openMinutes: number;
  calendarMinutes: number;
  onSelect: (appointment: Appointment) => void;
}) {
  const { t } = useTranslation("appointment");
  const start = parseTimeToMinutes(appointment.startTime);
  const duration = getAppointmentDurationMinutes(
    appointment.startTime,
    appointment.endTime,
  );
  if (start === null || duration === null) return null;

  const config = appointmentStatusConfig[appointment.status] ?? appointmentStatusConfig.PENDING;
  const positionTop = clamp(((start - openMinutes) / calendarMinutes) * 100, -4, 100);
  const height = Math.max((duration / calendarMinutes) * 100, 4);
  const width = 100 / laneLayout.columns;

  return (
    <div
      className={`absolute z-10 overflow-hidden rounded-lg border p-2.5 shadow-xs transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-md active:opacity-80 ${config.cardClassName}`}
      style={{ top: `${positionTop}%`, height: `${height}%`, left: `${laneLayout.column * width}%`, width: `${width}%`, minHeight: "32px" }}
      onClick={() => onSelect(appointment)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(appointment);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${appointment.customer.name}, ${appointment.startTime}–${appointment.endTime}, ${t(config.labelKey)}`}
    >
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <p className="truncate text-xs font-semibold">{appointment.customer.name}</p>
        <span className={`${config.badgeClassName} shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold`}>{t(config.labelKey)}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] text-muted-foreground">{appointment.services.map((service) => service.serviceName).join(", ") || t("details.noServices")}</p>
        <p className={`shrink-0 font-mono text-[12px] font-semibold ${config.timeClassName}`}>{appointment.startTime} · {t("details.minutes", { count: duration })}</p>
      </div>
    </div>
  );
}

export function ScheduleGrid({
  lanes,
  openMinutes,
  closeMinutes,
  timezone,
  isLoading,
  error,
  isWorkDay,
  hasValidSchedule,
  message,
  hasFilteredResults,
  hasFilters,
  onRetry,
  onSelect,
}: ScheduleGridProps) {
  const { t } = useTranslation("appointment");
  const calendarMinutes = Math.max(closeMinutes - openMinutes, 1);
  const gridColumns = `64px repeat(${Math.max(lanes.length, 1)}, minmax(180px, 1fr))`;
  const timeRows = Array.from(
    { length: Math.max(Math.ceil(calendarMinutes / 60), 1) },
    (_, index) => openMinutes + index * 60,
  );

  if (isLoading) {
    return <Card className="min-h-[28rem] gap-3 p-6"><div role="status" aria-live="polite" className="space-y-3">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-16 w-full" />)}</div></Card>;
  }
  if (error) {
    return <Card className="flex min-h-[28rem] flex-col items-center justify-center gap-3 p-6 text-center"><Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert><Button type="button" variant="outline" className="min-h-11" onClick={onRetry}>{t("toolbar.retry")}</Button></Card>;
  }
  if (!isWorkDay || !hasValidSchedule) {
    return <Card className="flex min-h-[28rem] flex-col items-center justify-center gap-2 p-6 text-center"><CalendarDays className="size-8 text-muted-foreground" aria-hidden="true" /><p className="font-semibold">{isWorkDay ? t("toolbar.noSchedule") : t("toolbar.closed")}</p>{message ? <p className="max-w-md text-sm text-muted-foreground">{message}</p> : null}</Card>;
  }
  if (!hasFilteredResults) {
    return <Card className="flex min-h-[28rem] flex-col items-center justify-center gap-2 p-6 text-center"><CalendarDays className="size-8 text-muted-foreground" aria-hidden="true" /><p className="font-semibold">{hasFilters ? t("toolbar.noFilteredAppointments") : t("toolbar.noAppointments")}</p></Card>;
  }

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl py-0 shadow-xs">
      <div className="max-h-[calc(100dvh-14rem)] min-h-[28rem] overflow-auto">
        <div className="min-w-max">
          <div className="sticky top-0 z-20 grid border-b border-border bg-card" style={{ gridTemplateColumns: gridColumns }}>
            <div className="sticky left-0 z-30 flex h-[72px] items-center justify-center border-r border-border bg-card px-2 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{timezone ?? t("toolbar.datePicker")}</div>
            {lanes.map((lane) => (
              <div className="flex h-[72px] items-center gap-3 border-r border-border px-4" key={lane.key}>
                {lane.staff ? <StaffAvatar initials={lane.label.charAt(0).toUpperCase()} avatarUrl={lane.staff.avatarUrl ?? lane.staff.user?.avatarUrl} alt={lane.label} className="size-10" /> : <Avatar className="size-10"><AvatarFallback>?</AvatarFallback></Avatar>}
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{lane.label}</p><p className="truncate text-xs text-muted-foreground">{lane.staff ? t(`roles.${lane.staff.role.toLowerCase()}`, { defaultValue: t("roles.staff") }) : t("toolbar.unassigned")}</p></div>
              </div>
            ))}
          </div>
          <div className="relative grid min-h-[800px] bg-card" style={{ gridTemplateColumns: gridColumns }}>
            <div className="sticky left-0 z-10 grid border-r border-border bg-muted/15" style={{ gridTemplateRows: `repeat(${timeRows.length}, minmax(0, 1fr))` }}>
              {timeRows.map((time) => <div key={time} className="border-b border-border/70 pr-3 pt-2 text-right font-mono text-[11px] text-muted-foreground">{formatTimeLabel(time)}</div>)}
            </div>
            {lanes.map((lane) => {
              const layout = getOverlappingAppointmentLayout(lane.appointments);
              return <div className="relative grid border-r border-border" style={{ gridTemplateRows: `repeat(${timeRows.length}, minmax(0, 1fr))` }} key={lane.key}>
                {timeRows.map((time) => <div key={time} className="border-b border-border/70 transition-colors hover:bg-muted/35" />)}
                {lane.appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} laneLayout={layout.get(appointment.id) ?? { column: 0, columns: 1 }} openMinutes={openMinutes} calendarMinutes={calendarMinutes} onSelect={onSelect} />)}
              </div>;
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
