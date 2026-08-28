import { getListService, updateServiceStatus } from "@/services/serviceService";
import type { Service } from "@/types/service";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

export const useServiceManagement = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceList, setServiceList] = useState<Service[] | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">(
    "all",
  );
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedServiceIds, setExpandedServiceIds] = useState<string[]>([]);
  useEffect(() => {
    if (!shopSlug) {
      console.log("return vì shopSlug null");
      return;
    }
    const fetch = async () => {
      try {
        const data = await getListService(shopSlug);
        console.log("data:", data);
        setServiceList(data);
      } catch (err) {
        console.log("lỗi:", err);
        setError("Không tải được dữ liệu shop");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [shopSlug]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleStatusChange = async (serviceId: string, isActive: boolean) => {
    if (!serviceList || !shopSlug) return;

    setServiceList(
      serviceList.map((s) => (s.id === serviceId ? { ...s, isActive } : s)),
    );

    try {
      await updateServiceStatus(shopSlug, serviceId, isActive);
      console.log("✅ Status updated successfully");
    } catch (err) {
      console.error("❌ Update status error:", err);
      setError("Không cập nhật được trạng thái");
      setServiceList(
        serviceList.map((s) =>
          s.id === serviceId ? { ...s, isActive: !isActive } : s,
        ),
      );
    }
  };

  // Derived counts for the tab strip — pure read of existing data, no new fetch.
  const counts = useMemo(() => {
    if (!serviceList) return { all: 0, active: 0, inactive: 0 };
    return {
      all: serviceList.length,
      active: serviceList.filter((s) => s.isActive).length,
      inactive: serviceList.filter((s) => !s.isActive).length,
    };
  }, [serviceList]);

  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "active", label: "Active", count: counts.active },
    { id: "inactive", label: "Inactive", count: counts.inactive },
  ] as const;

  const sortedServiceList = useMemo(() => {
    if (!serviceList) return serviceList;

    // Filter by tab
    let filtered = [...serviceList];
    if (activeTab === "active") {
      filtered = filtered.filter((service) => service.isActive);
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((service) => !service.isActive);
    }

    // Sort if sortColumn is set
    if (!sortColumn) return filtered;

    const sorted = filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case "product":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "status":
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        case "category":
          aValue = a.categoryId || "";
          bValue = b.categoryId || "";
          break;
        case "price":
          aValue = a.basePrice ?? 0;
          bValue = b.basePrice ?? 0;
          break;
        case "duration":
          aValue = a.durationMin ?? 0;
          bValue = b.durationMin ?? 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [serviceList, activeTab, sortColumn, sortOrder]);
  return {
    serviceList,
    isLoading,
    error,
    handleSort,
    handleStatusChange,
    counts,
    tabs,
    sortedServiceList,
    activeTab,
    setActiveTab,
    sortColumn,
    sortOrder,
    expandedServiceIds,
    setExpandedServiceIds,
  };
};
