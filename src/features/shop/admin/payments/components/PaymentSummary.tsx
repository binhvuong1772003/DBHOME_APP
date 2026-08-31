import { CircleDollarSign, CircleEllipsis, CreditCard, ReceiptText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/features/shop/admin/financial-report/utils/formatCurrency";
import type { PaymentSummary as PaymentSummaryValue } from "../types/payment";

export function PaymentSummary({ summary, isLoading }: { summary: PaymentSummaryValue; isLoading: boolean }) {
  const { t, i18n } = useTranslation("payments");
  const cards = [
    { label: t("summary.collected"), value: formatCurrency(summary.totalCollected, i18n.language), icon: CircleDollarSign },
    { label: t("summary.transactions"), value: summary.transactions.toLocaleString(i18n.language), icon: ReceiptText },
    { label: t("summary.paid"), value: summary.statusCounts.PAID.toLocaleString(i18n.language), icon: CreditCard },
    {
      label: t("summary.open"),
      value: (summary.statusCounts.PENDING + summary.statusCounts.PARTIAL).toLocaleString(i18n.language),
      description: t("summary.openDescription", { pending: summary.statusCounts.PENDING, partial: summary.statusCounts.PARTIAL }),
      icon: CircleEllipsis,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={t("summary.label")}>
      {cards.map((card) => (
        <Card key={card.label} className="gap-0 py-4 shadow-sm">
          <CardContent className="flex items-start justify-between gap-3 px-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
              {isLoading ? <Skeleton className="mt-2 h-7 w-28" /> : <p className="mt-1 truncate text-xl font-semibold tracking-tight">{card.value}</p>}
              {card.description && !isLoading ? <p className="mt-1 text-xs text-muted-foreground">{card.description}</p> : null}
            </div>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <card.icon className="size-4" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
