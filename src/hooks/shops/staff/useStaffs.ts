import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { getListStaff } from "@/services/staffService";

export const useStaffs = () => {
  const { shopSlug } = useParams();
  const { isLoading, error, run } = useAsync();
  const [staffs, setStaffs] = useState<any[]>([]);
  useEffect(() => {
    if (!shopSlug) return;
    run(async () => {
      const data = await getListStaff(shopSlug);
      setStaffs(data);
      return data;
    }, "Không tải được danh sách nhân viên");
  }, [shopSlug]);
  return {
    staffs,
    isLoading,
    error,
  };
};
