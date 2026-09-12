import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getListService, updateServiceStatus } from "@/services/serviceService";
import type { Service, ServiceListQuery } from "@/types/service";

const PAGE_SIZE = 5;
type StatusTab = "all" | "active" | "inactive";

export const useServiceManagement = () => {
  const { t } = useTranslation("service");
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0, counts: { all: 0, active: 0, inactive: 0, categories: 0 } });
  const [search, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTabState] = useState<StatusTab>("all");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedServiceIds, setExpandedServiceIds] = useState<string[]>([]);
  const [pendingServiceIds, setPendingServiceIds] = useState<string[]>([]);
  const requestId = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const sort = sortColumn
    ? ({ product: `NAME_${sortOrder.toUpperCase()}`, price: `PRICE_${sortOrder.toUpperCase()}`, duration: `DURATION_${sortOrder.toUpperCase()}` }[sortColumn] as ServiceListQuery["sort"])
    : "RECENT";
  const query = useMemo<ServiceListQuery>(() => ({ page, limit: PAGE_SIZE, search: debouncedSearch || undefined, status: activeTab === "all" ? undefined : activeTab === "active" ? "ACTIVE" : "INACTIVE", sort }), [activeTab, debouncedSearch, page, sort]);

  const reload = useCallback(async () => {
    if (!shopSlug) return;
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getListService(shopSlug, query);
      if (currentRequest !== requestId.current) return;
      setServiceList(result.items);
      setMeta(result.meta);
    } catch (requestError) {
      if (currentRequest === requestId.current) setError(getApiErrorMessage(requestError, t("messages.loadError")));
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  }, [query, shopSlug, t]);

  useEffect(() => { void reload(); }, [reload]);

  const setSearch = (value: string) => { setSearchValue(value); setPage(1); };
  const setActiveTab = (tab: StatusTab) => { setActiveTabState(tab); setPage(1); };
  const handleSort = (column: string) => {
    if (sortColumn === column) setSortOrder((current) => current === "asc" ? "desc" : "asc");
    else { setSortColumn(column); setSortOrder("asc"); }
    setPage(1);
  };
  const handleStatusChange = async (serviceId: string, isActive: boolean) => {
    if (!shopSlug || pendingServiceIds.includes(serviceId)) return;
    setPendingServiceIds((current) => [...current, serviceId]);
    setError(null);
    try {
      await updateServiceStatus(shopSlug, serviceId, isActive);
      await reload();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t("messages.statusError")));
    } finally {
      setPendingServiceIds((current) => current.filter((id) => id !== serviceId));
    }
  };
  const counts = meta.counts;
  const tabs = [{ id: "all", label: "All", count: counts.all }, { id: "active", label: "Active", count: counts.active }, { id: "inactive", label: "Inactive", count: counts.inactive }] as const;
  const rangeStart = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const rangeEnd = Math.min(meta.page * meta.limit, meta.total);
  return { serviceList, sortedServiceList: serviceList, isLoading, error, reload, handleSort, handleStatusChange, pendingServiceIds, counts, tabs, activeTab, setActiveTab, search, setSearch, sortColumn, sortOrder, page: meta.page, total: meta.total, totalPages: meta.totalPages, rangeStart, rangeEnd, setPage, expandedServiceIds, setExpandedServiceIds };
};
