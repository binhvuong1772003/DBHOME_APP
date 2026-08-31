import { CalendarCheck2, CircleDollarSign, ReceiptText, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FinancialPeriodData, FinancialReportResponse } from "../types/financialReport";
import { formatCurrency, formatPercentage, percentageChange } from "../utils/formatCurrency";

function SummaryMetric({
  label,
  value,
  comparison,
  description,
  icon: Icon,
  emphasis = false,
}: {
  label: string;
  value: string;
  comparison: number | null;
  description: string;
  icon: typeof WalletCards;
  emphasis?: boolean;
}) {
  return (
    <Card className={`gap-0 border-border/80 py-0 shadow-xs ${emphasis ? "border-primary/30" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <Icon className="size-5 text-primary" aria-hidden="true" />
        </div>
        <p className={`mt-3 truncate font-bold tracking-tight tabular-nums ${emphasis ? "text-2xl text-primary" : "text-xl text-foreground"}`}>
          {value}
        </p>
        <div className="mt-3 flex min-h-5 items-center gap-2 text-xs">
          {comparison !== null && (
            <Badge className={comparison >= 0 ? "border-secondary/20 bg-secondary/10 text-secondary" : "border-destructive/20 bg-destructive/10 text-destructive"}>
              {formatPercentage(comparison)}
            </Badge>
          )}
          <span className="truncate text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialSummary({
  current,
  previous,
}: {
  current: FinancialPeriodData;
  previous: FinancialReportResponse["previous"];
}) {
  return (
    <section aria-labelledby="financial-summary-heading">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 id="financial-summary-heading" className="text-base font-semibold tracking-tight">
            Financial summary
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A concise view of the selected reporting period.
          </p>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:block">Compared with previous period</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric
          label="Revenue"
          value={formatCurrency(current.revenue)}
          comparison={percentageChange(current.revenue, previous.revenue)}
          description="Paid completed appointments"
          icon={CircleDollarSign}
          emphasis
        />
        <SummaryMetric
          label="Payroll cost"
          value={formatCurrency(current.payroll?.cost)}
          comparison={percentageChange(current.payroll?.cost, previous.payrollCost)}
          description={current.payroll ? `${current.payroll.records} payroll records` : "Payroll data unavailable"}
          icon={WalletCards}
        />
        <SummaryMetric
          label="Revenue after payroll"
          value={formatCurrency(current.revenueAfterPayroll)}
          comparison={percentageChange(current.revenueAfterPayroll, previous.revenueAfterPayroll)}
          description="Estimated · tracked costs only"
          icon={ReceiptText}
          emphasis
        />
        <SummaryMetric
          label="Completed appointments"
          value={current.completedAppointments.toLocaleString("vi-VN")}
          comparison={percentageChange(current.completedAppointments, previous.completedAppointments)}
          description={`Average ticket ${formatCurrency(current.averageTicket)}`}
          icon={CalendarCheck2}
        />
      </div>
    </section>
  );
}
