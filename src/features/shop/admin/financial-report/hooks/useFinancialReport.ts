import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getFinancialReport } from "../services/financialReportService";
import type {
  FinancialReportPreset,
  FinancialReportRange,
  FinancialReportResponse,
} from "../types/financialReport";
import { getPresetRange } from "../utils/dateRange";

const defaultPreset: Exclude<FinancialReportPreset, "CUSTOM"> = "THIS_MONTH";

export function useFinancialReport() {
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const initialRange = getPresetRange(defaultPreset);
  const [preset, setPreset] = useState<FinancialReportPreset>(defaultPreset);
  const [draftRange, setDraftRange] = useState<FinancialReportRange>(initialRange);
  const [range, setRange] = useState<FinancialReportRange>(initialRange);
  const [report, setReport] = useState<FinancialReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!shopSlug) return;
    setIsLoading(true);
    setError(null);
    try {
      setReport(await getFinancialReport(shopSlug, range));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load financial report"));
    } finally {
      setIsLoading(false);
    }
  }, [range, shopSlug]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const handlePresetChange = (nextPreset: FinancialReportPreset) => {
    setPreset(nextPreset);
    setRangeError(null);
    if (nextPreset === "CUSTOM") return;
    const nextRange = getPresetRange(nextPreset);
    setDraftRange(nextRange);
    setRange(nextRange);
  };

  const handleApplyRange = () => {
    if (!draftRange.start || !draftRange.end || draftRange.start > draftRange.end) {
      setRangeError("Start date must be before or equal to end date.");
      return;
    }
    setRangeError(null);
    setPreset("CUSTOM");
    setRange(draftRange);
  };

  return {
    report,
    isLoading,
    error,
    rangeError,
    preset,
    range: draftRange,
    setRange: setDraftRange,
    handlePresetChange,
    handleApplyRange,
    refetch,
  };
}
