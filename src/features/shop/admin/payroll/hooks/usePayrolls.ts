import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPayrolls } from "../services/payrollService";
import type { Payroll, PayrollFilters } from "../types/payroll";
import { getApiError } from "../utils/payroll";
export function usePayrolls(filters: PayrollFilters) {
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const { periodStart, periodEnd, status, staffId } = filters;
  const [items, setItems] = useState<Payroll[]>([]); const [isLoading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const refetch = useCallback(async () => { if (!shopSlug) return; setLoading(true); setError(null); try { setItems(await getPayrolls(shopSlug, { periodStart, periodEnd, status, staffId })); } catch (e) { setError(getApiError(e)); } finally { setLoading(false); } }, [shopSlug, periodStart, periodEnd, status, staffId]);
  useEffect(() => { void refetch(); }, [refetch]); return { items, isLoading, error, refetch, shopSlug };
}
