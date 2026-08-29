import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { countService } from "@/services/serviceService";
import { useAsync } from "@/hooks/common/useAsync";

export const useCountService = (limit: number = 5) => {
  const { shopSlug } = useParams();
  const { isLoading, error, run } = useAsync();
  const [countServices, setCountServices] = useState<number>(0);

  useEffect(() => {
    if (!shopSlug) return;
    run(async () => {
      const data = await countService(shopSlug);
      setCountServices(data);
      return data;
    }, "Không tải được danh sách khách hàng");
  }, [shopSlug, limit]);

  return { countServices, isLoading, error };
};
