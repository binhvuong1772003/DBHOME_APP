import { ArrowLeft, CalendarDays, CreditCard, History, Mail, Repeat2, Scissors } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatCustomerDate, formatCustomerDateTime, getCustomerInitials } from "../utils/customerFormat";
import { getCustomerStaffName } from "../utils/customerFormat";
import { useCustomerDetail } from "../hooks/useCustomerDetail";
import type { CustomerAppointment, CustomerDetail } from "../types/customer";
import { appointmentStatusConfig, type AppointmentStatus } from "@/features/shop/admin/appointment/constants/appointmentStatus";

export function CustomerDetailPageContent() {
  const { t, i18n } = useTranslation("customers");
  const { t: tAppointment } = useTranslation("appointment");
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const data = useCustomerDetail(customerId);
  const locale = i18n.resolvedLanguage?.startsWith("vi") ? "vi-VN" : "en-US";
  if (data.isLoading) return <CustomerDetailSkeleton />;
  if (data.error || !data.customer) return <main className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 lg:p-8"><Card><CardContent className="flex min-h-64 flex-col items-center justify-center text-center"><p className="font-semibold">{t("detail.loadError")}</p><p className="mt-2 max-w-md text-sm text-muted-foreground">{data.error}</p><Button type="button" variant="outline" className="mt-4 min-h-11" onClick={() => void data.refetch()}>{t("retry")}</Button></CardContent></Card></main>;
  const customer = data.customer;
  return <main className="min-h-full bg-background text-foreground"><div className="mx-auto w-full max-w-[1480px] space-y-6 p-4 sm:p-6 lg:p-8"><Button type="button" variant="ghost" className="min-h-11 gap-2 px-0" onClick={() => navigate(`/shops/${data.shopSlug}/admin/customers`)}><ArrowLeft aria-hidden="true" />{t("detail.back")}</Button><CustomerDetailHeader customer={customer} locale={locale} /><CustomerValueSummary customer={customer} locale={locale} /><div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]"><div className="space-y-5"><UpcomingAppointments customer={customer} locale={locale} tAppointment={tAppointment} /><VisitHistory customer={customer} locale={locale} tAppointment={tAppointment} /></div><div className="space-y-5"><RetentionSection customer={customer} locale={locale} /><RelationshipSection customer={customer} /></div></div></div></main>;
}

function CustomerDetailHeader({ customer, locale }: { customer: CustomerDetail; locale: string }) {
  const { t } = useTranslation("customers");
  return <header className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex min-w-0 items-center gap-4"><Avatar className="size-16"><AvatarImage src={customer.avatarUrl ?? undefined} alt={customer.name} /><AvatarFallback className="text-lg">{getCustomerInitials(customer.name)}</AvatarFallback></Avatar><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h1 className="truncate text-2xl font-semibold tracking-tight">{customer.name}</h1><Badge variant={customer.retentionStatus === "RETURNING" ? "secondary" : "outline"}>{t(`retention.${customer.retentionStatus.toLowerCase()}`)}</Badge></div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Mail className="size-4" aria-hidden="true" />{customer.email || t("detail.noEmail")}</span><span>{t("detail.customerSince", { date: formatCustomerDate(customer.customerSince, locale) })}</span></div></div></div></header>;
}

function CustomerValueSummary({ customer, locale }: { customer: CustomerDetail; locale: string }) {
  const { t } = useTranslation("customers");
  const values = [["lifetimeSpend", formatCurrency(customer.totalSpent, locale)], ["visits", customer.totalVisits.toLocaleString(locale)], ["averageSpend", formatCurrency(customer.averageSpend, locale)], ["lastVisit", formatCustomerDate(customer.lastVisitAt, locale)]] as const;
  return <section aria-label={t("detail.valueTitle")} className="grid grid-cols-2 gap-3 lg:grid-cols-4">{values.map(([key, value]) => <Card key={key} className="gap-0 py-0 shadow-xs"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{t(`detail.metrics.${key}`)}</p><p className="mt-2 text-lg font-semibold tabular-nums">{value}</p></CardContent></Card>)}</section>;
}

function UpcomingAppointments({ customer, locale, tAppointment }: { customer: CustomerDetail; locale: string; tAppointment: (key: string, options?: Record<string, unknown>) => string }) {
  const { t } = useTranslation("customers");
  return <Card className="gap-0 py-0 shadow-xs"><CardHeader className="p-5 pb-3"><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="size-4 text-primary" aria-hidden="true" />{t("detail.upcomingTitle")}</CardTitle></CardHeader><CardContent className="p-5 pt-0">{customer.upcomingAppointments.length === 0 ? <p className="rounded-lg bg-muted/35 p-4 text-sm text-muted-foreground">{t("detail.noUpcoming")}</p> : <div className="divide-y">{customer.upcomingAppointments.map((appointment) => <div key={appointment.id} className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold">{formatCustomerDateTime(appointment.date, appointment.startTime, locale)}</p><p className="mt-1 text-sm text-muted-foreground">{appointment.services.map((service) => service.serviceName).join(", ") || t("detail.noServices")}</p></div><div className="flex flex-wrap items-center gap-2"><StatusBadge status={appointment.status} label={tAppointment(getAppointmentStatusKey(appointment.status))} /><p className="text-sm text-muted-foreground">{getCustomerStaffName(appointment.staff, t("detail.unassigned"))}</p></div></div>)}</div>}</CardContent></Card>;
}

function RetentionSection({ customer, locale }: { customer: CustomerDetail; locale: string }) {
  const { t } = useTranslation("customers");
  return <Card className="gap-0 py-0 shadow-xs"><CardHeader className="p-5 pb-3"><CardTitle className="flex items-center gap-2 text-base"><Repeat2 className="size-4 text-primary" aria-hidden="true" />{t("detail.retentionTitle")}</CardTitle></CardHeader><CardContent className="space-y-3 p-5 pt-0"><div className="flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">{t("columns.retention")}</span><Badge variant={customer.retentionStatus === "RETURNING" ? "secondary" : "outline"}>{t(`retention.${customer.retentionStatus.toLowerCase()}`)}</Badge></div><Separator /><div className="flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">{t("detail.lastVisit")}</span><span className="text-sm font-medium tabular-nums">{formatCustomerDate(customer.lastVisitAt, locale)}</span></div><div className="flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">{t("detail.daysSinceLastVisit")}</span><span className="text-sm font-medium tabular-nums">{customer.daysSinceLastVisit == null ? t("detail.noVisit") : t("lastVisit.daysAgo", { count: customer.daysSinceLastVisit })}</span></div></CardContent></Card>;
}

function RelationshipSection({ customer }: { customer: CustomerDetail }) {
  const { t } = useTranslation("customers");
  return <Card className="gap-0 py-0 shadow-xs"><CardHeader className="p-5 pb-3"><CardTitle className="flex items-center gap-2 text-base"><Scissors className="size-4 text-primary" aria-hidden="true" />{t("detail.relationshipTitle")}</CardTitle></CardHeader><CardContent className="space-y-5 p-5 pt-0"><div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("detail.servicesTitle")}</p>{customer.mostBookedServices.length ? <div className="mt-2 space-y-2">{customer.mostBookedServices.map((service) => <div key={service.name} className="flex items-center justify-between gap-3 text-sm"><span className="truncate">{service.name}</span><span className="shrink-0 text-muted-foreground tabular-nums">{t("detail.visitsCount", { count: service.visits })}</span></div>)}</div> : <p className="mt-2 text-sm text-muted-foreground">{t("detail.noServices")}</p>}</div><div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("detail.staffTitle")}</p>{customer.mostVisitedStaff.length ? <div className="mt-2 space-y-2">{customer.mostVisitedStaff.map((staff) => <div key={staff.id} className="flex items-center justify-between gap-3 text-sm"><span className="truncate">{staff.name}</span><span className="shrink-0 text-muted-foreground tabular-nums">{t("detail.visitsCount", { count: staff.visits })}</span></div>)}</div> : <p className="mt-2 text-sm text-muted-foreground">{t("detail.noStaff")}</p>}</div></CardContent></Card>;
}

function VisitHistory({ customer, locale, tAppointment }: { customer: CustomerDetail; locale: string; tAppointment: (key: string, options?: Record<string, unknown>) => string }) {
  const { t } = useTranslation("customers");
  return <Card className="gap-0 overflow-hidden py-0 shadow-xs"><CardHeader className="p-5 pb-3"><CardTitle className="flex items-center gap-2 text-base"><History className="size-4 text-primary" aria-hidden="true" />{t("detail.historyTitle")}</CardTitle></CardHeader><CardContent className="p-0"><div className="divide-y">{customer.appointments.length ? customer.appointments.map((appointment) => <AppointmentHistoryRow key={appointment.id} appointment={appointment} locale={locale} tAppointment={tAppointment} />) : <p className="p-5 text-sm text-muted-foreground">{t("detail.noHistory")}</p>}</div></CardContent></Card>;
}

function AppointmentHistoryRow({ appointment, locale, tAppointment }: { appointment: CustomerAppointment; locale: string; tAppointment: (key: string, options?: Record<string, unknown>) => string }) {
  const { t } = useTranslation("customers");
  return <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-sm font-semibold">{formatCustomerDateTime(appointment.date, appointment.startTime, locale)}</p><p className="mt-1 truncate text-sm text-muted-foreground">{appointment.services.map((service) => service.serviceName).join(", ") || t("detail.noServices")}</p><div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-xs text-muted-foreground">{getCustomerStaffName(appointment.staff, t("detail.unassigned"))}</span><StatusBadge status={appointment.status} label={tAppointment(getAppointmentStatusKey(appointment.status))} /></div></div><div className="flex items-center gap-3 sm:text-right"><div><p className="text-sm font-semibold tabular-nums">{formatCurrency(appointment.totalAmount, locale)}</p>{appointment.payment && <div className="mt-1 flex flex-wrap items-center justify-end gap-2 text-xs text-muted-foreground"><PaymentStatusBadge status={appointment.payment.status} label={t(getPaymentStatusKey(appointment.payment.status))} /><span>{t(getPaymentMethodKey(appointment.payment.method))}</span></div>}</div><CreditCard className="size-4 text-muted-foreground" aria-hidden="true" /></div></div>;
}

function getAppointmentStatusKey(status: string) {
  return appointmentStatusConfig[status as AppointmentStatus]?.labelKey ?? "status.unknown";
}

function getPaymentStatusKey(status: string) {
  return ["PENDING", "PARTIAL", "PAID", "REFUNDED"].includes(status) ? `paymentStatus.${status.toLowerCase()}` : "paymentStatus.unknown";
}

function getPaymentMethodKey(method: string) {
  return ["CASH", "MOMO", "VNPAY", "ZALO_PAY", "CARD", "TRANSFER"].includes(method) ? `paymentMethod.${method.toLowerCase()}` : "paymentMethod.unknown";
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const config = appointmentStatusConfig[status as AppointmentStatus];
  return <Badge variant="outline" className={config?.statusClassName ?? "border-border bg-muted text-muted-foreground"}>{label}</Badge>;
}

function PaymentStatusBadge({ status, label }: { status: string; label: string }) {
  const className = status === "PAID" ? "border-success/30 bg-success/10 text-success" : status === "REFUNDED" ? "border-border bg-muted text-muted-foreground" : "border-warning/30 bg-warning/10 text-warning";
  return <Badge variant="outline" className={className}>{label}</Badge>;
}

function CustomerDetailSkeleton() { return <main className="mx-auto w-full max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-8"><Skeleton className="h-10 w-28" /><Skeleton className="h-28 w-full rounded-xl" /><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-24 rounded-xl" />)}</div><Skeleton className="h-80 w-full rounded-xl" /></main>; }
