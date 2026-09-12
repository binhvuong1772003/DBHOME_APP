import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
import { getListStaff } from "@/services/staffService";
import type { Staff } from "@/features/shop/admin/staff/types/staff";

export const useStaffs = () => {
  const { t } = useTranslation("appointment");
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const fetchStaffs = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    if (!shopSlug) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getListStaff(shopSlug);
      if (requestId === requestIdRef.current) setStaffs(data ?? []);
    } catch (requestError) {
      if (requestId !== requestIdRef.current) return;
      setStaffs([]);
      setError(
        getApiErrorMessage(requestError, t("toolbar.staffLoadError")),
      );
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [shopSlug, t]);

  useEffect(() => {
    void fetchStaffs();
    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchStaffs]);

  return { staffs, isLoading, error, refetch: fetchStaffs };
};
