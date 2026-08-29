import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTopCustomer } from "@/services/customerService";
import { useAsync } from "@/hooks/common/useAsync";

export const useTopCustomer = (limit: number = 5) => {
  const { shopSlug } = useParams();
  const { isLoading, error, run } = useAsync();
  const [topCustomers, setTopCustomers] = useState<any[]>([]);

  useEffect(() => {
    if (!shopSlug) return;
    run(async () => {
      const data = await getTopCustomer(shopSlug, limit);
      setTopCustomers(data);
      return data;
    }, "Không tải được danh sách khách hàng");
  }, [shopSlug, limit]);

  return { topCustomers, isLoading, error };
};
