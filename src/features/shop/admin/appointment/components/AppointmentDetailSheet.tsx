import { CalendarDays, Clock3, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AppointmentStatusDropdown } from "./AppointmentStatusDropdown";
import { AppointmentPaymentSection } from "./AppointmentPaymentSection";
import type { Appointment } from "../type/appointment";
import type { AppointmentStatusUpdate } from "../constants/appointmentStatus";

interface AppointmentDetailSheetProps {
  appointment: Appointment | null;
  shopSlug: string;
  staffName: string;
  canManage: boolean;
  isChanging: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (input: AppointmentStatusUpdate) => Promise<boolean | void>;
  onRefresh: () => Promise<void>;
}

const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

export function AppointmentDetailSheet({ appointment, shopSlug, staffName, canManage, isChanging, onOpenChange, onStatusChange, onRefresh }: AppointmentDetailSheetProps) {
  const { t, i18n } = useTranslation("appointment");
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  return (
    <Sheet open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {appointment ? (
          <>
            <SheetHeader className="border-b border-border px-5 pb-4">
              <SheetTitle>{t("details.title")}</SheetTitle>
              <SheetDescription>{t("details.eyebrow")} · #{appointment.id}</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 px-5 pb-6">
              <div className="flex items-center gap-3">
                <Avatar className="size-12"><AvatarImage src={appointment.customer.avatarUrl ?? undefined} alt={appointment.customer.name} /><AvatarFallback>{appointment.customer.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1"><p className="truncate font-semibold">{appointment.customer.name}</p><p className="truncate text-sm text-muted-foreground">{appointment.customer.phone ?? appointment.customer.email ?? t("details.noPhone")}</p></div>
                <AppointmentStatusDropdown status={appointment.status} disabled={isChanging || !canManage} onStatusChange={onStatusChange} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg border border-border bg-muted/25 p-3"><CalendarDays className="mb-2 size-4 text-primary" aria-hidden="true" /><p className="text-xs text-muted-foreground">{t("details.date")}</p><p className="mt-1 font-medium">{new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${appointment.date}T12:00:00`))}</p></div>
                <div className="rounded-lg border border-border bg-muted/25 p-3"><Clock3 className="mb-2 size-4 text-primary" aria-hidden="true" /><p className="text-xs text-muted-foreground">{t("details.time")}</p><p className="mt-1 font-mono font-medium">{appointment.startTime}–{appointment.endTime}</p></div>
              </div>
              <div className="flex items-center gap-2 text-sm"><UserRound className="size-4 text-muted-foreground" aria-hidden="true" /><span className="text-muted-foreground">{t("details.staff")}:</span><span className="font-medium">{staffName}</span></div>
              <Separator />
              <section aria-labelledby="mobile-appointment-services">
                <h2 id="mobile-appointment-services" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("details.bookedServices")}</h2>
                <div className="mt-3 space-y-2">{appointment.services.map((service) => <div key={service.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm"><span className="min-w-0 truncate">{service.serviceName}</span><span className="shrink-0 tabular-nums">{formatCurrency(service.priceAtBooking, locale)}</span></div>)}</div>
              </section>
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-3 text-sm font-semibold"><span>{t("details.total")}</span><span className="tabular-nums text-primary">{formatCurrency(appointment.totalAmount, locale)}</span></div>
              <AppointmentPaymentSection shopSlug={shopSlug} appointment={appointment} staffName={staffName} canManage={canManage} onAppointmentRefresh={onRefresh} />
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
