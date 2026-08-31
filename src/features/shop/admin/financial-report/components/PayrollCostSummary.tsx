import { ArrowUpRight, CircleDollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FinancialPeriodData } from "../types/financialReport";
import { formatCurrency } from "../utils/formatCurrency";

export function PayrollCostSummary({
  current,
  shopSlug,
}: {
  current: FinancialPeriodData;
  shopSlug: string;
}) {
  const payroll = current.payroll;

  return (
    <section aria-labelledby="payroll-cost-heading">
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle id="payroll-cost-heading" className="text-lg tracking-tight">Payroll cost</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Cost composition from confirmed and paid payroll records.</p>
          </div>
          <CircleDollarSign className="size-5 text-primary" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          {!payroll ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Payroll data is not available for this period.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <PayrollValue label="Total payroll" value={payroll.cost} emphasis />
              <PayrollValue label="Base salary" value={payroll.baseSalary} />
              <PayrollValue label="Commission" value={payroll.commission} />
              <PayrollValue label="Bonus" value={payroll.bonus} />
              <PayrollValue label="Overtime" value={payroll.overtime} />
              <PayrollValue label="Deductions" value={-payroll.deductions} />
            </div>
          )}
          <div className="mt-5 flex justify-end">
            <Button asChild variant="outline" size="sm">
              <Link to={`/shops/${shopSlug}/admin/payroll`}>
                View payroll
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function PayrollValue({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-border/70 p-4 ${emphasis ? "bg-primary/5" : "bg-muted/30"}`}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`mt-2 font-semibold tabular-nums ${emphasis ? "text-lg text-primary" : "text-foreground"}`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
}
