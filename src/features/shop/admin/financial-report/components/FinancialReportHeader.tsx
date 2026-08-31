import { CalendarDays, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  FinancialReportPreset,
  FinancialReportRange,
} from "../types/financialReport";

interface FinancialReportHeaderProps {
  preset: FinancialReportPreset;
  range: FinancialReportRange;
  isLoading: boolean;
  rangeError: string | null;
  onPresetChange: (preset: FinancialReportPreset) => void;
  onRangeChange: (range: FinancialReportRange) => void;
  onApplyRange: () => void;
  onRefresh: () => void;
}

export function FinancialReportHeader({
  preset,
  range,
  isLoading,
  rangeError,
  onPresetChange,
  onRangeChange,
  onApplyRange,
  onRefresh,
}: FinancialReportHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Finance</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Financial Report
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Track revenue, expenses, payroll costs and business performance.
        </p>
      </div>

      <form
        className="grid gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-xs md:grid-cols-[minmax(170px,1.15fr)_minmax(150px,1fr)_minmax(150px,1fr)_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          onApplyRange();
        }}
      >
        <div className="min-w-44 space-y-1.5">
          <label
            htmlFor="financial-period"
            className="text-xs font-medium text-muted-foreground"
          >
            Reporting period
          </label>
          <Select
            value={preset}
            onValueChange={(value) =>
              onPresetChange(value as FinancialReportPreset)
            }
          >
            <SelectTrigger id="financial-period" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="THIS_MONTH">This month</SelectItem>
              <SelectItem value="PREVIOUS_MONTH">Previous month</SelectItem>
              <SelectItem value="THIS_QUARTER">This quarter</SelectItem>
              <SelectItem value="PREVIOUS_QUARTER">Previous quarter</SelectItem>
              <SelectItem value="CUSTOM">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="financial-period-start"
            className="text-xs font-medium text-muted-foreground"
          >
            From
          </label>
          <Input
            id="financial-period-start"
            type="date"
            value={range.start}
            onChange={(event) => {
              onRangeChange({ ...range, start: event.target.value });
              if (preset !== "CUSTOM") onPresetChange("CUSTOM");
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="financial-period-end"
            className="text-xs font-medium text-muted-foreground"
          >
            To
          </label>
          <Input
            id="financial-period-end"
            type="date"
            value={range.end}
            onChange={(event) => {
              onRangeChange({ ...range, end: event.target.value });
              if (preset !== "CUSTOM") onPresetChange("CUSTOM");
            }}
          />
        </div>
        <div className="flex gap-2 md:col-span-1">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-h-9 flex-1 sm:flex-none"
          >
            <CalendarDays aria-hidden="true" />
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Refresh financial report"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={isLoading ? "animate-spin" : ""}
              aria-hidden="true"
            />
          </Button>
        </div>
        {rangeError && (
          <p className="text-xs text-destructive md:col-span-4" role="alert">
            {rangeError}
          </p>
        )}
      </form>
    </header>
  );
}
