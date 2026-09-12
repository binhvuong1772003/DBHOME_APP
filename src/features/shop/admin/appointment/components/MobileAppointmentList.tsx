import { CalendarClock, Clock3, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Appointment } from "../type/appointment";
import { appointmentStatusConfig } from "../constants/appointmentStatus";

interface MobileAppointmentListProps {
  appointments: Appointment[];
  staffNames: Map<string, string>;
  hasFilters: boolean;
  onSelect: (appointment: Appointment) => void;
}

export function MobileAppointmentList({ appointments, staffNames, hasFilters, onSelect }: MobileAppointmentListProps) {
  const { t } = useTranslation("appointment");
  const sortedAppointments = [...appointments].sort((a, b) => a.startTime.localeCompare(b.startTime));
  if (sortedAppointments.length === 0) {
    return <Card className="flex min-h-[20rem] items-center justify-center p-6 text-center"><p className="text-sm font-medium text-muted-foreground">{hasFilters ? t("toolbar.noFilteredAppointments") : t("toolbar.noAppointments")}</p></Card>;
  }
  return <div className="space-y-3">
    {sortedAppointments.map((appointment) => {
      const config = appointmentStatusConfig[appointment.status] ?? appointmentStatusConfig.PENDING;
      const staffName = appointment.staffId ? staffNames.get(appointment.staffId) : undefined;
      return <button key={appointment.id} type="button" className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => onSelect(appointment)}>
        <Card className="transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-sm">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{appointment.customer.name}</p><p className="mt-1 text-xs text-muted-foreground">#{appointment.id}</p></div><Badge variant="outline" className={config.statusClassName}>{t(config.labelKey)}</Badge></div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1.5"><CalendarClock className="size-4" aria-hidden="true" />{appointment.startTime}–{appointment.endTime}</span><span className="inline-flex min-w-0 items-center gap-1.5"><Clock3 className="size-4" aria-hidden="true" />{appointment.services.map((service) => service.serviceName).join(", ") || t("details.noServices")}</span></div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><UserRound className="size-4" aria-hidden="true" />{staffName ?? t("details.unassigned")}</div>
          </CardContent>
        </Card>
      </button>;
    })}
  </div>;
}
