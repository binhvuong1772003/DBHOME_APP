import { ChevronLeft, ChevronRight, CreditCard, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/features/shop/admin/financial-report/utils/formatCurrency";
import type { Payment, PaymentListMeta } from "../types/payment";
import { formatPaymentDate, getInitials, shortPaymentId } from "../utils/paymentFormatters";
import { PaymentMethodBadge } from "./PaymentMethodBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

interface Props {
  payments: Payment[];
  meta: PaymentListMeta;
  onSelect: (paymentId: string) => void;
  onPageChange: (page: number) => void;
}

export function PaymentTable({ payments, meta, onSelect, onPageChange }: Props) {
  const { t, i18n } = useTranslation("payments");

  if (!payments.length) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground"><CreditCard aria-hidden="true" /></div>
          <h2 className="mt-4 font-semibold">{t("emptyTitle")}</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("emptyDescription")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-sm">
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("columns.date")}</TableHead><TableHead>{t("columns.customer")}</TableHead>
              <TableHead>{t("columns.appointment")}</TableHead><TableHead>{t("columns.staff")}</TableHead>
              <TableHead className="text-right">{t("columns.amount")}</TableHead><TableHead>{t("columns.method")}</TableHead>
              <TableHead>{t("columns.status")}</TableHead><TableHead className="w-20 text-right">{t("columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => {
              const timestamp = formatPaymentDate(payment.paidAt ?? payment.createdAt, i18n.language);
              return (
                <TableRow
                  key={payment.id}
                  className="cursor-pointer focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  tabIndex={0}
                  onClick={() => onSelect(payment.id)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(payment.id); } }}
                >
                  <TableCell><p className="font-medium">{timestamp.date}</p><p className="text-xs text-muted-foreground">{timestamp.time}</p></TableCell>
                  <TableCell><Person person={payment.appointment.customer} /></TableCell>
                  <TableCell><span className="font-mono text-xs" title={payment.appointmentId}>{shortPaymentId(payment.appointmentId)}</span></TableCell>
                  <TableCell>{payment.appointment.staff ? <Person person={payment.appointment.staff} /> : <span className="text-muted-foreground">{t("detail.unassigned")}</span>}</TableCell>
                  <TableCell className="text-right"><Amount payment={payment} locale={i18n.language} /></TableCell>
                  <TableCell><PaymentMethodBadge method={payment.method} label={t(`methods.${payment.method.toLowerCase()}`)} /></TableCell>
                  <TableCell><PaymentStatusBadge status={payment.status} label={t(`statuses.${payment.status.toLowerCase()}`)} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" aria-label={t("view")} onClick={(event) => { event.stopPropagation(); onSelect(payment.id); }}><Eye aria-hidden="true" /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y lg:hidden">
        {payments.map((payment) => {
          const timestamp = formatPaymentDate(payment.paidAt ?? payment.createdAt, i18n.language);
          return (
            <button key={payment.id} type="button" className="block w-full p-4 text-left transition-colors hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" onClick={() => onSelect(payment.id)}>
              <div className="flex items-start justify-between gap-3"><Person person={payment.appointment.customer} /><PaymentStatusBadge status={payment.status} label={t(`statuses.${payment.status.toLowerCase()}`)} /></div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="space-y-1 text-xs text-muted-foreground"><p>{timestamp.date} · {timestamp.time}</p><p className="font-mono">{shortPaymentId(payment.appointmentId)}</p></div>
                <div className="text-right"><Amount payment={payment} locale={i18n.language} /><p className="mt-1 text-xs text-muted-foreground">{t(`methods.${payment.method.toLowerCase()}`)}</p></div>
              </div>
            </button>
          );
        })}
      </div>
      <Pagination meta={meta} onPageChange={onPageChange} />
    </Card>
  );
}

function Person({ person }: { person: Payment["appointment"]["customer"] }) {
  return <div className="flex min-w-0 items-center gap-2.5"><Avatar size="sm"><AvatarImage src={person.avatarUrl ?? undefined} alt="" /><AvatarFallback>{getInitials(person.name)}</AvatarFallback></Avatar><div className="min-w-0"><p className="max-w-40 truncate font-medium">{person.name}</p><p className="max-w-40 truncate text-xs text-muted-foreground">{person.email}</p></div></div>;
}

function Amount({ payment, locale }: { payment: Payment; locale: string }) {
  return <div><p className="font-semibold tabular-nums">{formatCurrency(payment.amount, locale)}</p>{payment.status === "PARTIAL" ? <p className="text-xs text-muted-foreground">{formatCurrency(payment.paidAmount, locale)}</p> : null}</div>;
}

function Pagination({ meta, onPageChange }: { meta: PaymentListMeta; onPageChange: (page: number) => void }) {
  const { t } = useTranslation("payments");
  return <div className="flex items-center justify-between gap-3 border-t px-4 py-3"><p className="text-xs text-muted-foreground">{t("page", { page: meta.page, total: meta.totalPages })}</p><div className="flex gap-1"><Button variant="outline" size="icon-sm" disabled={!meta.hasPrev} aria-label={t("previous")} onClick={() => onPageChange(meta.page - 1)}><ChevronLeft aria-hidden="true" /></Button><Button variant="outline" size="icon-sm" disabled={!meta.hasNext} aria-label={t("next")} onClick={() => onPageChange(meta.page + 1)}><ChevronRight aria-hidden="true" /></Button></div></div>;
}
