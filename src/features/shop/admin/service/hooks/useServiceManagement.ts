import { getListService, updateServiceStatus } from "@/services/serviceService";
import type { Service, ServiceListQuery } from "@/types/service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const PAGE_SIZE = 5;
type StatusTab = "all" | "active" | "inactive";

export const useServiceManagement = () => {
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

  useEffect(() => { const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300); return () => window.clearTimeout(timer); }, [search]);
  const sort = sortColumn ? ({ product: `NAME_${sortOrder.toUpperCase()}`, price: `PRICE_${sortOrder.toUpperCase()}`, duration: `DURATION_${sortOrder.toUpperCase()}` }[sortColumn] as ServiceListQuery["sort"]) : "RECENT";
  const query = useMemo<ServiceListQuery>(() => ({ page, limit: PAGE_SIZE, search: debouncedSearch || undefined, status: activeTab === "all" ? undefined : activeTab === "active" ? "ACTIVE" : "INACTIVE", sort }), [page, debouncedSearch, activeTab, sort]);
  const reload = useCallback(async () => {
    if (!shopSlug) return;
    setIsLoading(true); setError(null);
    try { const result = await getListService(shopSlug, query); setServiceList(result.items); setMeta(result.meta); }
    catch { setError("Không tải được dữ liệu dịch vụ"); }
    finally { setIsLoading(false); }
  }, [shopSlug, query]);
  useEffect(() => { reload(); }, [reload]);

  const setSearch = (value: string) => { setSearchValue(value); setPage(1); };
  const setActiveTab = (tab: StatusTab) => { setActiveTabState(tab); setPage(1); };
  const handleSort = (column: string) => { if (sortColumn === column) setSortOrder((current) => current === "asc" ? "desc" : "asc"); else { setSortColumn(column); setSortOrder("asc"); } setPage(1); };
  const handleStatusChange = async (serviceId: string, isActive: boolean) => {
    if (!shopSlug) return;
    setServiceList((current) => current.map((service) => service.id === serviceId ? { ...service, isActive } : service));
    try { await updateServiceStatus(shopSlug, serviceId, isActive); await reload(); }
    catch { setError("Không cập nhật được trạng thái"); await reload(); }
  };
  const counts = meta.counts;
  const tabs = [{ id: "all", label: "All", count: counts.all }, { id: "active", label: "Active", count: counts.active }, { id: "inactive", label: "Inactive", count: counts.inactive }] as const;
  const rangeStart = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const rangeEnd = Math.min(meta.page * meta.limit, meta.total);
  return { serviceList, sortedServiceList: serviceList, isLoading, error, reload, handleSort, handleStatusChange, counts, tabs, activeTab, setActiveTab, search, setSearch, sortColumn, sortOrder, page: meta.page, totalPages: meta.totalPages, rangeStart, rangeEnd, setPage, expandedServiceIds, setExpandedServiceIds };
};
