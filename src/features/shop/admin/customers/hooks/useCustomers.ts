import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getCustomers } from "../services/customerService";
import type { CustomerListItem, CustomerListMeta, CustomerListQuery, CustomerRetentionFilter, CustomerSort } from "../types/customer";

const initialMeta: CustomerListMeta = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  summary: { totalCustomers: 0, returningCustomers: 0, newCustomers: 0, neverVisited: 0 },
};

export function useCustomers() {
  const { shopSlug = "" } = useParams<{ shopSlug: string }>();
  const [items, setItems] = useState<CustomerListItem[]>([]);
  const [meta, setMeta] = useState(initialMeta);
  const [page, setPageState] = useState(1);
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSortState] = useState<CustomerSort>("SPEND_DESC");
  const [retention, setRetentionState] = useState<CustomerRetentionFilter>("ALL");
  const [hasUpcomingAppointment, setHasUpcomingAppointment] = useState<boolean | undefined>(undefined);
  const [lastVisitBefore, setLastVisitBefore] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const query = useMemo<CustomerListQuery>(() => ({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    sort,
    retention,
    hasUpcomingAppointment,
    lastVisitBefore: lastVisitBefore || undefined,
  }), [debouncedSearch, hasUpcomingAppointment, lastVisitBefore, page, retention, sort]);

  const load = useCallback(async () => {
    if (!shopSlug) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCustomers(shopSlug, query);
      setItems(result.data);
      setMeta(result.meta);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load customers"));
    } finally {
      setIsLoading(false);
    }
  }, [query, shopSlug]);

  useEffect(() => { void load(); }, [load]);

  const setSearch = (value: string) => { setSearchState(value); setPageState(1); };
  const setSort = (value: CustomerSort) => { setSortState(value); setPageState(1); };
  const setRetention = (value: CustomerRetentionFilter) => { setRetentionState(value); setPageState(1); };
  const setUpcoming = (value: boolean | undefined) => { setHasUpcomingAppointment(value); setPageState(1); };
  const setLastVisit = (value: string) => { setLastVisitBefore(value); setPageState(1); };
  const setPage = (value: number) => setPageState(Math.max(1, value));
  const resetFilters = () => {
    setSearchState(""); setDebouncedSearch(""); setSortState("SPEND_DESC"); setRetentionState("ALL"); setHasUpcomingAppointment(undefined); setLastVisitBefore(""); setPageState(1);
  };

  return { shopSlug, items, meta, query, page, setPage, search, setSearch, sort, setSort, retention, setRetention, hasUpcomingAppointment, setUpcoming, lastVisitBefore, setLastVisit, resetFilters, isLoading, error, refetch: load };
}
