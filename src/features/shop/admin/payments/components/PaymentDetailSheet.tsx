import { useState } from "react";
import { AlertCircle, CalendarDays, Clock, ReceiptText, UserRound, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/features/shop/admin/financial-report/utils/formatCurrency";
import dayjs from "@/lib/dayjs";
import { usePaymentDetail } from "../hooks/usePaymentDetail";
import type { Payment } from "../types/payment";
import { formatPaymentDate, getInitials, shortPaymentId } from "../utils/paymentFormatters";
import { ConfirmPaymentDialog } from "./ConfirmPaymentDialog";
import { PaymentBreakdown } from "./PaymentBreakdown";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface Props {
  shopSlug: string;
  paymentId: string | null;
  onOpenChange: (open: boolean) => void;
  onPaymentUpdated: () => Promise<void> | void;
}

export function PaymentDetailSheet({ shopSlug, paymentId, onOpenChange, onPaymentUpdated }: Props) {
  const { t, i18n } = useTranslation("payments");
  const { payment, isLoading, error, refetch } = usePaymentDetail(shopSlug, paymentId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const afterConfirm = async () => {
    await Promise.all([refetch(), onPaymentUpdated()]);
    toast.success(t("confirm.success"));
  };

  return (
    <Sheet open={Boolean(paymentId)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="sticky top-0 z-10 border-b bg-background px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0"><SheetTitle className="text-lg">{t("detail.title")}{payment ? ` ${shortPaymentId(payment.id)}` : ""}</SheetTitle><SheetDescription>{payment ? t("detail.created", { date: formatTimestamp(payment.createdAt, i18n.language) }) : t("description")}</SheetDescription></div>
            <SheetClose asChild><Button variant="ghost" size="icon-sm" aria-label={t("close")}><X aria-hidden="true" /></Button></SheetClose>
          </div>
        </SheetHeader>
        {isLoading ? <DetailSkeleton /> : error || !payment ? <DetailError message={error ?? t("detail.loadError")} onRetry={() => void refetch()} /> : (
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg border bg-card p-4 shadow-sm">
              <div><p className="text-xs text-muted-foreground">{t("detail.amount")}</p><p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{formatCurrency(payment.amount, i18n.language)}</p></div>
              <PaymentStatusBadge status={payment.status} label={t(`statuses.${payment.status.toLowerCase()}`)} />
            </div>
            <StatusNotice payment={payment} />
            <Section title={t("detail.paymentInfo")} icon={ReceiptText}>
              <InfoGrid payment={payment} />
              {(payment.status === "PENDING" || payment.status === "PARTIAL") ? <Button className="mt-4 w-full sm:w-auto" onClick={() => setConfirmOpen(true)}>{t("confirm.action")}</Button> : null}
            </Section>
            <Section title={t("detail.customer")} icon={UserRound}>
              <PersonCard person={payment.appointment.customer} />
              <Separator className="my-4" />
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("detail.staff")}</p>
              {payment.appointment.staff ? <PersonCard person={payment.appointment.staff} /> : <p className="text-sm text-muted-foreground">{t("detail.unassigned")}</p>}
            </Section>
            <Section title={t("detail.appointment")} icon={CalendarDays}>
              <AppointmentInfo payment={payment} />
            </Section>
            <Section title={t("detail.breakdown")} icon={ReceiptText}>
              <PaymentBreakdown source={payment.appointment} />
            </Section>
          </div>
        )}
      </SheetContent>
      {payment && confirmOpen ? <ConfirmPaymentDialog shopSlug={shopSlug} payment={payment} open={confirmOpen} onOpenChange={setConfirmOpen} onSuccess={afterConfirm} /> : null}
    </Sheet>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof ReceiptText; children: React.ReactNode }) {
  return <section className="rounded-lg border bg-card p-4 shadow-sm"><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Icon className="size-4 text-muted-foreground" aria-hidden="true" />{title}</h2>{children}</section>;
}

function InfoGrid({ payment }: { payment: Payment }) {
  const { t, i18n } = useTranslation("payments");
  const paidAt = payment.paidAt ? formatTimestamp(payment.paidAt, i18n.language) : "—";
  const values = [[t("detail.amount"), formatCurrency(payment.amount, i18n.language)], [t("detail.paidAmount"), formatCurrency(payment.paidAmount, i18n.language)], [t("detail.method"), <PaymentMethodBadge key="method" method={payment.method} label={t(`methods.${payment.method.toLowerCase()}`)} />], [t("detail.status"), <PaymentStatusBadge key="status" status={payment.status} label={t(`statuses.${payment.status.toLowerCase()}`)} />], [t("detail.paidAt"), paidAt], [t("detail.reference"), payment.transactionId || t("detail.noReference")], [t("detail.note"), payment.note || t("detail.noNote")]] as const;
  return <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">{values.map(([label, value]) => <div key={label} className={label === t("detail.note") ? "sm:col-span-2" : ""}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{value}</dd></div>)}</dl>;
}

function PersonCard({ person }: { person: Payment["appointment"]["customer"] }) {
  return <div className="flex items-center gap-3"><Avatar size="lg"><AvatarImage src={person.avatarUrl ?? undefined} alt="" /><AvatarFallback>{getInitials(person.name)}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate font-medium">{person.name}</p><p className="truncate text-sm text-muted-foreground">{person.email}</p></div></div>;
}

function AppointmentInfo({ payment }: { payment: Payment }) {
  const { t, i18n } = useTranslation("payments");
  const appointment = payment.appointment;
  const services = [...appointment.services.map((item) => item.serviceName), ...appointment.packages.map((item) => item.package.name), ...appointment.addons.map((item) => item.addon.name)];
  return <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-mono text-xs" title={appointment.id}>{shortPaymentId(appointment.id)}</span><Badge className="border-border bg-muted text-muted-foreground">{t(`appointmentStatuses.${appointment.status.toLowerCase()}`)}</Badge></div><div className="flex items-start gap-2 text-sm"><Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span>{dayjs(appointment.date).locale(i18n.language).format("MMM D, YYYY")} · {dayjs(appointment.startTime).locale(i18n.language).format("LT")}–{dayjs(appointment.endTime).locale(i18n.language).format("LT")}</span></div><div><p className="text-xs text-muted-foreground">{t("detail.services")}</p><p className="mt-1 text-sm">{services.length ? services.join(", ") : "—"}</p></div></div>;
}

function StatusNotice({ payment }: { payment: Payment }) {
  const { t, i18n } = useTranslation("payments");
  if (payment.status === "PAID") return null;
  const remaining = Math.max(0, payment.amount - payment.paidAmount);
  const description = payment.status === "PENDING" ? t("detail.awaiting") : payment.status === "PARTIAL" ? t("detail.partial", { amount: formatCurrency(remaining, i18n.language) }) : t("detail.refunded");
  return <Alert><AlertCircle aria-hidden="true" /><AlertTitle>{t(`statuses.${payment.status.toLowerCase()}`)}</AlertTitle><AlertDescription>{description}</AlertDescription></Alert>;
}

function DetailSkeleton() { return <div className="space-y-4 p-6"><Skeleton className="h-24 w-full" /><Skeleton className="h-48 w-full" /><Skeleton className="h-36 w-full" /></div>; }
function DetailError({ message, onRetry }: { message: string; onRetry: () => void }) { const { t } = useTranslation("payments"); return <div className="p-6"><Alert variant="destructive"><AlertCircle aria-hidden="true" /><AlertTitle>{t("detail.loadError")}</AlertTitle><AlertDescription><p>{message}</p><Button className="mt-3" size="sm" variant="outline" onClick={onRetry}>{t("retry")}</Button></AlertDescription></Alert></div>; }
function formatTimestamp(value: string, locale: string) { const date = formatPaymentDate(value, locale); return `${date.date} · ${date.time}`; }
