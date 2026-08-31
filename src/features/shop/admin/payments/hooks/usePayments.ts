import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getPayments } from "../services/paymentService";
import type { Payment, PaymentDatePreset, PaymentFilters, PaymentListMeta } from "../types/payment";
import { getPaymentPresetRange } from "../utils/paymentDateRange";

const initialRange = getPaymentPresetRange("THIS_MONTH");
const emptyMeta: PaymentListMeta = {
  total: 0, page: 1, limit: 20, totalPages: 1, hasNext: false, hasPrev: false,
  summary: { totalCollected: 0, transactions: 0, statusCounts: { PENDING: 0, PARTIAL: 0, PAID: 0, REFUNDED: 0 } },
};

export function usePayments() {
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const [items, setItems] = useState<Payment[]>([]);
  const [meta, setMeta] = useState<PaymentListMeta>(emptyMeta);
  const [page, setPage] = useState(1);
  const [preset, setPresetState] = useState<PaymentDatePreset>("THIS_MONTH");
  const [filters, setFilters] = useState<PaymentFilters>(initialRange);
  const [draft, setDraft] = useState<PaymentFilters>(initialRange);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!shopSlug) return;
    setIsLoading(true); setError(null);
    try {
      const result = await getPayments(shopSlug, { page, limit: 20, ...filters });
      setItems(result.data); setMeta(result.meta);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load payments"));
    } finally { setIsLoading(false); }
  }, [filters, page, shopSlug]);

  useEffect(() => { void load(); }, [load]);

  const setPreset = (next: PaymentDatePreset) => {
    setPresetState(next); setRangeError(null);
    if (next === "CUSTOM") return;
    const range = getPaymentPresetRange(next);
    const nextFilters = { ...draft, ...range };
    setDraft(nextFilters); setFilters(nextFilters); setPage(1);
  };
  const applyFilters = () => {
    if (!draft.from || !draft.to || draft.from > draft.to) {
      setRangeError("invalidRange"); return false;
    }
    setRangeError(null); setFilters({ ...draft, search: draft.search?.trim() || undefined }); setPage(1); return true;
  };
  const clearFilters = () => {
    const range = getPaymentPresetRange("THIS_MONTH");
    setPresetState("THIS_MONTH"); setDraft(range); setFilters(range); setRangeError(null); setPage(1);
  };

  return { shopSlug, items, meta, page, setPage, preset, setPreset, filters, draft, setDraft, applyFilters, clearFilters, isLoading, error, rangeError, refetch: load };
}
