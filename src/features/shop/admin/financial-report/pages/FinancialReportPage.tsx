import { RefreshCw, WalletCards } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FinancialBreakdowns } from "../components/FinancialBreakdowns";
import { FinancialReportHeader } from "../components/FinancialReportHeader";
import { FinancialReportSkeleton } from "../components/FinancialReportSkeleton";
import { FinancialSummary } from "../components/FinancialSummary";
import { PayrollCostSummary } from "../components/PayrollCostSummary";
import { PerformanceSummary } from "../components/PerformanceSummary";
import { RevenueOverview } from "../components/RevenueOverview";
import { useFinancialReport } from "../hooks/useFinancialReport";

export default function FinancialReportPage() {
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const {
    report,
    isLoading,
    error,
    rangeError,
    preset,
    range,
    setRange,
    handlePresetChange,
    handleApplyRange,
    refetch,
  } = useFinancialReport();

  return (
    <main className="min-h-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1500px] space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
        <FinancialReportHeader
          preset={preset}
          range={range}
          isLoading={isLoading}
          rangeError={rangeError}
          onPresetChange={handlePresetChange}
          onRangeChange={setRange}
          onApplyRange={handleApplyRange}
          onRefresh={() => void refetch()}
        />

        {isLoading && <FinancialReportSkeleton />}

        {!isLoading && error && (
          <Card className="border-border/80 shadow-xs">
            <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
              <WalletCards
                className="size-9 text-destructive"
                aria-hidden="true"
              />
              <h2 className="mt-4 font-semibold">
                Unable to load financial report
              </h2>
              <p
                role="alert"
                className="mt-2 max-w-md text-sm text-muted-foreground"
              >
                {error}
              </p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => void refetch()}
              >
                <RefreshCw aria-hidden="true" />
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && report && !report.current.dataAvailable && (
          <Card className="border-border/80 shadow-xs">
            <CardContent className="flex min-h-72 flex-col items-center justify-center text-center">
              <WalletCards
                className="size-9 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="mt-4 font-semibold">
                No financial data available for this period.
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Try selecting another date range. The report includes paid
                completed appointments and confirmed or paid payroll records.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && report?.current.dataAvailable && (
          <>
            <FinancialSummary
              current={report.current}
              previous={report.previous}
            />
            <RevenueOverview
              current={report.current}
              previous={report.previous}
            />
            <FinancialBreakdowns current={report.current} />
            <PayrollCostSummary current={report.current} shopSlug={shopSlug} />
            <PerformanceSummary current={report.current} />
          </>
        )}
      </div>
    </main>
  );
}
