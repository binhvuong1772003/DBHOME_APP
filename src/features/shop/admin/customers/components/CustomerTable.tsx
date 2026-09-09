import { ChevronLeft, ChevronRight, Eye, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatCustomerDate, formatCustomerDateTime, getCustomerInitials } from "../utils/customerFormat";
import type { CustomerListItem, CustomerListMeta } from "../types/customer";

interface CustomerTableProps {
  customers: CustomerListItem[];
  meta: CustomerListMeta;
  locale: string;
  isLoading: boolean;
  onSelect: (customerId: string) => void;
  onPageChange: (page: number) => void;
}

export function CustomerTable({ customers, meta, locale, isLoading, onSelect, onPageChange }: CustomerTableProps) {
  const { t } = useTranslation("customers");
  if (isLoading) return <CustomerTableSkeleton />;
  if (!customers.length) {
    return <Card className="shadow-xs"><CardContent className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground"><UserRound aria-hidden="true" /></div><h2 className="mt-4 font-semibold">{t("empty.title")}</h2><p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("empty.description")}</p></CardContent></Card>;
  }
  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-xs">
      <div className="hidden lg:block">
        <Table>
          <TableHeader><TableRow className="hover:bg-transparent"><TableHead>{t("columns.customer")}</TableHead><TableHead>{t("columns.lastVisit")}</TableHead><TableHead className="text-center">{t("columns.visits")}</TableHead><TableHead className="text-right">{t("columns.lifetimeSpend")}</TableHead><TableHead className="text-right">{t("columns.averageSpend")}</TableHead><TableHead>{t("columns.nextAppointment")}</TableHead><TableHead>{t("columns.retention")}</TableHead><TableHead className="w-16 text-right">{t("columns.actions")}</TableHead></TableRow></TableHeader>
          <TableBody>{customers.map((customer) => <CustomerRow key={customer.id} customer={customer} locale={locale} onSelect={onSelect} />)}</TableBody>
        </Table>
      </div>
      <div className="divide-y lg:hidden">{customers.map((customer) => <CustomerCard key={customer.id} customer={customer} locale={locale} onSelect={onSelect} />)}</div>
      <div className="flex items-center justify-between gap-3 border-t px-4 py-3"><p className="text-xs text-muted-foreground">{t("pagination.page", { page: meta.page, total: meta.totalPages })}</p><div className="flex gap-1"><Button type="button" variant="outline" size="icon-sm" disabled={!meta.hasPrev} aria-label={t("pagination.previous")} onClick={() => onPageChange(meta.page - 1)}><ChevronLeft aria-hidden="true" /></Button><Button type="button" variant="outline" size="icon-sm" disabled={!meta.hasNext} aria-label={t("pagination.next")} onClick={() => onPageChange(meta.page + 1)}><ChevronRight aria-hidden="true" /></Button></div></div>
    </Card>
  );
}

function CustomerRow({ customer, locale, onSelect }: { customer: CustomerListItem; locale: string; onSelect: (id: string) => void }) {
  const { t } = useTranslation("customers");
  return <TableRow tabIndex={0} className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" onClick={() => onSelect(customer.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(customer.id); } }}>
    <TableCell><CustomerPerson customer={customer} /></TableCell>
    <TableCell><p className="text-sm font-medium tabular-nums">{formatCustomerDate(customer.lastVisitAt, locale)}</p>{customer.daysSinceLastVisit != null && <p className="text-xs text-muted-foreground">{t("lastVisit.daysAgo", { count: customer.daysSinceLastVisit })}</p>}</TableCell>
    <TableCell className="text-center text-sm font-semibold tabular-nums">{customer.totalVisits}</TableCell>
    <TableCell className="text-right text-sm font-semibold tabular-nums">{formatCurrency(customer.totalSpent, locale)}</TableCell>
    <TableCell className="text-right text-sm tabular-nums">{formatCurrency(customer.averageSpend, locale)}</TableCell>
    <TableCell className="text-sm">{customer.nextAppointment ? formatCustomerDateTime(customer.nextAppointment.date, customer.nextAppointment.startTime, locale) : <span className="text-muted-foreground">{t("nextAppointment.none")}</span>}</TableCell>
    <TableCell><RetentionBadge status={customer.retentionStatus} /></TableCell>
    <TableCell className="text-right"><Button type="button" variant="ghost" size="icon-sm" aria-label={t("actions.view", { name: customer.name })} onClick={(event) => { event.stopPropagation(); onSelect(customer.id); }}><Eye aria-hidden="true" /></Button></TableCell>
  </TableRow>;
}

function CustomerCard({ customer, locale, onSelect }: { customer: CustomerListItem; locale: string; onSelect: (id: string) => void }) {
  const { t } = useTranslation("customers");
  return <button type="button" className="block w-full p-4 text-left transition-colors hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" onClick={() => onSelect(customer.id)}><div className="flex items-start justify-between gap-3"><CustomerPerson customer={customer} /><RetentionBadge status={customer.retentionStatus} /></div><dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><div><dt className="text-xs text-muted-foreground">{t("columns.visits")}</dt><dd className="mt-1 font-semibold tabular-nums">{customer.totalVisits}</dd></div><div><dt className="text-xs text-muted-foreground">{t("columns.lifetimeSpend")}</dt><dd className="mt-1 font-semibold tabular-nums">{formatCurrency(customer.totalSpent, locale)}</dd></div><div><dt className="text-xs text-muted-foreground">{t("columns.lastVisit")}</dt><dd className="mt-1 tabular-nums">{formatCustomerDate(customer.lastVisitAt, locale)}</dd></div><div><dt className="text-xs text-muted-foreground">{t("columns.nextAppointment")}</dt><dd className="mt-1 tabular-nums">{customer.nextAppointment ? formatCustomerDateTime(customer.nextAppointment.date, customer.nextAppointment.startTime, locale) : t("nextAppointment.none")}</dd></div></dl></button>;
}

function CustomerPerson({ customer }: { customer: CustomerListItem }) {
  return <div className="flex min-w-0 items-center gap-3"><Avatar className="size-10"><AvatarImage src={customer.avatarUrl ?? undefined} alt={customer.name} /><AvatarFallback>{getCustomerInitials(customer.name)}</AvatarFallback></Avatar><div className="min-w-0"><p className="max-w-48 truncate text-sm font-semibold">{customer.name}</p><p className="max-w-48 truncate text-xs text-muted-foreground">{customer.email ?? customer.phone ?? "—"}</p></div></div>;
}

function RetentionBadge({ status }: { status: CustomerListItem["retentionStatus"] }) {
  const { t } = useTranslation("customers");
  return <Badge variant={status === "RETURNING" ? "secondary" : "outline"}>{t(`retention.${status.toLowerCase()}`)}</Badge>;
}

function CustomerTableSkeleton() {
  return <Card className="gap-0 overflow-hidden py-0 shadow-xs"><CardContent className="space-y-3 p-4">{[0, 1, 2, 3, 4].map((row) => <div key={row} className="flex items-center gap-3 border-b border-border/70 py-3 last:border-0"><Skeleton className="size-10 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-36" /><Skeleton className="h-3 w-24" /></div><Skeleton className="h-5 w-24" /></div>)}</CardContent></Card>;
}
