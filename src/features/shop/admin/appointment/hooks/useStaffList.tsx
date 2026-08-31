import { useEffect, useState } from "react";
import { getListStaff } from "@/services/staffService";
import type { Staff } from "@/features/shop/admin/staff/types/staff";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
export const useStaffList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  useEffect(() => {
    if (!shopSlug) return;

    const fetchStaffList = async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        const staffList = await getListStaff(shopSlug);
        setStaff(staffList);
      } catch (error) {
        setApiError(
          error instanceof AxiosError
            ? error.response?.data?.error?.message ||
                error.response?.data?.message ||
                "Lấy dữ liệu thất bại"
            : "Đã xảy ra lỗi không xác định",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffList();
  }, []);
  return { staff, isLoading, apiError };
};
