import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopCustomer } from "@/services/customerService";
import type { TopCustomer } from "@/services/customerService";
import { useAsync } from "@/hooks/common/useAsync";

export const useTopCustomer = (limit: number = 5) => {
  const { shopSlug } = useParams();
  const { isLoading, error, run } = useAsync();
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!shopSlug) return;
    run(async () => {
      const data = await getTopCustomer(shopSlug, limit);
      setTopCustomers(data);
      return data;
    }, "Không tải được danh sách khách hàng");
  }, [shopSlug, limit, requestVersion, run]);

  return {
    topCustomers,
    isLoading,
    error,
    retry: () => setRequestVersion((version) => version + 1),
  };
};
